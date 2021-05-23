<template>
  <div>

    <!-- WELCOME MESSAGE, PAGE MESSAGE -->
    <div class="text-center text-h3 ma-5">
      {{ page.fields.header }}
    </div>

    <!-- CAROUSEL, IMG SLIDESHOW -->
    <v-sheet rounded elevation="5">
      <v-img
        alt="Electronics image"
        cover
        src="https://www.nutsvolts.com/uploads/articles/NV_0704_Christopherson_Large.jpg"
        transition="scale-transition"
        max-height="200"
      />

      <v-container fluid>
        <v-row justify="center">
          <v-col cols="12" sm="11" md="10" lg ="9" xl ="8">
            <div class="text--secondary">
              {{ page.fields.site_description }}
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-sheet>

    <!-- PROJECT PREVIEWS HEADER -->
    <v-container fluid>
      <v-row class="text-start">
        <v-col class="ma-4">
          <div class="subheading display-1">
            Featured projects
          </div>
        </v-col>
      </v-row>
    </v-container>

    <!-- PROJECT INFO AND CARDS -->
    <v-container>
      <v-row>
        <v-col
          v-for="project in page.fields.featured"
          :key="project.project.slug"
          cols="4"
        >
          <v-card :to="'/projects/' + project.project.slug">
            <v-img
              height="10em"
              contain
              :src="project.project.fields.photo"
            />
            <!-- We don't want to break the title in the middle of a word, so apply word-break -->
            <v-card-title style="word-break: normal;">{{ project.project.fields.name }}</v-card-title>
            <v-card-subtitle>{{ project.project.fields.description }}</v-card-subtitle>
          </v-card>
        </v-col>

        <!-- Check out more projects link... -->
        <v-col
          cols="4"
        >
          <v-card to="/projects" height="15em" class="d-flex align-center">
            <div class="text-h4 text-center">Check out more projects...</div>
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
      page: {
        slug: '',
        fields: {
        },
      }
    }
  },

  methods: {
    getPage() {
      butter.page.retrieve("*", this.slug)
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
      vm.getPage();
    })
  },
};
</script>