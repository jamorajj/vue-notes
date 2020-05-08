import Vue from "vue";

import router from "./router";
import store from "./store";

import App from "./App.vue";

import { auth } from "./firebase";

import "./assets/app.css";

Vue.config.productionTip = false;

let app;
auth.onAuthStateChanged((user) => {
  if (!app) {
    app = new Vue({
      router,
      store,
      render: (h) =>
        h(App, {
          props: { user: user },
        }),
    }).$mount("#app");
  }
});
