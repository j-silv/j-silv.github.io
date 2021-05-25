<template>
  <div>
    <PageHeader content="Contact"></PageHeader>
    <v-divider></v-divider>

  <!-- Setting a max-width for contact box -->
  <v-container style="max-width: 40em;" class="pt-0">
    <ColumnWrapper>
      <v-container fluid>
        <form>
          <v-text-field
            v-model="name"
            :error-messages="nameErrors"
            :counter="10"
            label="Your name"
            required
            @input="$v.name.$touch()"
            @blur="$v.name.$touch()"
          ></v-text-field>
          <v-text-field
            v-model="email"
            :error-messages="emailErrors"
            label="Your e-mail"
            required
            @input="$v.email.$touch()"
            @blur="$v.email.$touch()"
          ></v-text-field>

          <v-textarea
            clearable
            clear-icon="mdi-close-circle"
            counter
            label="Your message"
            :rules="rules"
            v-model="message"
          ></v-textarea>

          <v-btn class="mr-4" @click="submit">
            submit
          </v-btn>
        </form>
      </v-container>
    </ColumnWrapper>
  </v-container>
  </div>
</template>

<script>
import PageHeader from "../components/PageHeader.vue";
import ColumnWrapper from "@/components/ColumnWrapper.vue";

// Form validation libraries
import { validationMixin } from "vuelidate";
import { required, maxLength, email } from "vuelidate/lib/validators";

export default {
  components: {
    PageHeader,
    ColumnWrapper,
  },
  data: () => ({
    rules: [(v) => v.length <= 25 || "Max 1000 characters"],
    message: "",
    name: "",
    email: "",
  }),

  mixins: [validationMixin],

  validations: {
    name: { required, maxLength: maxLength(10) },
    email: { required, email },
  },

  computed: {
    nameErrors() {
      const errors = [];
      if (!this.$v.name.$dirty) return errors;
      !this.$v.name.maxLength &&
        errors.push("Name must be at most 10 characters long");
      !this.$v.name.required && errors.push("Name is required.");
      return errors;
    },
    emailErrors() {
      const errors = [];
      if (!this.$v.email.$dirty) return errors;
      !this.$v.email.email && errors.push("Must be valid e-mail");
      !this.$v.email.required && errors.push("E-mail is required");
      return errors;
    },
  },

  methods: {
    submit() {
      this.$v.$touch();
    },
  },
};
</script>
