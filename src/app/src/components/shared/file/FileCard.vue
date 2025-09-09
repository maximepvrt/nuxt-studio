<script setup lang="ts">
import { useTimeAgo } from '@vueuse/core'
import type { TreeItem } from '../../../types'
import type { PropType } from 'vue'
import { ref, computed } from 'vue'

const props = defineProps({
  file: {
    type: Object as PropType<TreeItem>,
    required: true,
  },
  // ongoingFileAction: {
  //   type: Object as PropType<FileAction>,
  //   default: null,
  // },
  // readOnly: {
  //   type: Boolean,
  //   default: false,
  // },
  // disableHover: {
  //   type: Boolean,
  //   default: false,
  // },
  // isDragged: {
  //   type: Boolean,
  //   default: false,
  // },
  // isHovered: {
  //   type: Boolean,
  //   default: false,
  // },
})

const ongoingFileRename = ref(false)
const isFolder = computed(() => props.file.type === 'directory')
const name = computed(() => props.file.name)

// const { computeFileActions } = useProjectContext(project.value)
// const loaded = ref(false)

// const { data: url } = useAsyncData<string>(`screenshot-url-${project.value.id}-${props.file.pathRoute}`, async () => {
//   if (props.file.pathRoute && project.value.url) {
//     const path = props.file.pathRoute.replace('index', '')
//     return await client(`/screenshots/${project.value.id}/${encodeURIComponent(path)}`)
//   }
// })

// const name = computed(() => {
//   if (props.file.type === 'directory') {
//     return titleCase(props.file.nameWithoutPrefix || props.file.name.replace(/^\d+\./, ''))
//   }

//   // Remove extension
//   const fileName = (props.file.nameWithoutPrefix || props.file.name.replace(/^\d+\./, '')).split('.').slice(0, -1).join('.')

//   // Handle index files
//   if (fileName === 'index') {
//     const pathParts = props.file.pathWithoutRoot.split('/')
//     // Return home for index file
//     if (pathParts.length === 1) {
//       return 'Home.home'
//     }

//     // Else return parent name without prefix
//     return titleCase(pathParts[pathParts.length - 2].replace(/^\d+\./, '')) + '.home'
//   }

//   return titleCase(fileName)
// })

const icon = computed(() => {
  const ext = props.file.path.split('.').pop()?.toLowerCase() || ''
  return {
    md: 'i-simple-icons-markdown',
    yaml: 'i-simple-icons-yaml',
    yml: 'i-simple-icons-yaml',
    json: 'i-mdi-code-json',
  }[ext] || 'i-mdi-file'
})

// const imgUrl = computed(() => url.value ? `${url.value}?theme=${colorMode.value}` : null)

// const isFolder = computed(() => props.file.type === 'directory')
// const actionItems = computed(() => computeFileActions(props.file))

// const ongoingFileRename = computed(() => props.ongoingFileAction?.action === 'rename-file' && props.ongoingFileAction.path === props.file.path)

// const ring = computed(() => {
//   const color = COLOR_STATUS_MAP[props.file.status] || 'gray'

//   if (ongoingFileRename.value) return `ring-2 ring-primary-400 dark:ring-primary-600`

//   const hover = props.disableHover ? '' : 'hover:ring-2 hover:ring-primary-400 dark:hover:ring-primary-600'
//   const dragged = props.isDragged ? `ring-0 border-2 border-dashed border-${color}-200 dark:border-${color}-400` : ''
//   const basic = color === 'gray' ? 'ring-gray-200 color-gray-800' : `ring-${color}-200 dark:ring-${color}-400`

//   return `ring-1 ${basic} ${hover} ${dragged}`
// })
</script>

<template>
  <UPageCard>
    <div class="relative">
      <NuxtImg
        src="/assets/card-placeholder-light.png"
        width="695"
        height="390"
        class="z-[-1] rounded-t-lg"
      />
      <div
        class="absolute inset-0 flex items-center justify-center"
      >
        <UIcon
          :name="icon"
          class="w-8 h-8 text-gray-400 dark:text-gray-500"
        />
      </div>
    </div>
    <!-- <template
      v-if="file.type === 'file'"
      #header
    >
      <div
        v-if="url && file.status !== 'created'"
        class="relative"
      >
        <USkeleton
          v-if="!loaded"
          class="absolute inset-0 rounded-none bg-gray-300 dark:bg-gray-700 rounded-t-lg"
        />
        <NuxtImg
          v-if="url"
          :src="imgUrl"
          width="695"
          height="390"
          class="z-[-1] rounded-t-lg"
          @error="url = null"
          @load="loaded = true"
        />
      </div>
      <div
        v-else
        class="relative"
      >
        <NuxtImg
          :src="placeholder"
          width="695"
          height="390"
          class="z-[-1] rounded-t-lg"
        />
        <div
          class="absolute inset-0 flex items-center justify-center"
        >
          <UIcon
            :name="icon"
            class="w-8 h-8 text-gray-400 dark:text-gray-500"
          />
        </div>
      </div>
      <UDropdown
        v-if="!readOnly"
        :items="actionItems"
        class="hidden group-hover:block absolute top-2 right-2"
        :popper="{ strategy: 'absolute' }"
        @click="$event.stopPropagation()"
      >
        <UButton
          color="white"
          variant="solid"
          aria-label="Open actions"
          icon="i-ph-dots-three-vertical"
          square
        />
      </UDropdown>
    </template> -->
    <div class="flex items-center justify-between gap-3 mb-1">
      <div v-if="ongoingFileRename">
        <!-- <ProjectFileFormInput
          v-if="ongoingFileRename"
          class="flex-1 my-0.5"
          :current-file="file"
          :ongoing-file-action="ongoingFileAction"
          @submit="emit('rename', $event)"
          @click="$event.stopPropagation()"
        /> -->
      </div>
      <template v-else>
        <div class="flex items-center gap-1 min-w-0 my-1 relative">
          <UIcon
            v-if="isFolder"
            name="i-lucide-folder"
            class="h-4 w-4"
          />
          <UIcon
            v-else-if="name.endsWith('.home')"
            name="i-lucide-house"
            class="h-4 w-4"
          />
          <h3
            class="text-base font-semibold truncate"
            :class="props.file.status === 'deleted' && 'line-through'"
          >
            {{ name }}
          </h3>
        </div>
        <!-- <UDropdown
          v-if="!readOnly && isFolder"
          class="hidden group-hover:block"
          :items="actionItems"
          :popper="{ strategy: 'absolute' }"
          @click="$event.stopPropagation()"
        >
          <UButton
            color="gray"
            variant="ghost"
            aria-label="Open items"
            icon="i-ph-dots-three-vertical"
            square
          />
        </UDropdown> -->
        <PanelBaseBadge
          v-if="file.status"
          :status="file.status"
        />
      </template>
    </div>

    <UTooltip
      :text="file.path"
      class="flex items-center justify-between gap-3 leading-none text-gray-400 dark:text-gray-500"
    >
      <div class="flex w-[70%]">
        <span class="truncate leading-relaxed">
          {{ file.path }}
        </span>
      </div>
      <div class="flex items-center gap-1 min-w-0">
        <UIcon
          name="i-lucide-clock"
          class="w-4 h-4 flex-shrink-0"
        />
        <time class="truncate leading-relaxed">
          {{ useTimeAgo(file.updatedAt ? new Date(file.updatedAt) : new Date()).value }}
        </time>
      </div>
    </UTooltip>
  </UPageCard>
</template>
