<template>
  <div id="app">
    <Nav />
    <router-view />
    <div v-if="isLoading" class="overlay">
      <div class="lds-ripple">
        <div></div>
        <div></div>
      </div>
    </div>
  </div>
</template>

<script>
import Nav from "./components/Nav.vue";
import { mapState } from "vuex";

export default {
  components: {
    Nav
  },
  props: ["user"],
  computed: {
    ...mapState(["isLoading"])
  },
  created() {
    // auth.signOut();

    if (this.user) {
      // console.log("[app.vue] has user, save to vuex");
      this.$store.dispatch("setUserAction", {
        email: this.user.email,
        id: this.user.uid
      });

      if (this.$router.currentRoute.name !== "Dashboard")
        this.$router.replace({ name: "Dashboard" });
    } else {
      this.$store.dispatch("setUserAction", null);
      // console.log("[app.vue] no user, clear vuex");
      if (this.$router.currentRoute.name !== "Login")
        this.$router.replace({ name: "Login" });
    }
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  padding: 0 2rem;
  color: #2c3e50;
}

.overlay {
  position: fixed;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
