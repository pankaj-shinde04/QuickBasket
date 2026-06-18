export function getPagination(query = {}, defaultLimit = 20) {
  const page = Math.max(1, Number(query.page) || 1)
  const limit = Math.min(100, Math.max(1, Number(query.limit) || defaultLimit))
  const skip = (page - 1) * limit

  return { page, limit, skip }
}

export function buildPaginationMeta({ page, limit, total }) {
  const totalPages = Math.ceil(total / limit) || 1

  return {
    page,
    limit,
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  }
}
