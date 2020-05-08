import Vue from "vue";
import Vuex from "vuex";

import { auth, notesCollection } from "../firebase";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    currentUser: null,
    notes: [],
    isLoading: false,
  },
  getters: {
    allNotes: (state) => {
      return state.notes;
    },
    hasNotes: (state) => {
      return state.notes.length;
    },
    pendingNotes: (state) => {
      return state.notes.filter((note) => !note.isCompleted);
    },
    completeNotes: (state) => {
      return state.notes.filter((note) => note.isCompleted);
    },
    getNoteIndex: (state) => (id) => {
      return state.notes.findIndex((note) => note.id === id);
    },
    getOneNote: (state) => (id) => {
      return state.notes.find((note) => note.id === id);
    },
  },
  mutations: {
    onLogout(state, payload) {
      state.notes = [];
      state.currentUser = payload;
    },
    setIsLoading(state, payload) {
      state.isLoading = payload;
    },
    setCurrentUser(state, payload) {
      state.currentUser = payload;
    },
    setNotes(state, payload) {
      if (payload) {
        state.notes = payload;
      } else {
        state.notes = [];
      }
    },
    setUpdatedNote(state, payload) {
      state.notes.splice(payload.index, 1, payload.note);
    },
    setNoteCompleted(state, payload) {
      state.notes[payload.index].isCompleted = payload.isCompleted;
    },
  },
  actions: {
    async getUserNotesAction({ commit, state }) {
      commit("setIsLoading", true);

      try {
        const querySnapshot = await notesCollection
          .where("createdBy", "==", state.currentUser.id)
          .get();

        const dataArr = [];

        querySnapshot.forEach((doc) => {
          const data = {
            id: doc.id,
            title: doc.data().title,
            createdBy: doc.data().createdBy,
            content: doc.data().content,
            isCompleted: doc.data().isCompleted,
          };

          dataArr.push(data);
          // console.log(doc.id, " => ", doc.data());
        });

        // place on vuex
        commit("setIsLoading", false);
        commit("setNotes", dataArr);

        return true;
      } catch (error) {
        commit("setIsLoading", false);
        console.log("Error get: ", error);
        return error;
      }
    },
    async deleteNoteAction({ commit }, payload) {
      commit("setIsLoading", true);

      try {
        await notesCollection.doc(payload.id).delete();

        // console.log("[store.actions] delete success");

        commit("setNotes", payload.updatedList);
        commit("setIsLoading", false);

        return true;
      } catch (error) {
        console.log("error delete: ", error);
        commit("setIsLoading", false);

        return error;
      }
    },
    async markNoteAction({ commit, getters }, payload) {
      commit("setIsLoading", true);

      try {
        await notesCollection.doc(payload.id).update({
          isCompleted: !payload.isComp,
        });

        // console.log("[store.actions] update isCompleted success");

        const index = getters.getNoteIndex(payload.id);

        commit("setNoteCompleted", {
          index: index,
          isCompleted: !payload.isComp,
        });
        commit("setIsLoading", false);

        return true;
      } catch (error) {
        console.log("error note mark: ", error);
        commit("setIsLoading", false);
        return error;
      }
    },
    async editNoteAction({ commit }, payload) {
      commit("setIsLoading", true);

      try {
        await notesCollection.doc(payload.idToEdit).update({
          title: payload.editedParts.title,
          content: payload.editedParts.content,
        });

        // console.log("[store.actions] update title content success");

        payload.noteToEdit.title = payload.editedParts.title;
        payload.noteToEdit.content = payload.editedParts.content;

        commit("setIsLoading", false);
        commit("setUpdatedNote", {
          index: payload.indexUpdate,
          note: payload.noteToEdit,
        });

        return true;
      } catch (error) {
        commit("setIsLoading", false);
        console.log("error edit: ", error);
        return error;
      }
    },
    async addNoteAction({ commit, getters }, payload) {
      commit("setIsLoading", true);

      try {
        const res = await notesCollection.add(payload.newNote);

        // console.log("[store.actions] addNoteAction success", res);

        payload.newNote.id = res.id;

        commit("setIsLoading", false);
        commit("setNotes", [...getters.allNotes, payload.newNote]);

        return res;
      } catch (error) {
        console.log("error add: ", error);
        commit("setIsLoading", false);
        return error;
      }
    },
    logoutAction({ commit }) {
      commit("setCurrentUser", null);
      commit("setNotes", null);
    },
    setUserAction({ commit }, payload) {
      commit("setCurrentUser", payload);
    },
    async authenticateUser({ commit }, payload) {
      try {
        commit("setIsLoading", true);

        let res;

        if (payload.type === "signin") {
          res = await auth.signInWithEmailAndPassword(
            payload.email,
            payload.password
          );
        } else {
          res = await auth.createUserWithEmailAndPassword(
            payload.email,
            payload.password
          );
        }

        commit("setCurrentUser", {
          email: res.user.email,
          id: res.user.uid,
        });

        commit("setIsLoading", false);
        return true;
      } catch (error) {
        console.log(error);
        commit("setIsLoading", false);
        return error;
      }
    },
  },
  modules: {},
});
