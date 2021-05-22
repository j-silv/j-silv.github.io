<template>
  <v-app>

    <!-- Navigation to different site pages -->
    <v-app-bar
      app
      dark
      dense
    >
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
          <v-tab
            v-for="link in links"
            :key="link"
          >
            {{ link }}
          </v-tab>
        </v-tabs>
      </template>

      <!-- otherwise, navigation is to the right of my name  -->
      <v-tabs
        v-if="!$vuetify.breakpoint.xs"
        right
        class="pr-5"
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
