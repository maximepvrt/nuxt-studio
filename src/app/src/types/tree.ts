import type { DraftStatus } from '../types/draft'

export interface TreeItem {
  id: string
  name: string
  fsPath: string
  type: 'file' | 'directory' | 'root'
  status?: DraftStatus
  fileType?: 'page' | 'data'
  routePath?: string
  children?: TreeItem[]
}
