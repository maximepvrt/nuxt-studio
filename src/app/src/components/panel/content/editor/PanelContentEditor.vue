<script setup lang="ts">
import { ref, watch, toRaw, computed, type PropType } from 'vue'
import { decompressTree } from '@nuxt/content/runtime'
import type { DatabasePageItem } from '../../../../types'
// import { MDCEditorAST } from '@farnabaz/mdc-editor'

const props = defineProps({
  dbItem: {
    type: Object as PropType<DatabasePageItem>,
    required: true,
  },
})

// const emit = defineEmits<{
//   'update:content': [content: DatabasePageItem]
//   'revert': []
// }>()

// const originalContent = ref({})

const document = computed({
  get() {
    if (!props.dbItem) {
      return {}
    }
    if (props.dbItem.body?.type === 'minimark') {
      return {
        ...props.dbItem,
        body: decompressTree(props.dbItem?.body),
        id: undefined,
        extension: undefined,
        stem: undefined,
        path: undefined,
        __hash__: undefined,
      }
    }
    else {
      return {
        ...props.dbItem,
        id: undefined,
        extension: undefined,
        stem: undefined,
        path: undefined,
        __hash__: undefined,
      }
    }
  },
  set(_value) {
    console.log('set', _value)
    // This setter allows the computed to be writable if needed
    // The actual content update will be handled by the watch below
  },
})

// watch(() => modelValue.value, (value) => {
//   if (value) {
//     originalContent.value = props.content
//   }
// })

// watch(content, async (value) => {
//   emit('update:content', {
//     ...toRaw(props.content),
//     ...toRaw(value),
//   })
// })

// function discard() {
//   emit('update:content', originalContent.value as DatabasePageItem)
//   modelValue.value = false
// }

// function _revert() {
//   emit('revert')
// }

// function confirm() {
//   modelValue.value = false
// }
</script>

<template>
  <div>
    <pre>
      {{ dbItem }}
    </pre>
    <PanelContentEditorText v-model="document" />
  </div>
  <!-- <MDCEditorAST v-model="content" /> -->
  <!-- <SimpleTextEditor v-model:document="content" /> -->
</template>
