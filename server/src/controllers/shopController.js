import * as shopService from '../services/shopService.js'

export async function getMyShop(req, res) {
  await shopService.assertShopOwner(req.user)
  const shop = await shopService.getShopByOwner(req.user._id)

  res.json({
    success: true,
    data: { shop },
  })
}

export async function registerShop(req, res) {
  await shopService.assertShopOwner(req.user)
  const shop = await shopService.registerShopProfile(req.user._id, req.body, req.file)

  res.json({
    success: true,
    message: req.body.draft === true || req.body.draft === 'true'
      ? 'Draft saved successfully.'
      : 'Shop registered successfully.',
    data: { shop },
  })
}
