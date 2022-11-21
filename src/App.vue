<template>

  <v-app id="inspire">
    <v-system-bar app style="-webkit-app-region: drag" height="35">
      <v-img style="margin-top:3px">
        <img src="https://bisite.usal.es/archivos/bisite_es.png" alt="topbar-icon" width="42" height="18">
      </v-img>
      Risk Management Electron
      <v-spacer></v-spacer>
      <v-icon @click="minimizeWindow" style="-webkit-app-region: no-drag">mdi-minus</v-icon>
      <v-icon @click="maximizeWindow" style="-webkit-app-region: no-drag">mdi-checkbox-blank-outline</v-icon>
      <v-icon @click="closeWindow" style="-webkit-app-region: no-drag">mdi-close</v-icon>
    </v-system-bar>

    <v-navigation-drawer permanent app>

     


      <v-divider></v-divider>

      <v-list nav>
        <v-list-item-group v-model="selectedItem">
          <v-list-item v-for="[icon, text, num] in links" :key="num" link @click="tab = num">
            <v-list-item-icon>
              <v-icon>{{ icon }}</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>{{ text }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>

    <v-main>

      <v-container class="py-8 px-6" fluid>

        <v-row v-if="tab == 0">
          <v-col cols="12">
            <template>
             
              <v-card>

                <v-subheader>

                  Card base
                </v-subheader>

                <v-card-text>
                 Card Form

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



const { ipcRenderer } = window.require('electron')

export default {
  data: () => ({
    
    tab: 0,
    links: [
      ['mdi-play', 'Option 1', 0],
      ['mdi-account', 'Option 2', 1]
    ],
  }),
  computed: {
    
  },
  mounted: async function () {

    

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
  }
}
</script>

<style>
html {
  overflow-y: auto !important
}

.ps {
  height: 80vh;
}

.v-toast__text {
  font-family: "Roboto", sans-serif;
}
</style>