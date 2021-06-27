<template>
  <v-app>

    <!-- Navigation to different site pages -->
    <v-app-bar app dark dense>
      <!-- for some reason the width of the toolbar div wouldn't expand to fit 
      all the text (justin silver). To avoid the elipsis, I just threw an overflow visible to render
      the content outside of the toolbar title. -->
      <v-toolbar-title style="overflow:visible;">
        <!-- Clicking on logo also redirects to main page -->
        <router-link to="/" class="text-decoration-none white--text">
          <span class="text-h5">
            JUSTIN <span class="font-weight-bold">SILVER</span>
          </span>
        </router-link>
      </v-toolbar-title>

      <!-- If the viewport is too small, we'll render the tabs in the extended slot  -->
      <template v-if="$vuetify.breakpoint.xs" v-slot:extension>
        <v-tabs centered ref="tabs">
          <v-tab v-for="link in links" :key="link.name" :to="link.link">
            {{ link.name }}
          </v-tab>
        </v-tabs>
      </template>

      <!-- otherwise, navigation is to the right of my name all on the same row  -->
      <v-tabs v-if="!$vuetify.breakpoint.xs" right class="pr-5" ref="tabs">
        <v-tab v-for="link in links" :key="link.name" :to="link.link">
          {{ link.name }}
        </v-tab>
      </v-tabs>
    </v-app-bar>

    <!-- Actual view that we're rendering with vue-router -->
    <v-main>
      <router-view />
    </v-main>

    <!-- Footer for my name, GitHub and LinkedIn links and butterCMS -->
    <v-footer dark>
      <v-container fluid class="pa-0">
        <v-row no-gutters justify="space-between">
          <v-col cols="auto" class="d-flex">
          <strong class="heading-1 ma-auto">2021 Justin Silver</strong>
          </v-col>
          <v-spacer></v-spacer>
          <v-col cols="auto">
            <!-- GitHub and LinkedIn links -->
            <!-- target="_blank" for opening in new tab -->
            <v-btn
              target="_blank"
              v-for="icon in icons"
              :key="icon.name"
              :href="icon.link"
              icon
              dark
              class="mx-sm-1"
            >
              <v-icon size="1.5rem" dark>
                {{ icon.name }}
              </v-icon>
            </v-btn>

            <!-- ButterCMS logo -->
            <v-btn 
              class="px-sm-1 px-0"
              text target="_blank" 
              href="https://buttercms.com/" 
              style="max-height: 1.5rem;">
              <v-img
                alt="Butter CMS logo"
                src="@/assets/buttercms_logo_white.png"
                max-width="7.3rem"
              />
            </v-btn>
  </v-col>
        </v-row>
    </v-container>

        </v-footer>
  </v-app>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      links: [
        {name: "Home", link: "/"}, 
        {name: "Projects", link: "/project"}, 
        {name: "Contact", link: "/contact"},
      ],
      icons: [
        { name: "mdi-github", link: "https://www.github.com/j-silv" },
        { name: "mdi-linkedin", link: "https://www.linkedin.com/in/justin-silver/" },
      ],
    };
  },
  methods: {
    resizeTabs() {
      // issue related to tab highlights not staying in sync with tab tiles
      // described here: https://github.com/vuetifyjs/vuetify/issues/4733
      this.$refs.tabs && this.$refs.tabs.onResize();
    }
  },
  // through trial and error, this is the only Vue lifecycle hook I could find
  // that will update the position of the highlighted tab line
  beforeUpdate() {
    this.resizeTabs();
  },
};
</script>
