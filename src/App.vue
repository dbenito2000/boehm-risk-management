<template>
  <v-app id="inspire">
    <v-system-bar app style="-webkit-app-region: drag" height="35">
      <v-img style="margin-top: 3px">
        <img
          src="https://bisite.usal.es/archivos/usal_es_hor.png"
          alt="topbar-icon"
          width="60"
          height="18"
        />
      </v-img>
      Risk Management
      <v-spacer></v-spacer>
      <v-icon @click="minimizeWindow" style="-webkit-app-region: no-drag"
        >mdi-minus</v-icon
      >
      <v-icon @click="maximizeWindow" style="-webkit-app-region: no-drag"
        >mdi-checkbox-blank-outline</v-icon
      >
      <v-icon @click="closeWindow" style="-webkit-app-region: no-drag"
        >mdi-close</v-icon
      >
    </v-system-bar>

    <v-navigation-drawer permanent app v-if="tab != -1">
      <v-divider></v-divider>

      <v-list nav>
        <v-list-item-group v-model="selectedItem">
          <v-list-item
            v-for="[icon, text, num] in links"
            :key="num"
            link
            @click="tab = num"
          >
            <v-list-item-icon>
              <v-icon>{{ icon }}</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>{{ text }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
      <template v-slot:append>
        <div class="pa-2" @click="tab = -1">
          <v-btn block> MENU </v-btn>
        </div>
      </template>
    </v-navigation-drawer>

    <v-main>
      <v-container class="fill-height" fluid>
        <v-row v-if="tab == -1" class="fill-height" align="stretch">
          <v-col cols="12">
            <template>
              <v-card height="100%">
                <v-subheader>
                  <h1>Selección de proyecto</h1>
                </v-subheader>

                <v-card-text class="d-inline-flex">
                  <v-card
                    v-for="item in projects"
                    :key="item.id"
                    elevation="2"
                    width="200"
                    class="ma-3"
                    @click="tab = 0"
                  >
                    <v-card-title>
                      {{ item.name }}
                    </v-card-title>
                    <v-card-subtitle> 3 Riesgos Identificados </v-card-subtitle>
                    <v-card-actions>
                      <v-btn
                        color="deep-purple lighten-2"
                        text
                        @click="tab = 0"
                      >
                        Editar
                      </v-btn>
                      <v-btn
                        color="deep-purple lighten-2"
                        text
                        @click="tab = 0"
                      >
                        Eliminar
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                  <v-card elevation="2" width="200" class="ma-3" height="100%">
                    <v-card-text
                      class="d-flex align-center justify-center h-100"
                    >
                      <v-spacer></v-spacer>
                      <v-btn> Nuevo proyecto </v-btn>
                    </v-card-text>
                  </v-card>
                </v-card-text>
              </v-card>
            </template>
          </v-col>
        </v-row>

        <v-row v-if="tab == 0" class="fill-height">
          <v-col cols="12">
            <template>
              <v-card height="100%">
                <v-subheader> Factores de Riesgo </v-subheader>

                <v-card-text>
                  <v-data-table
                    :headers="headers"
                    :items="projects[selected].factors"
                    :items-per-page="10"
                    class="elevation-1"
                  ></v-data-table>
                </v-card-text>
              </v-card>
            </template>
          </v-col>
        </v-row>
        <v-row v-if="tab == 1" class="fill-height">
          <v-col cols="12">
            <template>
              <v-card height="100%">
                <v-subheader> Exportar Informe </v-subheader>

                <v-card-text>
                  <v-select
                    v-model="select"
                    :items="['PDF', 'XLSX']"
                    :rules="[(v) => !!v || 'Item is required']"
                    label="Formato"
                    required
                  ></v-select>
                  <v-btn
                    color="success"
                    class="mr-4"
                    @click="validate"
                  >
                    Exportar
                  </v-btn>
                </v-card-text>
              </v-card>
            </template>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
const { ipcRenderer } = window.require("electron");

export default {
  data: () => ({
    tab: -1,
    links: [
      ["mdi-magnify", "Identificación", 0],
      ["mdi-account", "Informe", 1],
    ],
    headers: [
      { text: "Factor", value: "name" },
      { text: "Categoría", value: "categoria" },
      { text: "Probabilidad", value: "probabilidad" },
      { text: "Impacto", value: "impacto" },
    ],
    selected: 0,
    projects: [
      {
        id: 1,
        name: "Proyecto 1",
        factors: [
          {
            name: "Cliente cambie los requerimientos...",
            categoria: "Entorno desarrollo",
            probabilidad: "0%",
            impacto: "critico",
          },
          {
            name: "Cliente cambie los requerimientos...",
            categoria: "Entorno desarrollo",
            probabilidad: "0%",
            impacto: "critico",
          },
          {
            name: "Cliente cambie los requerimientos...",
            categoria: "Entorno desarrollo",
            probabilidad: "0%",
            impacto: "critico",
          },
        ],
      },
      {
        id: 2,
        name: "Proyecto 2",
        factors: [
          {
            name: "Cliente cambie los requerimientos...",
            categoria: "Entorno desarrollo",
            probabilidad: "0%",
            impacto: "critico",
          },
        ],
      },
      {
        id: 3,
        name: "Proyecto 3",
        factors: [
          {
            name: "Cliente cambie los requerimientos...",
            categoria: "Entorno desarrollo",
            probabilidad: "0%",
            impacto: "critico",
          },
        ],
      },
    ],
  }),
  computed: {},
  mounted: async function () {},
  methods: {
    closeWindow() {
      ipcRenderer.send("close-window");
    },
    minimizeWindow() {
      ipcRenderer.send("minimize-window");
    },
    maximizeWindow() {
      ipcRenderer.send("maximize-window");
    },
    eliminarProyecto(id) {
      this.projects = this.projects.filter((item) => item.id != id);
      this.save();
    },
    anadirProyecto() {
      
    },
    save() {
      ipcRenderer.invoke('save', this.projects);
    }
  },
};
</script>

<style>
html {
  overflow-y: auto !important;
}

.ps {
  height: 80vh;
}

.v-toast__text {
  font-family: "Roboto", sans-serif;
}
</style>