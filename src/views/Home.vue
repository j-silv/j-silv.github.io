<template>
  <div>
    <!-- WELCOME MESSAGE, PAGE MESSAGE -->
    <PageHeader :content="page.fields.header"></PageHeader>
    <v-divider></v-divider>

    <!-- CAROUSEL, IMG SLIDESHOW -->
    <v-sheet rounded elevation="5">
      <v-carousel cycle continuous hide-delimiters height="300">
        <!-- my-auto to get the img to center within responsive container -->
        <v-carousel-item
          content-class="my-auto"
          v-for="(photo, i) in page.fields.carousel"
          :key="i"
        >
          <v-img
            alt="Carousel img preview"
            contain
            :src="photo.photo"
            transition="scale-transition"
            max-height="300"
          />
        </v-carousel-item>
      </v-carousel>

      <!-- WEBSITE DESCRIPTION SECTION -->
      <v-container fluid>
        <v-row justify="center">
          <v-col cols="12" sm="11" md="10" lg="9" xl="8">
            <div class="text--secondary">
              {{ page.fields.site_description }}
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-sheet>

    <ColumnWrapper>
      <Subheader content="Featured projects"></Subheader>

      <!-- PROJECT INFO AND CARDS -->
      <v-container>
        <v-row class="ma-2">
          <v-col
            v-for="project in page.fields.featured"
            :key="project.project.slug"
            cols="12"
            sm="6"
            md="4"
          >
            <v-card :to="'/project/' + project.project.slug">
              <v-img
                height="10em"
                contain
                :src="project.project.fields.photo"
              />
              <!-- We don't want to break the title in the middle of a word, so apply word-break -->
              <v-card-title class="word-break">{{
                project.project.fields.name
              }}</v-card-title>
              <v-card-subtitle>{{
                project.project.fields.description
              }}</v-card-subtitle>
            </v-card>
          </v-col>

          <!-- Check out more projects link... -->
          <v-col cols="12" sm="6" md="4">
            <v-card
              to="/project"
              height="15em"
              class="d-flex align-center justify-center"
            >
              <div class="text-h6 text-center">More projects...</div>
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
      page: {
        slug: "",
        fields: {},
      },
    };
  },

  methods: {
    getPage() {
      butter.page
        .retrieve("*", this.slug)
        .then((res) => {
          console.log(res.data.data);
          this.page = res.data.data;
        })
        .catch((err) => {
          alert("Error fetching content", err);
        });
    },
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.getPage();
    });
  },
};
</script>
