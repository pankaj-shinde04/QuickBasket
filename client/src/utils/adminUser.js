const AVATAR_COLORS = [
  'bg-primary-light text-primary',
  'bg-tertiary-light text-tertiary',
  'bg-orange-100 text-orange-700',
  'bg-purple-100 text-purple-700',
]

export function formatJoinDate(value) {
  return new Date(value).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function formatStatusLabel(status) {
  if (!status) return 'Active'
  return status.charAt(0).toUpperCase() + status.slice(1)
}

export function getAvatarColor(index) {
  return AVATAR_COLORS[index % AVATAR_COLORS.length]
}

export const USER_STATUS = {
  ACTIVE: 'active',
  BANNED: 'banned',
}
