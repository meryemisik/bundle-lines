<template>
  <div class="tiptap-editor-icons">
    <div v-if="editor">
      <v-icon
        icon="mdi-format-bold"
        @click="editor.chain().focus().toggleBold().run()"
        :disabled="!editor.can().chain().focus().toggleBold().run()"
        :class="{ 'is-active': editor.isActive('bold') }"
      ></v-icon>

      <v-icon
        icon="mdi-format-italic"
        @click="editor.chain().focus().toggleItalic().run()"
        :disabled="!editor.can().chain().focus().toggleItalic().run()"
        :class="{ 'is-active': editor.isActive('italic') }"
      ></v-icon>

      <v-icon
        icon="mdi-format-strikethrough"
        @click="editor.chain().focus().toggleStrike().run()"
        :disabled="!editor.can().chain().focus().toggleStrike().run()"
        :class="{ 'is-active': editor.isActive('strike') }"
      ></v-icon>
      <v-icon
        icon="mdi-code-tags"
        @click="editor.chain().focus().toggleCode().run()"
        :disabled="!editor.can().chain().focus().toggleCode().run()"
        :class="{ 'is-active': editor.isActive('code') }"
      ></v-icon>

      <v-icon
        icon="mdi-format-clear"
        @click="editor.chain().focus().unsetAllMarks().run()"
      ></v-icon>
      <v-icon
        icon="mdi-format-paragraph"
        @click="editor.chain().focus().setParagraph().run()"
        :class="{ 'is-active': editor.isActive('paragraph') }"
      ></v-icon>
      <v-icon
        icon="mdi-format-list-bulleted"
        @click="editor.chain().focus().toggleBulletList().run()"
        :class="{ 'is-active': editor.isActive('bulletList') }"
      ></v-icon>

      <v-icon
        icon="mdi-format-list-numbered"
        @click="editor.chain().focus().toggleOrderedList().run()"
        :class="{ 'is-active': editor.isActive('orderedList') }"
      ></v-icon>
      <v-icon icon="mdi-link-variant" @click="setLink(editor)"></v-icon>
    </div>
    <TiptapEditorContent :editor="editor" class="tip-tap-editor" />
  </div>
</template>
<script setup>
import {
  onMounted,
  onBeforeUnmount,
  watchEffect,
  defineProps,
  defineEmits,
  ref,
} from "vue";
import { useEditor, EditorContent } from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";

const props = defineProps({
  modelValue: String,
  "onUpdate:modelValue": Function,
});

const emit = defineEmits(["update:modelValue"]);

const editor = useEditor({
  extensions: [
    StarterKit,
    Link.configure({
      openOnClick: false,
    }),
    Placeholder.configure({
      placeholder: "Start typing here...",
    }),
  ],
  content: props.modelValue,
  onUpdate({ editor }) {
    emit("update:modelValue", editor.getHTML());
  },
});

const setLink = (editor) => {
  const url = prompt("Enter the URL");
  if (url) {
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }
};

onBeforeUnmount(() => {
  if (editor.value) {
    editor.value.destroy();
  }
});

watchEffect(() => {
  if (editor.value && editor.value.getHTML() !== props.modelValue) {
    editor.value.commands.setContent(props.modelValue);
  }
});
</script>

<style lang="scss">
.tiptap-editor-icons {
  background: #f2f2f2;
  display: flex;
  justify-content: center;
  flex-direction: column;
  margin-bottom: 10px;
  & > div:first-child {
    display: flex;
    gap: 10px;
    background: #8080803d;
    justify-content: center;
    border-radius: 5px 5px 0 0;
    padding: 5px;
  }

  .tip-tap-editor {
    & > div:first-child {
      p {
        padding: 10px;
      }
    }
    > * {
      min-height: 100px;
    }
  }
}
.tiptap p.is-editor-empty:first-child::before {
  color: #adb5bd;
  content: attr(data-placeholder);
  float: left;
  height: 0;
  pointer-events: none;
}
.tiptap p.is-empty::before {
  color: #adb5bd;
  content: attr(data-placeholder);
  float: left;
  height: 0;
  pointer-events: none;
}
</style>
