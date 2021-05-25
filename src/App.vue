<template>
  <v-app>

    <!-- Navigation to different site pages -->
    <v-app-bar app dark dense>
      <!-- for some reason the width of the toolbar div wouldn't expand to fit 
      all the text (justin silver). To avoid the elipsis, I just threw an overflow visible to render
      the content outside of the toolbar title. -->
      <v-toolbar-title style="overflow:visible;">
        <span class="text-h5">
          JUSTIN <span class="font-weight-bold">SILVER</span>
        </span>
      </v-toolbar-title>

      <!-- If the viewport is too small, we'll render the tabs in the extended slot  -->
      <template v-if="$vuetify.breakpoint.xs" v-slot:extension>
        <v-tabs centered>
          <v-tab v-for="link in links" :key="link.name" :to="link.link">
            {{ link.name }}
          </v-tab>
        </v-tabs>
      </template>

      <!-- otherwise, navigation is to the right of my name all on the same row  -->
      <v-tabs v-if="!$vuetify.breakpoint.xs" right class="pr-5">
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
      <strong class="subheading mr-5">2021 Justin Silver</strong>

      <v-spacer></v-spacer>

      <!-- target="_blank" for opening in new tab -->
      <v-btn
        target="_blank"
        v-for="icon in icons"
        :key="icon.name"
        :href="icon.link"
        icon
        dark
        class="mx-2"
      >
        <v-icon size="30px" dark>
          {{ icon.name }}
        </v-icon>
      </v-btn>

      <v-btn text target="_blank" href="https://buttercms.com/" style="max-height: 30px;">
        <v-img
          alt="Butter CMS logo"
          src="@/assets/buttercms_logo_white.png"
          transition="scale-transition"
          max-width="140"
        />
      </v-btn>
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
        { name: "mdi-github", link: "https://www.github.com/sir-drako" },
        { name: "mdi-linkedin", link: "https://www.linkedin.com/in/justin-silver/" },
      ],
    };
  },
};
</script>
