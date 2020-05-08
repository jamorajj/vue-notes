<template>
  <div class="note" v-bind:class="{completed: note.isCompleted}">
    <h4>{{note.title}}</h4>
    <p>{{note.content}}</p>
    <div class="option-upper" @click="$emit('mark-note', note.id, note.isCompleted)">
      <i v-if="note.isCompleted" class="far fa-check-square"></i>
      <i v-else class="far fa-square"></i>
    </div>
    <div class="option-lower">
      <div @click="$emit('edit-note', note.id)">
        <i class="far fa-edit"></i> Edit
      </div>
      <div @click="$emit('delete-note', note.id)">
        <i class="far fa-minus-square"></i> Delete
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "NoteItem",
  props: ["note"]
};
</script>

<style scoped>
.note {
  width: 300px;
  padding: 0.5rem;
  border: 1px solid #333333;
  margin-bottom: 0.8rem;
  position: relative;
}

.note.completed p,
.note.completed h4 {
  text-decoration: line-through;
}

.note p {
  margin-bottom: 0.7rem;
}

.note h4 {
  width: 93%;
}

.note .option-upper {
  position: absolute;
  top: 3px;
  right: 5px;
  width: 14px;
  height: 16px;
  cursor: pointer;
}

.note .option-upper i {
  font-size: 1rem;
}

.note .option-lower {
  margin-top: 1rem;
  display: flex;
  justify-content: space-evenly;
}

.note .option-lower div {
  cursor: pointer;
  width: 70px;
}
</style>