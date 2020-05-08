<template>
  <nav>
    <h1>Note Taker Vue</h1>
    <ul>
      <li v-if="currentUser !== null">Logged in as {{currentUser.email}}</li>
      <li v-if="currentUser !== null">
        <button @click="logoutHandler">Logout</button>
      </li>
      <li v-if="currentUser === null">
        <router-link to="/login">Login</router-link>
      </li>
      <li v-if="currentUser === null">
        <router-link to="/register">Register</router-link>
      </li>
    </ul>
  </nav>
</template>

<script>
import { mapState } from "vuex";

import { auth } from "../firebase";

export default {
  name: "Nav",
  computed: {
    ...mapState(["currentUser"])
  },
  methods: {
    async logoutHandler() {
      // console.log("[nav.vue] init logout");
      await auth.signOut();

      // console.log(this.$store);

      this.$store.dispatch("logoutAction");

      // console.log("[nav.vue] logout success");
      this.$router.replace({ name: "Login" });
    }
  }
};
</script>

<style scoped>
nav {
  max-width: 1100px;
  margin: 1rem auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

nav ul {
  list-style: none;
  display: flex;
}

nav ul li a {
  padding: 0.7rem;
  text-decoration: none;
  color: #000000;
}

nav ul li button {
  font-size: 1rem;
  padding: 0 0.7rem;
  text-decoration: none;
  border: none;
  color: #000000;
  cursor: pointer;
  outline: none;
}

/* nav ul li a.router-link-exact-active {
  color: #788b83;
} */

@media (max-width: 600px) {
  nav h1 {
    font-size: 1.3rem;
    flex: 1 1 40%;
  }

  nav ul {
    flex: 3 3 60%;
    align-self: center;
    justify-content: flex-end;
  }

  nav ul li {
    text-align: center;
  }

  nav ul li a {
    font-size: 0.8rem;
    padding: 0.4rem;
  }

  nav ul li button {
    font-size: 0.8rem;
    padding: 0 0.4rem;
  }
}
</style>