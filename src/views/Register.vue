<template>
  <div class="form-container">
    <h1>Register</h1>
    <form @submit="registerHandler">
      <div class="form-group">
        <label for="email">Email</label>
        <input type="email" name="email" id="email" v-model="email" placeholder="Email" />
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input
          type="password"
          name="password"
          id="password"
          v-model="password"
          placeholder="Password"
        />
      </div>
      <button type="submit">Register</button>
    </form>
    <div v-if="error" class="error">{{ error.message }}</div>Already have an account?
    <router-link to="/login">Log in here</router-link>
  </div>
</template>

<script>
export default {
  name: "Register",
  data() {
    return {
      email: "",
      password: "",
      error: ""
    };
  },
  methods: {
    async registerHandler(e) {
      e.preventDefault();

      const res = await this.$store.dispatch("authenticateUser", {
        email: this.email,
        password: this.password,
        type: "signup"
      });

      if (res.message) {
        this.error = res;
      } else {
        this.$router.replace({ name: "Dashboard" });
      }
    }
  }
};
</script>

<style scoped>
.form-container {
  margin: 1rem auto;
  max-width: 1100px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
}

.form-container h2 {
  text-align: center;
}

.form-container .error {
  color: #ff5858;
}

.form-container a {
  color: #333333;
}

.form-container form .form-group label {
  display: block;
}

.form-container form .form-group input {
  display: block;
  width: 250px;
  height: 30px;
  padding: 0.5rem;
  border-radius: 5px;
  border: 1px solid #333333;
  outline: none;
  margin-bottom: 0.8rem;
}

.form-container form .form-group textarea {
  display: block;
  width: 250px;
  height: 100px;
  padding: 0.5rem;
  border-radius: 5px;
  border: 1px solid #333333;
  outline: none;
  resize: none;
  margin-bottom: 0.8rem;
}

.form-container form button {
  display: block;
  width: 250px;
  height: 30px;
  padding: 0.5rem;
  margin-bottom: 0.8rem;
  border-radius: 5px;
  border: 1px solid #333333;
  background-color: #333333;
  color: #ffffff;
  cursor: pointer;
  outline: none;
}
</style>
