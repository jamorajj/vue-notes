<template>
  <div>
    <div class="no-notes" v-if="!totalNotes && !isLoading">You can add notes.</div>
    <div v-else v-for="note in notes" :key="note.id">
      <NoteItem
        v-bind:note="note"
        v-on:mark-note="$emit('mark-note', note.id, note.isCompleted)"
        v-on:delete-note="$emit('delete-note', note.id)"
        v-on:edit-note="$emit('edit-note', note.id)"
      />
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

import NoteItem from "./NoteItem";

export default {
  name: "NoteList",
  components: { NoteItem },
  props: ["notes", "totalNotes"],
  computed: {
    ...mapState(["isLoading"])
  }
};
</script>

<style scoped>
.no-notes {
  text-align: center;
}
</style>