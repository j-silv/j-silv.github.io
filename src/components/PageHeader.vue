<template>
    <v-sheet>
        <div class="text-center text-h3 pa-5">
        {{ content }}
        </div>
    </v-sheet>
</template>

<script>
export default {
    props: ['content'],
}
</script>