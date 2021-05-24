<template>
  <div>

    <div class="text-center text-h3 ma-5">
      {{page.fields.name}}
    </div>

     <v-container class="grey lighten-3" fluid>
        <v-row justify="center">
          <v-col
            cols="12"
            sm="10"
          >
            <v-sheet
              min-height="70vh"
              rounded="lg"
            >

            <!-- SECTION AND CONTENT FOR PAGE -->
              <div
              v-for="section in page.fields.section"
              :key="section.name"
              class="pa-4 project-content-container"
              >
                <div v-html="section.name"></div>
                <div v-html="section.content"></div>
              </div>



            </v-sheet>
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
      slug: this.$route.params.project,
      page: {
        fields: {},
      },
    }
  },

  methods: {
    getPage() {
      butter.page.retrieve('project', this.slug)
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