import type { DatabaseItem, DraftFileItem, TreeItem } from '../types'

export type DraftStatus = 'created' | 'updated' | 'deleted' | 'renamed'

export const COLOR_STATUS_MAP: { [key in DraftStatus]?: string } = {
  created: 'green',
  updated: 'orange',
  deleted: 'red',
  renamed: 'blue',
}

export function buildTree(items: DatabaseItem[], draft: DraftFileItem[]): TreeItem[] {
  const result: TreeItem[] = []
  const pathMap = new Map<string, TreeItem>()

  // Sort items by path to ensure parent directories are processed first
  const sortedItems = items
    .filter(item => item._path)
    .sort((a, b) => (a._path as string).localeCompare(b._path as string))

  for (const item of sortedItems) {
    const path = item._path as string
    const segments = path.split('/').filter(Boolean)

    // Build the full path for each segment
    for (let i = 0; i < segments.length; i++) {
      const currentPath = '/' + segments.slice(0, i + 1).join('/')
      const name = segments[i]
      const isFile = i === segments.length - 1

      if (pathMap.has(currentPath)) {
        continue
      }

      const treeItem: TreeItem = {
        id: item.id,
        name,
        path: currentPath,
        type: isFile ? 'file' : 'directory',
        status: getDraftStatus(draft, item.id),
      }

      if (!isFile) {
        treeItem.children = []
      }

      pathMap.set(currentPath, treeItem)

      // Add to root
      if (i === 0) {
        result.push(treeItem)
      }
      // Add to parent
      else {
        const parentPath = '/' + segments.slice(0, i).join('/')
        const parent = pathMap.get(parentPath)
        if (parent && parent.children) {
          parent.children.push(treeItem)
        }
      }
    }
  }

  calculateDirectoryStatuses(result)

  return result
}

function getDraftStatus(draft: DraftFileItem[], id: string) {
  const draftItem = draft.find(item => item.id === id)
  return draftItem?.status
}

/**
 * Calculate status for directories based on their children
 */
function calculateDirectoryStatuses(items: TreeItem[]) {
  for (const item of items) {
    if (item.type === 'directory' && item.children) {
      // Recursively calculate children first
      calculateDirectoryStatuses(item.children)

      // Calculate this directory's status based on children
      const childStatuses = item.children
        .map(child => child.status)
        .filter(Boolean)

      if (childStatuses.length > 0) {
        // Priority: deleted > created > updated
        if (childStatuses.includes('deleted')) {
          item.status = 'deleted'
        }
        else if (childStatuses.includes('created')) {
          item.status = 'created'
        }
        else if (childStatuses.includes('updated')) {
          item.status = 'updated'
        }
      }
    }
  }
}
