<script setup lang="ts">
import { computed, type PropType, onMounted, ref, watch } from 'vue'
import type { DatabasePageItem } from '../../../../types'
import { parseMarkdown, stringifyMarkdown } from '@nuxtjs/mdc/runtime'
import { decompressTree, compressTree } from '@nuxt/content/runtime'
import type { MDCRoot } from '@nuxtjs/mdc'
import type { MarkdownRoot } from '@nuxt/content'
import { withoutReservedKeys } from '../../../../utils/collections'
import { init, } from "modern-monaco";
// @ts-expect-error -- CSS is not typed
import { CSS as monacoCoreCSS } from "modern-monaco/editor-core";

const document = defineModel<DatabasePageItem>()

const editorRef = ref()
const content = ref<string>('')

watch(() => document.value?.id, async () => {
  if (document.value?.body) {
    const tree = document.value.body.type === 'minimark' ? decompressTree(document.value.body) : (document.value.body as unknown as MDCRoot)
    const data = withoutReservedKeys(document.value)
    stringifyMarkdown(tree, data).then((md) => {
      content.value = md || ''
    })
  }
}, { immediate: true })

onMounted(async () => {
  if (!window.document.getElementById("monaco-editor-core-css")) {
    const styleEl = window.document.createElement("style");
    styleEl.id = "monaco-editor-core-css";
    styleEl.media = "screen";
    styleEl.textContent = '/* Dummy CSS to disable modern monaco styles. TODO: drop a PR to modern-monaco */';
    window.document.head.appendChild(styleEl);
  }
  // load monaco-editor-core.js
  const monaco = await init();

  // create a Monaco editor instance
  const editor = monaco.editor.create(editorRef.value, {
  });

  editor.onDidChangeModelContent(() => {
    content.value = editor.getModel()?.getValue() || ''
    parseMarkdown(content.value).then((tree) => {
      document.value = {
        ...document.value,
        body: tree.body.type === 'root' ? compressTree(tree.body) : tree.body as never as MarkdownRoot,
        ...tree.data,
      } as DatabasePageItem
    })
  })

  // create and attach a model to the editor
  editor.setModel(monaco.editor.createModel(content.value, "mdc"));
})
</script>

<template>
  <div class="h-full" ref="editorRef"></div>
  <Style id="monaco-editor-core-css">{{ monacoCoreCSS }}</Style>
</template>
