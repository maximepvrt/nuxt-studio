import { createStorage } from 'unstorage'
import indexedDbDriver from 'unstorage/drivers/indexedb'
import type { DatabaseItem } from '../types'
import { getCollectionInfo, generateRecordDeletion } from '../utils/collections'
import { applyDraftToDatabase } from '../utils/database'
import { useHost } from './useHost'
import { useGit } from './useGit'
import { useDraftFiles } from './useDraftFiles'

const storage = createStorage({
  driver: indexedDbDriver({
    storeName: 'nuxt-content-preview',
  }),
})

export function usePreview() {
  const host = useHost()
  const git = useGit({
    owner: 'owner',
    repo: 'repo',
    branch: 'main',
    token: 'ghp_...',
    authorName: 'Name',
    authorEmail: 'email@example.com',
  })

  const draftFiles = useDraftFiles(host, git, storage)

  host.onMounted(async () => {
    await draftFiles.load()
    await Promise.all(draftFiles.list().map(async (draft) => {
      if (draft.status === 'deleted') {
        const { collection } = getCollectionInfo(draft.id, host.content.collections)
        await host.databaseAdapter(collection.name).exec(generateRecordDeletion(collection, draft.id))
      }
      else {
        await applyDraftToDatabase(host, draft.id, draft.document!)
      }
    }))
    host.nuxtApp.hooks.callHookParallel('app:data:refresh')
  })

  host.onBeforeUnload((event: BeforeUnloadEvent) => {
    // Ignore on development to prevent annoying dialogs
    if (import.meta.dev) return
    if (!draftFiles.list().length) return

    // Recommended
    event.preventDefault()
    event = event || window.event

    // For IE and Firefox prior to version 4
    if (event) {
      event.returnValue = 'Sure?'
    }

    // For Safari
    return 'Sure?'
  })

  return {
    host,
    git,
    draftFiles,
    // draftMedia: {
    //   get -> DraftMediaItem
    //   upsert
    //   remove
    //   revert
    //   move
    //   list -> DraftMediaItem[]
    //   revertAll
    // }
    file: {
      list: async () => {
        const collections = Object.keys(host.content.collections).filter(c => c !== 'info')
        const contents = await Promise.all(collections.map(async (collection) => {
          const docs = await host.content.queryCollection(collection).all() as DatabaseItem[]
          return docs
        }))
        return contents.flat()
      },
    },
    // media: {
    //   list -> MediaItem[]
    // }
    // config {
    //   get -> ConfigItem
    //   update
    //   revert
    // }
  }
}
