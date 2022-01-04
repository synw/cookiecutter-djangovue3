<template>
  <div :class="{ 'dark': user.isDarkMode.value }">
    <div class="background">
      <div v-if="user.isLoggedIn.value === true">
        <the-header></the-header>
        <div class="p-5 sm:container sm:pt-5 sm:p-0 sm:mx-auto">
          <router-view></router-view>
        </div>
      </div>
      <div v-else class="w-screen h-screen background">
        <div class="flex items-center justify-center w-full h-full">
          <the-login @onlogin="afterLogin($event)"></the-login>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount } from 'vue'
import { api, user } from "@/state";
import TheHeader from './components/TheHeader.vue';
import TheLogin from "./components/TheLogin.vue";

export default defineComponent({
  components: {
    TheHeader,
    TheLogin,
  },
  setup() {
    function afterLogin(data: Record<string, any>) {
      console.log("User logged in", data);
    }

    onBeforeMount(() => {
      user.isLoggedIn.value = api.setLoginStatus();
    });

    return {
      user,
      afterLogin,
    }
  }
})
</script>

<style lang="css">
html,
body {
  margin: 0;
  padding: 0;
}
</style>
