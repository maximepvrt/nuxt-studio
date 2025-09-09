import { createSharedComposable } from '@vueuse/core'
import { computed } from 'vue'
import { useUi } from './useUi'
import type { StudioHost } from '../types'

export const useContext = createSharedComposable((host: StudioHost) => {
  const ui = useUi(host)

  const currentFeature = computed(() => Object.keys(ui.panels).find(key => ui.panels[key as keyof typeof ui.panels]))

  const actions = computed<any[]>(() => {
    return [
      {
        id: 'create-folder',
        label: 'Create folder',
        // tooltip: isReviewInProgress.value ? 'Cannot create folder while collaborator reviews changes' : undefined,
        // disabled: isReviewInProgress.value,
        // commandMenu: currentFeature.value !== 'data' && (currentFeatureFile.value as TreeFile)?.type !== 'file',
        // icon: 'i-ph-folder-notch-plus',
        // async click(path: string) {
        //   // When the action is called from the command palette the path is not defined
        //   if (!path) {
        //     ongoingFileAction.value = { action: 'create-folder' }
        //   }
        //   else {
        //     unsetOngoingFileAction()
        //     await createMediaFolder(path)
        //   }
        // },
      }, {
        id: 'create-file',
        label: 'Create file',
        // tooltip: isReviewInProgress.value ? 'Cannot create file while collaborator reviews changes' : undefined,
        // disabled: isReviewInProgress.value,
        // commandMenu: currentFeature.value !== 'data' && (currentFeatureFile.value as TreeFile)?.type !== 'file',
        // icon: 'i-ph-file-plus',
        // async click({ path, content }: { path?: string, content?: string } = {}) {
        //   // When the action is called from the command palette the path is not defined
        //   if (!path) {
        //     ongoingFileAction.value = { action: 'create-file' }
        //   }
        //   else {
        //     unsetOngoingFileAction()
        //     await createFile(path, content)
        //   }
        // },
      },
      // {
      //   id: 'revert-file',
      //   label: 'Revert changes',
      //   tooltip: isReviewInProgress.value ? 'Cannot revert while collaborator reviews changes' : undefined,
      //   disabled: isReviewInProgress.value,
      //   commandMenu: !!currentFeatureFile.value?.status,
      //   icon: 'i-ph-arrow-u-up-left',
      //   click(file: TreeFile | TreeMedia | ConfigFile) {
      //     // When the action is called from the command palette the path is not defined
      //     if (!file) {
      //       switch (currentFeature.value) {
      //         case 'content':
      //           file = currentFile.value
      //           break
      //         case 'media':
      //           file = currentMedia.value
      //           break
      //       }
      //     }
      //     // @ts-expect-error => Config file
      //     if (!file?.type) {
      //       openRevertAppConfigModal()
      //       return
      //     }

      //     const openRevertModal = file.path.startsWith('public/') ? openRevertMediaModal : openRevertFileModal
      //     openRevertModal(file as TreeFile & TreeMedia)
      //   },
      // },
      // {
      //   id: 'rename-file',
      //   label: 'Rename',
      //   tooltip: isReviewInProgress.value ? 'Cannot rename while collaborator reviews changes' : undefined,
      //   disabled: isReviewInProgress.value,
      //   // TODO: Rename functionality should be implemented in file page
      //   // commandMenu: currentFeature.value !== 'data' && !!currentFeatureFile.value && currentFeatureFile.value?.status !== 'deleted',
      //   commandMenu: false,
      //   icon: 'i-ph-pencil-simple',
      //   async click({ path, file }: { path?: string, file?: TreeFile | TreeMedia } = {}) {
      //     const rename = currentFeature.value === 'content' ? renameFile : renameMedia

      //     await rename([{ file, newPath: path }] as { file: TreeFile & TreeMedia, newPath: string }[])

      //     unsetOngoingFileAction()
      //   },
      // }, {
      //   id: 'delete-file',
      //   label: 'Delete',
      //   tooltip: isReviewInProgress.value ? 'Cannot delete while collaborator reviews changes' : undefined,
      //   disabled: isReviewInProgress.value,
      //   commandMenu: currentFeature.value !== 'data' && !!currentFeatureFile.value && currentFeatureFile.value?.status !== 'deleted',
      //   icon: 'i-ph-trash',
      //   click(file: TreeFile | TreeMedia) {
      //     // When the action is called from the command palette the path is not defined
      //     if (!file) {
      //       file = currentFile.value as TreeFile | TreeMedia
      //     }
      //     const openDeleteModal = currentFeature.value === 'content' ? openDeleteFileModal : openDeleteMediaModal

      //     openDeleteModal(file as TreeFile & TreeMedia)
      //   },
      // }, {
      //   id: 'duplicate-file',
      //   label: 'Duplicate',
      //   tooltip: isReviewInProgress.value ? 'Cannot duplicate file while collaborator reviews changes' : undefined,
      //   disabled: isReviewInProgress.value,
      //   commandMenu: currentFeature.value !== 'data' && (currentFeatureFile.value as TreeFile)?.type === 'file',
      //   icon: 'i-ph-copy',
      //   async click(file: TreeFile) {
      //     await duplicateFile(file)
      //   },
      // },
    ]
  })

  return {
    currentFeature,
  }
})
