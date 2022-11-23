<template>
  <v-app id="inspire">
    <v-system-bar app style="-webkit-app-region: drag" height="35">
      <v-img style="margin-top: 3px">
        <img
          src="https://i.imgur.com/NrOINMS.png"
          alt="topbar-icon"
          width="70"
          height="24"
        />
      </v-img>
      Factores de Riesgo
      <v-spacer></v-spacer>
      <v-icon @click="minimizeWindow" small style="-webkit-app-region: no-drag"
        >mdi-minus</v-icon
      >
      <v-icon @click="maximizeWindow" small style="-webkit-app-region: no-drag"
        >mdi-checkbox-blank-outline</v-icon
      >
      <v-icon @click="closeWindow" small style="-webkit-app-region: no-drag"
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
        <v-row v-if="tab == -1" class="fill-height pa-0" align="stretch">
          <v-col cols="12" class="pa-0">
            <template>
              <v-card height="100%" class="pa-0" color="transparent">
                <!--  <v-subheader>
                  <h1>Selección de proyecto</h1>
                </v-subheader> -->
                <v-card-title> Selección de proyecto </v-card-title>

                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-card
                        v-for="(item, index) in projects"
                        :key="item.name"
                        elevation="2"
                        width="200"
                        class="ma-3"
                        @click="
                          selected = index;
                          tab = 0;
                          selectedItem = 0;
                        "
                      >
                        <v-card-title>
                          {{ item.name }}
                        </v-card-title>
                        <v-card-subtitle>
                          {{ item.factors.length }} Riesgos Identificados
                        </v-card-subtitle>
                        <v-card-actions>
                          <v-btn
                            color="deep-purple lighten-2"
                            text
                            @click="
                              selected = index;
                              tab = 0;
                            "
                          >
                            Editar
                          </v-btn>
                          <v-btn
                            color="deep-purple lighten-2"
                            text
                            @click="eliminarProyecto(item.name)"
                          >
                            Eliminar
                          </v-btn>
                        </v-card-actions>
                      </v-card>

                      <v-card elevation="2" width="200" class="ma-3">
                        <v-card-text
                          class="d-flex align-center justify-center h-100"
                        >
                          <v-spacer></v-spacer>
                          <v-btn @click="newProject = true">
                            Nuevo proyecto
                          </v-btn>
                        </v-card-text>
                      </v-card>
                    </v-row>
                  </v-container>
                </v-card-text>
              </v-card>
            </template>
          </v-col>
        </v-row>

        <v-row v-if="tab == 0 && projects.length > 0" class="fill-height">
          <perfect-scrollbar>
            <v-col cols="12">
              <template>
                <v-card height="100%">
                  <v-subheader>
                    Factores de Riesgo
                    <v-spacer></v-spacer>
                    <v-btn @click="newFactor = true"> Nuevo Factor </v-btn>
                  </v-subheader>

                  <v-card-text v-if="projects.length > 0">
                    <v-data-table
                      :headers="headers"
                      :items="projects[selected].factors"
                      @click:row="editItem"
                    >
                      <template v-slot:item.probabilidad="{ item }">
                        {{ item.probabilidad }}%
                      </template>
                      <template v-slot:item.actions="{ item }">
                        <v-icon small class="mr-2" @click="editItem(item)">
                          mdi-pencil
                        </v-icon>
                        <v-icon small @click="deleteItem(item)">
                          mdi-delete
                        </v-icon>
                      </template>
                      <template v-slot:no-data>
                        <v-btn color="primary" @click="initialize">
                          Reset
                        </v-btn>
                      </template>
                    </v-data-table>
                  </v-card-text>
                </v-card>
              </template>
            </v-col>
          </perfect-scrollbar>
        </v-row>
        <v-row v-if="tab == 1" class="fill-height">
          <v-col cols="12">
            <template>
              <v-card height="100%">
                <v-subheader> Exportar Informe </v-subheader>

                <v-card-text>
                  <v-select
                    v-model="exportType"
                    :items="['PDF']"
                    :rules="[(v) => !!v || 'Item is required']"
                    label="Formato"
                    required
                  ></v-select>
                  <v-btn
                    color="success"
                    class="mr-4"
                    @click="exportar"
                    :loading="exportLoading"
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
    <v-dialog v-model="editFactor" width="500">
      <v-card>
        <v-card-title> Editar Factor de Riesgo </v-card-title>

        <v-card-text v-if="projects.length > 0">
          <v-text-field
            v-model="projects[selected].factors[selectedFactor].name"
            label="Nombre"
          ></v-text-field>
          <v-select
            v-model="projects[selected].factors[selectedFactor].categoria"
            :items="factorCategories"
            label="Tipo"
          ></v-select>
          <v-slider
            max="100"
            label="Probabilidad"
            v-model="projects[selected].factors[selectedFactor].probabilidad"
            min="0"
            thumb-label
          ></v-slider>
          <v-slider
            max="5"
            label="Impacto"
            v-model="projects[selected].factors[selectedFactor].impacto"
            min="1"
            thumb-label
          ></v-slider>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <!-- <v-btn color="primary" text @click="editFactor = false"> Cancelar </v-btn> -->
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="editFactor = false">
            Guardar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="newFactor" width="500">
      <v-card>
        <v-card-title> Nuevo Factor de Riesgo </v-card-title>

        <v-card-text>
          <v-text-field v-model="newFactorName" label="Nombre"></v-text-field>
          <v-select
            v-model="newFactorCategory"
            :items="factorCategories"
            label="Tipo"
          ></v-select>
          <v-slider
            max="100"
            label="Probabilidad"
            v-model="newFactorProbability"
            min="0"
            thumb-label
          ></v-slider>
          <v-slider
            max="5"
            label="Impacto"
            v-model="newFactorImpact"
            min="1"
            thumb-label
          ></v-slider>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-btn color="primary" text @click="newFactor = false">
            Cancelar
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="
              addFactor();
              newFactor = false;
            "
          >
            Guardar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="newProject" width="500">
      <v-card>
        <v-card-title> Nuevo Proyecto </v-card-title>

        <v-card-text>
          <v-text-field v-model="newProjectName" label="Nombre"></v-text-field>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-btn color="primary" text @click="newProject = false">
            Cancelar
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="
              addProject();
              newProject = false;
            "
          >
            Guardar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
const { ipcRenderer } = window.require("electron");

export default {
  data: () => ({
    exportLoading: false,
    exportType: "PDF",
    newProjectName: "",
    newProject: false,
    newFactorName: "",
    newFactorCategory: "",
    newFactorProbability: 0,
    newFactorImpact: 1,
    selectedItem: null,
    newFactor: false,
    editFactor: false,
    selectedFactor: 0,
    tab: -1,
    factorCategories: [
      "Tamaño de Producto",
      "Impacto en la Organización",
      "Tipo de Cliente",
      "Definición de proceso de producción",
      "Entorno de Desarrollo",
      "Tecnología",
      "Experiencia y tamaño de equipo",
    ],
    links: [
      ["mdi-magnify", "Factores", 0],
      ["mdi-account", "Informe", 1],
    ],
    headers: [
      { text: "Factor", width: "40%", value: "name" },
      { text: "Categoría", value: "categoria" },
      { text: "Probabilidad", value: "probabilidad" },
      { text: "Impacto", value: "impacto" },
      { text: "Actions", value: "actions", sortable: false },
    ],
    selected: 0,
    projects: [],
  }),
  computed: {},
  mounted: async function () {
    ipcRenderer.on("error", (event, error) => {
      console.log("[ERROR] " + error);
    });
    this.projects = await ipcRenderer.invoke("load");
    /* console.log(JSON.stringify(this.projects)) */
    console.log("[FRONT] Loaded project list.");
  },
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
    eliminarProyecto(name) {
      this.projects = this.projects.filter((item) => item.name != name);
      this.save();
    },
    save() {
      ipcRenderer.invoke("save", this.projects);
    },
    editItem(item) {
      this.selectedFactor = this.projects[this.selected].factors.indexOf(item);
      this.editFactor = true;
      this.save();
    },
    deleteItem(item) {
      this.projects[this.selected].factors = this.projects[
        this.selected
      ].factors.filter((factor) => factor != item);
      this.save();
    },
    addFactor() {
      this.projects[this.selected].factors.push({
        name: this.newFactorName,
        categoria: this.newFactorCategory,
        probabilidad: this.newFactorProbability,
        impacto: this.newFactorImpact,
      });
      this.newFactorName = "";
      this.newFactorCategory = "";
      this.newFactorProbability = 0;
      this.newFactorImpact = 1;
      this.save();
    },
    async exportar() {
      this.exportLoading = true;
      await ipcRenderer.invoke(
        "export",
        this.projects[this.selected],
        this.exportType
      );
      this.exportLoading = false;
    },
    addProject() {
      this.projects.push({
        name: this.newProjectName,
        factors: [
          {
            name: "Deficiencias del personal",
            categoria: "Experiencia y tamaño de equipo",
            probabilidad: 50,
            impacto: 1,
          },
          {
            name: "Planificaciones y presupuestos poco realistas",
            categoria: "Experiencia y tamaño de equipo",
            probabilidad: 50,
            impacto: 1,
          },
          {
            name: "Comprensión inadecuada de los requisitos",
            categoria: "Experiencia y tamaño de equipo",
            probabilidad: 50,
            impacto: 1,
          },
          {
            name: "Interfaz de usuario poco adecuada",
            categoria: "Experiencia y tamaño de equipo",
            probabilidad: 50,
            impacto: 1,
          },
          {
            name: "Añadir características no necesarias",
            categoria: "Experiencia y tamaño de equipo",
            probabilidad: 50,
            impacto: 1,
          },
          {
            name: "Falta de control sobre los cambios en los requisitos",
            categoria: "Experiencia y tamaño de equipo",
            probabilidad: 50,
            impacto: 1,
          },
          {
            name: "Problemas con los componentes reutilizables y APIs",
            categoria: "Experiencia y tamaño de equipo",
            probabilidad: 50,
            impacto: 1,
          },
          {
            name: "Problemas en las tareas realizadas externamente",
            categoria: "Experiencia y tamaño de equipo",
            probabilidad: 50,
            impacto: 1,
          },
          {
            name: "Tiempo de respuesta pobre",
            categoria: "Experiencia y tamaño de equipo",
            probabilidad: 50,
            impacto: 1,
          },
          {
            name: "Ir más allá de lo que permite la tecnología",
            categoria: "Experiencia y tamaño de equipo",
            probabilidad: 50,
            impacto: 1,
          },
        ],
      });
    },
  },
};
</script>

<style>
html {
  overflow-y: auto !important;
}

.ps {
  height: 100%;
}
</style>