<template>
  <div>
    <div class="text-center text-h3 ma-5">
      Projects
    </div>

    <v-container fluid>
      <v-row class="text-start">
        <v-col class="ma-4">
          <div class="subheading display-1">
            Completed, in progress
          </div>
        </v-col>
      </v-row>
    </v-container>

    <!-- PROJECT INFO AND CARDS -->
    <v-container>
      <v-row>
        <v-col
          v-for="project in pages"
          :key="project.slug"
          cols="4"
        >
          <v-card :to="'/project/' + project.slug">
            <v-img
              height="10em"
              contain
              :src="project.fields.photo"
            />
            <!-- We don't want to break the title in the middle of a word, so apply word-break -->
            <v-card-title style="word-break: normal;">{{ project.fields.name }}</v-card-title>
            <v-card-subtitle>{{ project.fields.description }}</v-card-subtitle>
          </v-card>
        </v-col>     
      </v-row>
    </v-container>


    <v-container fluid>
      <v-row class="text-start">
        <v-col class="ma-4">
          <div class="subheading display-1">
            Coming soon...
          </div>
        </v-col>
      </v-row>
    </v-container>

    <!-- PROJECT INFO AND CARDS -->
    <v-container>
      <v-row>
        <v-col
          v-for="project in page.fields.projects.info"
          :key="project.name"
          cols="4"
        >
          <v-card>
            <v-img
              height="10em"
              contain
              :src="project.photo"
            />
            <!-- We don't want to break the title in the middle of a word, so apply word-break -->
            <v-card-title style="word-break: normal;">{{ project.name }}</v-card-title>
            <v-card-subtitle>{{ project.description }}</v-card-subtitle>
          </v-card>
        </v-col>     
      </v-row>
    </v-container>


  </div>
</template>

<script>
import { butter } from "@/buttercms";

export default {
  data() {
    return {
      slug: this.$route.name,
      pages: [],
      page: {fields: {projects: {}}},
    }
  },

  methods: {
    getPageType() {
      butter.page.list(this.slug)
      .then((res) => {
        console.log(res.data.data)
        this.pages = res.data.data
      })
      .catch((err) => {
        alert('Error fetching content', err)
      });
    },
    getPage() {
      butter.page.retrieve('*', 'coming-soon')
      .then((res) => {
        console.log(res.data.data)
        this.page = res.data.data
      })
      .catch((err) => {
        alert('Error fetching content', err)
      });
    },
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.getPageType();
      vm.getPage();
    })
  },
};
</script>