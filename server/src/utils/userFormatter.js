export function formatPublicUser(user) {
  return {
    id: user.id ?? user._id.toString(),
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role,
    status: user.status,
    avatar: user.avatar || '',
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  }
}

export function formatAdminUserListItem(user) {
  const publicUser = formatPublicUser(user)

  return {
    ...publicUser,
    name: `${user.firstName} ${user.lastName}`,
    joinDate: user.createdAt,
    initials: `${user.firstName[0] ?? ''}${user.lastName[0] ?? ''}`.toUpperCase(),
  }
}
