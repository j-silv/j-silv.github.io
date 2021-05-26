<template>
    <!-- PROJECT PREVIEWS HEADER -->
    <v-container fluid>
    <v-row class="text-start">
        <v-col class="ma-4">
        <div class="subheading heading-2">
            {{content}}
        </div>
        </v-col>
    </v-row>
    </v-container>
</template>

<script>
export default {
    props: ['content']
}
</script>