<template>
  <UPageCard
    class="cursor-pointer relative group"
    :ui="{
      body: { padding: 'sm:p-3 p-3' },
      header: { padding: 'sm:p-0 p-0' },
      ring: 'ring-gray-200 color-gray-800 hover:ring-2 hover:ring-primary-400 dark:hover:ring-primary-600',
    }"
  >
    <div class="flex items-center gap-2 min-w-0 mb-1">
      <UIcon
        name="i-ph-folder-notch"
        class="h-4 w-4 flex-shrink-0"
      />
      <span class="text-base font-semibold truncate my-1">
        ../
      </span>
    </div>

    <span class="text-gray-400 dark:text-gray-500">
      {{ parentFile?.name !== 'root' ? parentFile?.stem : context.currentFeature }}
    </span>
  </UPageCard>
</template>

<script setup lang="ts">
import { useStudio } from '../../../composables/useStudio'
import type { DatabaseItem } from '../../../types'
import type { PropType } from 'vue'

defineProps({
  currentFile: {
    type: Object as PropType<DatabaseItem>,
    default: null,
  },
  parentFile: {
    type: Object as PropType<DatabaseItem>,
    default: null,
  },
})

const { context } = useStudio()
</script>
