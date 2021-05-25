<template>
  <v-container class="mt-3">
    <v-row justify="center" no-gutters>
      <v-col cols="12">
        <v-sheet elevation="5">
          <!-- Content that this column wrapper wraps -->
          <slot></slot>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {};
</script>
