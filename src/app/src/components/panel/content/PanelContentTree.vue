<script setup lang="ts">
import type { DatabaseItem } from '../../../types'
import type { PropType } from 'vue'
import FileParentCard from '../../shared/file/FileParentCard.vue'

const props = defineProps({
  type: {
    type: String as PropType<'folder' | 'file'>,
    required: true,
  },
  // tree: {
  //   type: Array as PropType<TreeFile[] | TreeMedia[]>,
  //   default: () => [],
  // },
  // displayMeta: {
  //   type: Boolean,
  //   default: true,
  // },
  currentFile: {
    type: Object as PropType<DatabaseItem>,
    default: null,
  },
  // ongoingFileAction: {
  //   type: Object as PropType<FileAction>,
  //   default: null,
  // },
  // readOnly: {
  //   type: Boolean,
  //   default: false,
  // },
})
</script>

<template>
  <div class="flex flex-col @container">
    <ul
      ref="container"
      class="grid grid-cols-1 @md:grid-cols-2 @2xl:grid-cols-3 @4xl:grid-cols-4 @7xl:grid-cols-6 gap-6"
    >
      <li
        v-show="type === 'folder' && currentFile?.type === 'directory'"
        id="no-drag"
        draggable="false"
      >
        <FileParentCard
          :current-file="currentFile"
        />
      </li>
      <!-- <pre>
        {{ tree }}
      </pre> -->
      <!-- <li
        v-if="ongoingFileAction?.action === `create-${type}`"
        draggable="false"
      >
        <ProjectFileFormItem
          :current-file="currentFile"
          :ongoing-file-action="ongoingFileAction"
          @submit="emit('create', $event)"
        />
      </li> -->
      <!-- <li
        v-for="(file, index) in folderTree"
        :key="`${file.path}-${index}`"
      >
        <FileCard
          :file="file"
        />
      </li> -->
    </ul>
  </div>
</template>
