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
      <div class="pa-9">
      Morbi mattis ullamcorper velit. Donec orci lectus, aliquam ut, faucibus non, euismod id, nulla. Fusce convallis metus id felis luctus adipiscing. Aenean massa. Vestibulum purus quam, scelerisque ut, mollis sed, nonummy id, metus. Nulla consequat massa quis enim. Praesent venenatis metus at tortor pulvinar varius. Donec venenatis vulputate lorem. Phasellus accumsan cursus velit. Pellentesque ut neque.
      </div>
    </v-sheet>

    <!-- PROJECT PREVIEWS -->
    <v-container fluid>
      <v-row class="text-start">
        <v-col class="ma-4">
          <div class="subheading font-italic display-1">
            Featured projects
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
