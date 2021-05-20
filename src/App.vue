<template>
  <v-app>

    <!-- Navigation to different site pages -->
    <v-app-bar
      app
      color="dark"
      dark
    >
    <span class="text-no-wrap text-h4">
      <span class="">JUSTIN </span>
      <span class="font-weight-bold">SILVER</span>
    </span>

      <!-- I want the tabs centered, but i'm not sure how to align
      them with the title thats aligned start. Gotta look into documentation
      for tabs and title in app bar -->
      <v-tabs
        right
        class=""
        color="light darken-1"
      >
        <v-tab
          v-for="link in links"
          :key="link"
        >
          {{ link }}
        </v-tab>
      </v-tabs>

    </v-app-bar>

    <!-- Actual view that we're rendering with vue-router -->
    <v-main>
      <router-view/>
    </v-main>

    <!-- Footer for my name, GitHub and LinkedIn links and butterCMS -->
 <v-footer
    light
  >
        <strong class="subheading mr-5">2021 Justin Silver</strong>

        <v-spacer></v-spacer>

        <v-btn
          v-for="icon in icons"
          :key="icon"
          class=""
          icon
        >
          <v-icon size="24px">
            {{ icon }}
          </v-icon>
        </v-btn>
  </v-footer>

  </v-app>
</template>

<script>

export default {
  name: 'App',

  data: () => ({
    links: [
      'Home',
      'Projects',
      'Contact',
    ],
    icons: [
      'mdi-github',
      'mdi-linkedin',
    ]
  }),
};
</script>
