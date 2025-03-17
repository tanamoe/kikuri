<script setup lang="ts">
import { EditorContent, Editor } from "@tiptap/vue-3";
import TiptapStarterKit from "@tiptap/starter-kit";
import ExtensionUnderline from "@tiptap/extension-underline";
import ExtensionImage from "@tiptap/extension-image";
import ExtensionCharacterCount from "@tiptap/extension-character-count";
import ExtensionLink from "@tiptap/extension-link";

const editor = shallowRef<Editor>();
const url = ref("");
const imageUrl = ref("");

const content = defineModel<string>();

const toggleBold = () => {
  editor.value?.chain().focus().toggleBold().run();
};
const toggleItalic = () => {
  editor.value?.chain().focus().toggleItalic().run();
};
const toggleUnderline = () => {
  editor.value?.chain().focus().toggleUnderline().run();
};
const toggleStrike = () => {
  editor.value?.chain().focus().toggleStrike().run();
};
const toggleBlockquote = () => {
  editor.value?.chain().focus().toggleBlockquote().run();
};
const setHorizontalRule = () => {
  editor.value?.chain().focus().setHorizontalRule().run();
};
const toggleHeading = (level: 1 | 2 | 3 | 4 | 5 | 6) => {
  editor.value?.chain().focus().toggleHeading({ level }).run();
};
const unsetLink = () => {
  editor.value?.chain().focus().extendMarkRange("link").unsetLink().run();
};

function setLink() {
  if (url.value === null) return;
  if (url.value === "")
    editor.value?.chain().focus().extendMarkRange("link").unsetLink().run();
  else
    editor.value
      ?.chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: url.value })
      .run();
}

function setImage() {
  if (editor.value) {
    editor.value.commands.setImage({
      src: imageUrl.value,
    });
  }
}

onMounted(() => {
  editor.value = new Editor({
    content: content.value,
    extensions: [
      TiptapStarterKit,
      ExtensionUnderline,
      ExtensionImage,
      ExtensionCharacterCount,
      ExtensionLink.configure({
        openOnClick: false,
      }),
    ],
    onUpdate: () => {
      content.value = editor.value!.getHTML();
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm dark:prose-invert max-w-none px-2.5 py-1.5 mx-auto focus:outline-none min-h-[6rem] max-h-screen overflow-y-auto",
      },
    },
  });
});

onBeforeUnmount(() => {
  if (editor.value) {
    editor.value.destroy();
  }
});
</script>

<template>
  <div
    class="focus:ring-primary-500 dark:focus:ring-primary-400 rounded-md bg-white text-neutral-900 shadow-sm ring-1 ring-neutral-300 ring-inset focus:ring-2 dark:bg-neutral-900 dark:text-white dark:ring-neutral-700"
  >
    <div
      v-if="editor"
      class="flex divide-x divide-neutral-300 overflow-auto border-b border-neutral-300 dark:divide-neutral-700 dark:border-neutral-700"
    >
      <div class="flex gap-1 px-2.5 py-1.5">
        <UTooltip :text="$t('editor.bold')" :shortcuts="['meta', 'B']">
          <UButton
            color="neutral"
            :variant="editor.isActive('bold') ? 'soft' : 'ghost'"
            icon="i-fluent-text-bold-20-filled"
            :disabled="!editor.can().chain().focus().toggleBold().run()"
            square
            tabindex="-1"
            @click="toggleBold"
          />
        </UTooltip>
        <UTooltip :text="$t('editor.italic')" :shortcuts="['meta', 'I']">
          <UButton
            color="neutral"
            :variant="editor.isActive('italic') ? 'soft' : 'ghost'"
            icon="i-fluent-text-italic-20-filled"
            :disabled="!editor.can().chain().focus().toggleItalic().run()"
            square
            tabindex="-1"
            @click="toggleItalic"
          />
        </UTooltip>
        <UTooltip :text="$t('editor.underline')" :shortcuts="['meta', 'U']">
          <UButton
            color="neutral"
            :variant="editor.isActive('underline') ? 'soft' : 'ghost'"
            icon="i-fluent-text-underline-20-filled"
            :disabled="!editor.can().chain().focus().toggleUnderline().run()"
            square
            tabindex="-1"
            @click="toggleUnderline"
          />
        </UTooltip>
        <UTooltip
          :text="$t('editor.strikethrough')"
          :shortcuts="['meta', 'Shift', 'X']"
        >
          <UButton
            color="neutral"
            :variant="editor.isActive('strike') ? 'soft' : 'ghost'"
            icon="i-fluent-text-strikethrough-20-filled"
            :disabled="!editor.can().chain().focus().toggleStrike().run()"
            square
            tabindex="-1"
            @click="toggleStrike"
          />
        </UTooltip>
      </div>
      <div class="flex gap-1 px-2.5 py-1.5">
        <UTooltip
          :text="$t('editor.quote')"
          :shortcuts="['meta', 'Shift', 'B']"
        >
          <UButton
            color="neutral"
            variant="ghost"
            icon="i-fluent-text-quote-20-filled"
            square
            tabindex="-1"
            @click="toggleBlockquote"
          />
        </UTooltip>
        <UButton
          color="neutral"
          variant="ghost"
          icon="i-fluent-line-horizontal-1-20-filled"
          square
          tabindex="-1"
          @click="setHorizontalRule"
        />
      </div>
      <div class="flex gap-1 px-2.5 py-1.5">
        <UButton
          color="neutral"
          :variant="editor.isActive('heading', { level: 1 }) ? 'soft' : 'ghost'"
          icon="i-fluent-text-header-1-20-filled"
          square
          tabindex="-1"
          @click="toggleHeading(1)"
        />
        <UButton
          color="neutral"
          :variant="editor.isActive('heading', { level: 2 }) ? 'soft' : 'ghost'"
          icon="i-fluent-text-header-2-20-filled"
          square
          tabindex="-1"
          @click="toggleHeading(2)"
        />
        <UButton
          color="neutral"
          :variant="editor.isActive('heading', { level: 3 }) ? 'soft' : 'ghost'"
          icon="i-fluent-text-header-3-20-filled"
          square
          tabindex="-1"
          @click="toggleHeading(3)"
        />
      </div>
      <div class="flex gap-1 px-2.5 py-1.5">
        <UPopover>
          <UButton
            color="neutral"
            variant="ghost"
            icon="i-fluent-link-20-filled"
            square
            tabindex="-1"
            @click="() => (url = editor?.getAttributes('link').href)"
          />
          <template #panel>
            <form class="space-y-3 p-3 text-right">
              <UFormGroup name="url">
                <UInput v-model="url" placeholder="https://tana.moe/calendar" />
              </UFormGroup>
              <UButton
                size="xs"
                icon="i-fluent-link-remove-20-filled"
                color="error"
                variant="outline"
                class="mr-3"
                @click="unsetLink"
              >
                {{ $t("editor.remove") }}
              </UButton>
              <UButton size="xs" icon="i-fluent-add-20-filled" @click="setLink">
                {{ $t("editor.add") }}
              </UButton>
            </form>
          </template>
        </UPopover>
        <UPopover>
          <UButton
            color="neutral"
            variant="ghost"
            icon="i-fluent-image-add-20-filled"
            square
            tabindex="-1"
          />
          <template #panel>
            <div class="space-y-3 p-3 text-right">
              <UFormGroup name="url">
                <UInput
                  v-model="imageUrl"
                  placeholder="https://imgur.com/image.png"
                />
              </UFormGroup>
              <UButton
                size="xs"
                icon="i-fluent-add-20-filled"
                @click="setImage"
              >
                {{ $t("editor.add") }}
              </UButton>
            </div>
          </template>
        </UPopover>
      </div>
    </div>
    <EditorContent :editor="editor" spellcheck="false" />
    <div v-if="editor" class="p-3 text-right text-sm text-neutral-500">
      {{
        $t("editor.characterCount", {
          count: editor.storage.characterCount.characters(),
        })
      }}
    </div>
  </div>
</template>

<style>
.tiptap iframe {
  aspect-ratio: 16 / 9;
  width: 100%;
  height: auto;
}
</style>
