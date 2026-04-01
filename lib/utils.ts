import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { Lead, LeadTemperature, CampaignStatus, ReplyClassification, CampaignChannel } from './types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function formatDateShort(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function formatRelativeTime(dateString: string): string {
  const now = new Date()
  const date = new Date(dateString)
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  return formatDateShort(dateString)
}

export function getTemperatureBadgeClass(temp: LeadTemperature): string {
  return { hot: 'badge-hot', warm: 'badge-warm', cold: 'badge-cold' }[temp]
}

export function getTemperatureLabel(temp: LeadTemperature): string {
  return { hot: '🔥 Hot', warm: '🌤 Warm', cold: '❄️ Cold' }[temp]
}

export function getStatusBadgeClass(status: CampaignStatus): string {
  return { active: 'badge-green', paused: 'badge-warm', draft: 'badge-cold', completed: 'badge-blue' }[status]
}

export function getReplyBadgeClass(classification: ReplyClassification): string {
  return {
    interested: 'reply-interested', not_interested: 'reply-negative',
    neutral: 'reply-neutral', ooo: 'reply-ooo', referral: 'badge-purple'
  }[classification]
}

export function getReplyLabel(classification: ReplyClassification): string {
  return {
    interested: '✅ Interested', not_interested: '❌ Not Interested',
    neutral: '🤔 Neutral', ooo: '🏖 Out of Office', referral: '↗️ Referral'
  }[classification]
}

export function getChannelIcon(channel: CampaignChannel): string {
  return { email: '✉️', linkedin: '💼', instagram: '📸' }[channel]
}

export function getChannelLabel(channel: CampaignChannel): string {
  return { email: 'Email', linkedin: 'LinkedIn', instagram: 'Instagram' }[channel]
}

export function getScoreColor(score: number): string {
  if (score >= 75) return '#ef4444'
  if (score >= 40) return '#f59e0b'
  return '#94a3b8'
}

export function getScoreBarColor(score: number): string {
  if (score >= 75) return 'linear-gradient(90deg, #ef4444, #f97316)'
  if (score >= 40) return 'linear-gradient(90deg, #f59e0b, #fbbf24)'
  return 'linear-gradient(90deg, #94a3b8, #cbd5e1)'
}

export function calcReplyRate(sent: number, replied: number): number {
  if (sent === 0) return 0
  return Math.round((replied / sent) * 1000) / 10
}

export function calcOpenRate(sent: number, opened: number): number {
  if (sent === 0) return 0
  return Math.round((opened / sent) * 1000) / 10
}

export function generateAvatarUrl(name: string): string {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&size=40&bold=true`
}

export function truncate(str: string, length: number): string {
  return str.length > length ? str.substring(0, length) + '...' : str
}

export function formatNumber(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`
  return n.toString()
}

export function formatPercent(n: number): string {
  return `${n.toFixed(1)}%`
}

export function getLeadInitials(name: string): string {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
}

export function getSourceLabel(source: Lead['source']): string {
  return { linkedin: 'LinkedIn', instagram: 'Instagram', google: 'Google', directory: 'Directory', manual: 'Manual' }[source]
}
