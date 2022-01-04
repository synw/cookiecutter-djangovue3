<template>
  <div class="p-8 border border-neutral dark:border-neutral-dark">
    <div class="flex flex-col space-y-5 justify-items-center" v-on:keyup.enter="onSubmit()">
      <sw-input
        v-model:value="form.name.val"
        v-model:isvalid="form.name.isValid"
        :validator="form.name.validator"
        inlineLabel="Username"
      ></sw-input>
      <div class="mt-3 text-sm text-gray-500 dark:text-gray-200">
        <div v-if="form.name.isValid === true" class="text-success"></div>
        <div v-else-if="form.name.isValid === false" class="text-danger">Type 3 characters minimum</div>
        <div v-else>Type a username</div>
      </div>
      <sw-input
        class="mt-5"
        v-model:value="form.password.val"
        v-model:isvalid="form.password.isValid"
        :validator="form.password.validator"
        inlineLabel="Password"
        type="password"
      ></sw-input>
      <div class="mt-3 text-sm text-gray-500 dark:text-gray-200">
        <div v-if="form.password.isValid === true" class="text-success">&nbsp;</div>
        <div
          v-else-if="form.password.isValid === false"
          class="text-danger"
        >Type 6 characters minimum</div>
        <div v-else>Type a password</div>
      </div>
      <button
        class="mt-3 btn"
        :disabled="!isFormValid"
        :class="{ 'success': isFormValid, 'light': !isFormValid }"
        @click="onSubmit()"
      >Login</button>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref } from "vue";
import { api, user } from "@/state";
import SwInput from "@snowind/input";

export default defineComponent({
  components: {
    SwInput
  },
  emits: ["onlogin"],
  setup(props, { emit }) { // eslint-disable-line
    const username = ref("");
    const pwd = ref("");

    const form = reactive({
      name: {
        val: user.name.value === "anonymous" ? "" : user.name.value,
        isValid: user.name.value === "anonymous" ? false : true,
        validator: (v: string) => v.length > 2,
      },
      password: {
        val: "", // initial value
        isValid: null, // initial state
        validator: (v: string) => v.length > 2,
      },
    });

    const isFormValid = computed<boolean>(() => {
      return form.name.isValid === true && form.password.isValid === true;
    });

    async function onSubmit() {
      if (!isFormValid.value === true) {
        return
      }
      const data = await api.login(form.name.val, form.password.val);
      user.isLoggedIn.value = api.setLoginStatus();
      emit("onlogin", data)
    }

    return {
      username,
      pwd,
      onSubmit,
      form,
      isFormValid
    };
  },
});
</script>

<style lang="sass" scoped>
.login-form-header
  font-size: 140%
  font-weight: bold
  text-align: center
</style>
