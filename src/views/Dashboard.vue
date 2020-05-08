<template>
  <div class="container">
    <div class="form-container">
      <h2 v-if="isEditing">Edit a note</h2>
      <h2 v-else>Add a note</h2>
      <form @submit="submitHandler">
        <div class="form-group">
          <label for="title">Title</label>
          <input type="text" name="title" id="title" v-model="title" placeholder="Note Title" />
        </div>
        <div class="form-group">
          <label for="content">Content</label>
          <textarea name="content" id="content" v-model="content" placeholder="Note Content"></textarea>
        </div>
        <button v-if="isEditing" type="submit">Edit Note</button>
        <button v-else type="submit">Add Note</button>
      </form>
      <button v-if="isEditing" class="cancel-btn" @click="cancelEditNote">Cancel</button>
    </div>

    <div class="notes-container">
      <div v-if="noteCount">
        Filter:
        <select @change="filterNotes">
          <option value="all">All Notes</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
        </select>
      </div>
      <NoteList
        v-bind:notes="currentNotes"
        v-bind:totalNotes="noteCount"
        v-on:mark-note="markNote"
        v-on:delete-note="deleteNote"
        v-on:edit-note="editNote"
      />
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";

import NoteList from "../components/NoteList";

export default {
  name: "Dashboard",
  components: {
    NoteList
  },
  data() {
    return {
      isEditing: false,
      idToEdit: null,
      noteToEdit: null,
      title: "",
      content: "",
      category: "all",
      noteCount: 0,
      currentNotes: []
    };
  },
  computed: {
    ...mapState(["currentUser"]),
    ...mapGetters([
      "hasNotes",
      "allNotes",
      "pendingNotes",
      "completeNotes",
      "getOneNote"
    ])
  },
  created() {
    this.$store.dispatch("getUserNotesAction").then(() => {
      this.retrieveNotes();
    });
  },
  methods: {
    retrieveNotes() {
      this.noteCount = this.$store.getters.hasNotes;
      switch (this.category) {
        case "all":
          this.currentNotes = this.$store.getters.allNotes;
          return;
        case "completed":
          this.currentNotes = this.$store.getters.completeNotes;
          return;

        case "pending":
          this.currentNotes = this.$store.getters.pendingNotes;
          return;

        default:
          return;
      }
    },
    filterNotes(e) {
      this.category = e.target.value;
      this.retrieveNotes();
    },
    cancelEditNote() {
      this.isEditing = false;
      this.idToEdit = null;
      this.noteToEdit = null;

      this.title = "";
      this.content = "";
    },
    editNote(id) {
      this.isEditing = true;
      this.idToEdit = id;

      this.noteToEdit = this.getOneNote(id);

      this.title = this.noteToEdit.title;
      this.content = this.noteToEdit.content;
    },
    async markNote(id, isComp) {
      const res = await this.$store.dispatch("markNoteAction", {
        isComp,
        id
      });

      if (res) {
        // complete
        this.retrieveNotes();
      }
    },
    async deleteNote(id) {
      const p = confirm("Are you sure to delete this note?");

      // console.log(p, id);

      if (p) {
        const updatedList = this.currentNotes.filter(note => note.id !== id);

        const res = await this.$store.dispatch("deleteNoteAction", {
          updatedList,
          id
        });

        if (res) {
          // complete
          this.retrieveNotes();
        }
      }
    },
    async submitHandler(e) {
      e.preventDefault();

      if (this.isEditing) {
        // edit existing note

        const indexUpdate = this.currentNotes.findIndex(
          note => note.id === this.idToEdit
        );

        const res = await this.$store.dispatch("editNoteAction", {
          indexUpdate,
          noteToEdit: this.noteToEdit,
          idToEdit: this.idToEdit,
          editedParts: {
            title: this.title,
            content: this.content
          }
        });

        if (res) {
          this.cancelEditNote();
          this.retrieveNotes();
        }
      } else {
        // add new note
        const newNote = {
          title: this.title,
          content: this.content,
          isCompleted: false,
          createdBy: this.currentUser.id
        };

        const res = await this.$store.dispatch("addNoteAction", {
          newNote
        });

        if (res.id) {
          this.title = "";
          this.content = "";
          this.retrieveNotes();
        }
      }
    }
  }
};
</script>

<style scoped>
.container {
  max-width: 1100px;
  max-height: 90vh;
  margin: 0 auto;
  display: flex;
  justify-content: center;
}

.form-container {
  margin: 0 auto;
}

.form-container h2 {
  text-align: center;
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

.form-container button {
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

.notes-container {
  margin: 1rem auto;
  overflow-y: auto;
}

.notes-container select {
  width: 250px;
  height: 30px;
  margin-bottom: 1rem;
  outline: none;
}

@media (max-width: 750px) {
  .container {
    max-height: unset;
    flex-direction: column;
  }

  .notes-container {
    overflow: unset;
  }
}
</style>