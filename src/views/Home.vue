<template>
  <div>

    <!-- WELCOME MESSAGE, PAGE MESSAGE -->
    <div class="font-weight-bold text-center text-h3 ma-5">
      Welcome to my portfolio website!
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
    </v-sheet>

    <!-- PROJECT PREVIEWS -->
    <v-container fluid>
      <v-row class="text-center">
        <v-col class="ma-4">
          <div class="subheading font-weight-regular display-1">
            Check out some cool projects!
          </div>
        </v-col>
      </v-row>
    </v-container>

    <!-- PROJECT INFO AND CARDS -->
    <v-container>
      <v-row>
        <v-col
          v-for="n in 6"
          :key="n"
          cols="4"
        >
          <v-card height="200">
            <v-card-title v-if="n === 6">Link to all projects...</v-card-title>
          </v-card>

        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {};
</script>
