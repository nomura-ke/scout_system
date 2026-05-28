import type { ScoutStatus } from '../types'

export function formatDate(value?: string): string {
  if (!value) return '-'
  return new Date(value).toLocaleString('ja-JP')
}

export function toStatusLabel(status?: ScoutStatus): string {
  if (status === 'APPROVED') return '承認済み'
  if (status === 'REMANDED') return '差戻し'
  return '下書き'
}
