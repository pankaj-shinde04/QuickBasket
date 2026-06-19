import Shop, { SHOP_STATUS } from '../models/Shop.js'
import User, { USER_STATUS } from '../models/User.js'
import ApiError from '../utils/ApiError.js'
import { getPagination, buildPaginationMeta } from '../utils/pagination.js'
import { ROLES } from '../constants/roles.js'
import {
  sendShopOwnerApprovedEmail,
  sendShopOwnerRejectedEmail,
} from './emailService.js'

function formatVendor(shop) {
  const owner = shop.owner

  return {
    id: shop._id.toString(),
    shopId: shop._id.toString(),
    name: shop.name,
    owner: owner ? `${owner.firstName} ${owner.lastName}` : 'Unknown',
    ownerId: owner?._id?.toString(),
    email: shop.email,
    address: shop.address,
    contactNumber: shop.contactNumber,
    logo: shop.logo,
    registered: shop.createdAt,
    status: capitalizeStatus(shop.status),
    rawStatus: shop.status,
    profileComplete: shop.profileComplete,
  }
}

function capitalizeStatus(status) {
  if (!status) return 'Pending'
  return status.charAt(0).toUpperCase() + status.slice(1)
}

export async function listVendors(query = {}) {
  const { page, limit, skip } = getPagination(query, 10)
  const filter = {}

  if (query.status) {
    filter.status = query.status.toLowerCase()
  }

  if (query.search) {
    const search = query.search.trim()
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ]
  }

  const [shops, total] = await Promise.all([
    Shop.find(filter)
      .populate('owner', 'firstName lastName email role status')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Shop.countDocuments(filter),
  ])

  let vendors = shops.map(formatVendor)

  if (query.search) {
    const q = query.search.trim().toLowerCase()
    vendors = vendors.filter(
      (vendor) =>
        vendor.name.toLowerCase().includes(q) ||
        vendor.owner.toLowerCase().includes(q) ||
        vendor.email.toLowerCase().includes(q)
    )
  }

  return {
    vendors,
    pagination: buildPaginationMeta({ page, limit, total }),
  }
}

export async function getVendorStats() {
  const [pendingRequests, totalActive, suspended, rejected] = await Promise.all([
    Shop.countDocuments({ status: SHOP_STATUS.PENDING }),
    Shop.countDocuments({ status: SHOP_STATUS.ACTIVE }),
    Shop.countDocuments({ status: SHOP_STATUS.SUSPENDED }),
    Shop.countDocuments({ status: SHOP_STATUS.REJECTED }),
  ])

  return {
    pendingRequests,
    totalActive,
    suspended,
    rejected,
    activeToday: 0,
    registrationTrend: 'New shop registrations are reviewed by admin before activation.',
  }
}

async function getShopWithOwner(shopId) {
  const shop = await Shop.findById(shopId).populate('owner')

  if (!shop) {
    throw new ApiError(404, 'Vendor not found.')
  }

  return shop
}

export async function approveVendor(shopId) {
  const shop = await getShopWithOwner(shopId)

  if (shop.status !== SHOP_STATUS.PENDING) {
    throw new ApiError(400, 'Only pending vendors can be approved.')
  }

  shop.status = SHOP_STATUS.ACTIVE
  await shop.save()

  const owner = await User.findById(shop.owner._id)
  owner.status = USER_STATUS.ACTIVE
  await owner.save()

  void sendShopOwnerApprovedEmail(owner, shop.name)

  return formatVendor(await shop.populate('owner', 'firstName lastName email role status'))
}

export async function rejectVendor(shopId) {
  const shop = await getShopWithOwner(shopId)

  if (shop.status !== SHOP_STATUS.PENDING) {
    throw new ApiError(400, 'Only pending vendors can be rejected.')
  }

  shop.status = SHOP_STATUS.REJECTED
  await shop.save()

  const owner = await User.findById(shop.owner._id)
  owner.status = USER_STATUS.REJECTED
  await owner.save()

  void sendShopOwnerRejectedEmail(owner, shop.name)

  return formatVendor(await shop.populate('owner', 'firstName lastName email role status'))
}

export function buildDefaultShopName(firstName, lastName) {
  return `${firstName.trim()} ${lastName.trim()}'s Shop`
}
