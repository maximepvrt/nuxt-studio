import type { DraftStatus } from '../utils/draft'

export interface TreeItem {
  id: string
  name: string
  path: string
  status?: DraftStatus
  type: 'file' | 'directory'
  children?: TreeItem[]

  // Corresponding file route in url
  // pathRoute?: string
}
