<template>
  <div>
    <PageHeader content="Projects"></PageHeader>
    <v-divider></v-divider>

    <ColumnWrapper>
      <Subheader content="Completed/in progress"></Subheader>
      <v-container>
        <v-row class="ma-2">
          <v-col
            v-for="project in pages"
            :key="project.slug"
            cols="12"
            sm="6"
            md="4"
          >
            <v-card :to="'/project/' + project.slug">
              <v-img height="10em" contain :src="project.fields.photo" />
              <!-- We don't want to break the title in the middle of a word, so apply word-break -->
              <v-card-title class="word-break">{{
                project.fields.name
              }}</v-card-title>
              <v-card-subtitle>{{
                project.fields.description
              }}</v-card-subtitle>
            </v-card>
          </v-col>
        </v-row>
      </v-container>

      <Subheader content="Coming soon..."></Subheader>
      <v-container>
        <v-row class="ma-2">
          <v-col
            v-for="project in page.fields.projects.info"
            :key="project.name"
            cols="12"
            sm="6"
            md="4"
          >
            <v-card>
              <v-img height="10em" contain :src="project.photo" />
              <!-- We don't want to break the title in the middle of a word, so apply word-break -->
              <v-card-title class="word-break">{{ project.name }}</v-card-title>
              <v-card-subtitle>{{ project.description }}</v-card-subtitle>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </ColumnWrapper>
  </div>
</template>

<script>
import { butter } from "@/buttercms";
import PageHeader from "@/components/PageHeader.vue";
import Subheader from "@/components/Subheader.vue";
import ColumnWrapper from "@/components/ColumnWrapper.vue";

export default {
  components: {
    PageHeader,
    Subheader,
    ColumnWrapper,
  },
  data() {
    return {
      slug: this.$route.name,
      pages: [],
      page: { fields: { projects: {} } },
    };
  },

  methods: {
    getPageType() {
      butter.page
        .list(this.slug)
        .then((res) => {
          //console.log(res.data.data);
          this.pages = res.data.data;
        })
        .catch((err) => {
          alert("Error fetching content", err);
        });
    },
    getPage() {
      butter.page
        .retrieve("*", "coming-soon")
        .then((res) => {
          //console.log(res.data.data);
          this.page = res.data.data;
        })
        .catch((err) => {
          alert("Error fetching content", err);
        });
    },
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.getPageType();
      vm.getPage();
    });
  },
};
</script>
