import { ref } from 'vue'
import type { StorageValue, Storage } from 'unstorage'
import type { DatabaseItem, DraftFileItem, StudioHost } from '../types'
import type { useGit } from './useGit'
import { generateMarkdown } from '../utils/content'

export function useDraftFiles(host: StudioHost, git: ReturnType<typeof useGit>, storage: Storage<StorageValue>) {
  const list = ref<DraftFileItem[]>([])
  const current = ref<DraftFileItem | null>(null)

  async function get(id: string, { generateContent = false }: { generateContent?: boolean } = {}) {
    const item = await storage.getItem(id) as DraftFileItem
    if (generateContent) {
      return {
        ...item,
        content: await generateMarkdown(item.document!) || '',
      }
    }
    return item
  }

  async function upsert(id: string, document: DatabaseItem, isCurrent: boolean = false) {
    id = id.replace(/:/g, '/')
    let item = await storage.getItem(id) as DraftFileItem
    if (!item) {
      const path = host.document.getFileSystemPath(id)

      const originalGithubFile = await git.fetchFile(path, { cached: true })
      const originalDatabaseItem = await host.document.get(id)

      item = {
        id,
        path,
        originalDatabaseItem,
        originalGithubFile,
        status: originalGithubFile || originalDatabaseItem ? 'updated' : 'created',
        document,
      }
    }
    else {
      item.document = document
    }

    await storage.setItem(id, item)

    const existingItem = list.value.find(item => item.id == id)
    if (existingItem) {
      existingItem.document = document
    }
    else {
      list.value.push(item)
    }

    await host.document.upsert(id, item.document!)
    host.requestRerender()

    if (isCurrent) {
      select(item)
    }
  }

  async function remove(id: string) {
    const item = await storage.getItem(id) as DraftFileItem
    const path = host.document.getFileSystemPath(id)

    if (item) {
      if (item.status === 'deleted') return

      await storage.removeItem(id)
      await host.document.delete(id)

      if (item.originalDatabaseItem) {
        const deleteDraft: DraftFileItem = {
          id,
          path: item.path,
          status: 'deleted',
          originalDatabaseItem: item.originalDatabaseItem,
          originalGithubFile: item.originalGithubFile,
        }

        await storage.setItem(id, deleteDraft)
        await host.document.upsert(id, item.originalDatabaseItem!)
      }
    }
    else {
      // Fetch github file before creating draft to detect non deployed changes
      const originalGithubFile = await git.fetchFile(path, { cached: true })
      const originalDatabaseItem = await host.document.get(id)

      const deleteItem: DraftFileItem = {
        id,
        path,
        status: 'deleted',
        originalDatabaseItem,
        originalGithubFile,
      }

      await storage.setItem(id, deleteItem)

      await host.document.delete(id)
    }

    list.value = list.value.filter(item => item.id !== id)
    host.requestRerender()
  }

  async function revert(id: string) {
    const item = await storage.getItem(id) as DraftFileItem
    if (!item) return

    await storage.removeItem(id)

    list.value = list.value.filter(item => item.id !== id)

    if (item.originalDatabaseItem) {
      await host.document.upsert(id, item.originalDatabaseItem)
    }

    if (item.status === 'created') {
      await host.document.delete(id)
    }
    host.requestRerender()
  }

  async function revertAll() {
    await storage.clear()
    for (const item of list.value) {
      if (item.originalDatabaseItem) {
        await host.document.upsert(item.id, item.originalDatabaseItem)
      }
      else if (item.status === 'created') {
        await host.document.delete(item.id)
      }
    }
    list.value = []
    host.requestRerender()
  }

  async function load() {
    const storedList = await storage.getKeys().then((keys) => {
      return Promise.all(keys.map(key => storage.getItem(key) as unknown as DraftFileItem))
    })

    list.value = storedList

    // Upsert/Delete draft files in database
    await Promise.all(list.value.map(async (draft) => {
      if (draft.status === 'deleted') {
        await host.document.delete(draft.id)
      }
      else {
        await host.document.upsert(draftFile.id, draftFile.document!)
      }
    }))

    host.requestRerender()
  }

  function select(draftItem: DraftFileItem | null) {
    current.value = draftItem
  }

  return {
    get,
    upsert,
    remove,
    revert,
    revertAll,
    list,
    load,
    current,
  }
}
