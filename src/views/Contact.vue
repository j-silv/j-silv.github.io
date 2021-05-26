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
            :counter="MAX_NAME_CHAR"
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
            @change="$v.email.$touch()"
            @blur="$v.email.$touch()"
          ></v-text-field>

          <v-textarea
            v-model="message"
            :error-messages="messageErrors"
            :counter="MAX_MSG_CHAR"
            label="Your message"
            required
            @input="$v.message.$touch()"
            @blur="$v.message.$touch()"
            clearable
            clear-icon="mdi-close-circle"
          ></v-textarea>

          <v-btn :disabled='submitStatus === "PENDING"' @click="submit">
            submit
          </v-btn>
              <v-progress-circular
              class="ml-3"
              v-if="submitStatus === 'PENDING'"
      indeterminate
      color="grey-darken-3"
    ></v-progress-circular>

        </form>
      </v-container>
    </ColumnWrapper>
      <!-- Visual indication to user for form submission -->
      <!-- A bit of a hack to remove the black (dark) border around the content -->
        <v-snackbar
          v-model="snackbar"
          :timeout="2500"
          color="transparent"
          elevation='0'
        >
        <v-sheet elevation="20" rounded>
        <v-alert type="success" v-if="submitStatus === 'OK'">Thanks for your submission!</v-alert>
        <v-alert type="error" v-if="submitStatus === 'ERROR'">Please fill the form correctly.</v-alert>
        </v-sheet>
          </v-snackbar>

  </v-container>

  </div>
</template>

<script>

const MAX_NAME_CHAR = 30;
const MAX_MSG_CHAR = 1000;
const MIN_MSG_CHAR = 10;

import PageHeader from "../components/PageHeader.vue";
import ColumnWrapper from "@/components/ColumnWrapper.vue";

// Form validation libraries
import { validationMixin } from "vuelidate";
import { required, minLength, maxLength, email } from "vuelidate/lib/validators";

export default {
  components: {
    PageHeader,
    ColumnWrapper,
  },
  data: () => ({
    message: "",
    name: "",
    email: "",

    // Initialized in data section to avoid Vue errors (reference during render)
    MAX_NAME_CHAR,
    MAX_MSG_CHAR,
    MIN_MSG_CHAR,

    submitStatus: null,

    snackbar: false,
  }),

  mixins: [validationMixin],
  validations: {
    name: { required, maxLength: maxLength(MAX_NAME_CHAR) },
    email: { required, email },
    message: { required, minLength: minLength(MIN_MSG_CHAR), maxLength: maxLength(MAX_MSG_CHAR) },
  },

  computed: {
    nameErrors() {
      const errors = [];
      if (!this.$v.name.$dirty) return errors;
      !this.$v.name.maxLength &&
        errors.push(`Name must be at most ${MAX_NAME_CHAR} characters long`);
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
    messageErrors() {
      const errors = [];
      if (!this.$v.message.$dirty) return errors;
      !this.$v.message.minLength &&
        errors.push(`Message must be at least ${MIN_MSG_CHAR} characters long`);
      !this.$v.message.maxLength &&
        errors.push(`Message must be at most ${MAX_MSG_CHAR} characters long`);
      !this.$v.message.required && errors.push("Message is required.");
      return errors;
    },
  },

  methods: {
    submit() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        this.submitStatus = 'ERROR'
        this.snackbar = true;
      } else {

        // do your submit logic here
        this.submitStatus = 'PENDING'

        // timeout to display ok status
        setTimeout(() => {
          this.submitStatus = 'OK'
          this.snackbar = true;
        }, 500)

      }
    },
  },
};
</script>
