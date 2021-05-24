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