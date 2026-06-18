import { Routes, Route } from 'react-router-dom'
import ProtectedRoute, { GuestRoute, StorefrontRoute } from './components/ProtectedRoute'
import CustomerLayout from './components/customer/CustomerLayout'
import ShopOwnerLayout from './components/shop-owner/ShopOwnerLayout'
import { ProductProvider } from './context/ProductContext'
import { ROLES } from './constants/roles'
import Home from './pages/Home'
import About from './pages/About'
import Auth from './pages/Auth'
import CustomerDashboard from './pages/CustomerDashboard'
import CustomerOrderHistory from './pages/customer/OrderHistory'
import CustomerOrderTracking from './pages/customer/OrderTracking'
import CustomerWishlist from './pages/customer/Wishlist'
import CustomerCart from './pages/customer/Cart'
import CustomerCheckout from './pages/customer/Checkout'
import CustomerPlaceholder from './pages/customer/Placeholder'
import ShopOwnerDashboard from './pages/ShopOwnerDashboard'
import ShopOwnerInventory from './pages/shop-owner/Inventory'
import ShopOwnerAddProduct from './pages/shop-owner/AddProduct'
import ShopOwnerEditProduct from './pages/shop-owner/EditProduct'
import ShopOwnerOrders from './pages/shop-owner/Orders'
import ShopOwnerOrderDetails from './pages/shop-owner/OrderDetails'
import ShopOwnerPlaceholder from './pages/shop-owner/Placeholder'
import AdminLayout from './components/admin/AdminLayout'
import AdminDashboard from './pages/AdminDashboard'
import AdminAnalytics from './pages/admin/Analytics'
import AdminVendors from './pages/admin/Vendors'
import AdminUsers from './pages/admin/Users'
import AdminSettings from './pages/admin/Settings'
import ProductDetail from './pages/ProductDetail'
import CategoryPage from './pages/CategoryPage'
import Layout from './components/Layout'

export default function App() {
  return (
    <Routes>
      <Route
        path="/auth"
        element={
          <GuestRoute>
            <Auth />
          </GuestRoute>
        }
      />

      <Route
        path="/dashboard/customer"
        element={
          <ProtectedRoute allowedRoles={[ROLES.CUSTOMER]}>
            <CustomerLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<CustomerDashboard />} />
        <Route path="orders" element={<CustomerOrderHistory />} />
        <Route path="orders/:orderId/track" element={<CustomerOrderTracking />} />
        <Route path="wishlist" element={<CustomerWishlist />} />
        <Route path="cart" element={<CustomerCart />} />
        <Route path="checkout" element={<CustomerCheckout />} />
        <Route path="rewards" element={<CustomerPlaceholder title="Rewards" />} />
        <Route path="settings" element={<CustomerPlaceholder title="Settings" />} />
        <Route path="analytics" element={<CustomerPlaceholder title="Analytics" />} />
        <Route path="users" element={<CustomerPlaceholder title="Users" />} />
      </Route>

      <Route
        path="/dashboard/shop-owner"
        element={
          <ProtectedRoute allowedRoles={[ROLES.SHOP_OWNER]}>
            <ProductProvider>
              <ShopOwnerLayout />
            </ProductProvider>
          </ProtectedRoute>
        }
      >
        <Route index element={<ShopOwnerDashboard />} />
        <Route path="inventory" element={<ShopOwnerInventory />} />
        <Route path="inventory/add" element={<ShopOwnerAddProduct />} />
        <Route path="inventory/edit/:id" element={<ShopOwnerEditProduct />} />
        <Route path="orders" element={<ShopOwnerOrders />} />
        <Route path="orders/:orderId" element={<ShopOwnerOrderDetails />} />
        <Route
          path="reports"
          element={<ShopOwnerPlaceholder title="Reports" />}
        />
        <Route
          path="settings"
          element={<ShopOwnerPlaceholder title="Settings" />}
        />
      </Route>

      <Route
        path="/dashboard/admin"
        element={
          <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="analytics" element={<AdminAnalytics />} />
        <Route path="vendors" element={<AdminVendors />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>

      <Route
        path="/"
        element={
          <StorefrontRoute>
            <Layout />
          </StorefrontRoute>
        }
      >
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="category/:categorySlug" element={<CategoryPage />} />
        <Route path="product/:productId" element={<ProductDetail />} />
      </Route>
    </Routes>
  )
}
