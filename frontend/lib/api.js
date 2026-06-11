const API_URL = process.env.NEXT_PUBLIC_API_URL || ''

export const apiCall = async (endpoint, options = {}) => {
	const token =
		typeof window !== 'undefined' ? localStorage.getItem('token') : null

	const headers = {
		'Content-Type': 'application/json',
		...options.headers,
	}

	if (token) {
		headers.Authorization = `Bearer ${token}`
	}

	const response = await fetch(`${API_URL}${endpoint}`, {
		...options,
		headers,
	})

	if (!response.ok) {
		const data = await response.json().catch(() => ({}))
		throw new Error(data.message || `API error: ${response.status}`)
	}

	return response.json()
}

// Auth
export const register = data =>
	apiCall('/api/auth/register', { method: 'POST', body: JSON.stringify(data) })
export const login = data =>
	apiCall('/api/auth/login', { method: 'POST', body: JSON.stringify(data) })
export const verify = () => apiCall('/api/auth/verify')

// Customers
export const getCustomers = () => apiCall('/api/customers')
export const getCustomer = id => apiCall(`/api/customers/${id}`)
export const createCustomer = data =>
	apiCall('/api/customers', { method: 'POST', body: JSON.stringify(data) })
export const updateCustomer = (id, data) =>
	apiCall(`/api/customers/${id}`, { method: 'PUT', body: JSON.stringify(data) })
export const deleteCustomer = id =>
	apiCall(`/api/customers/${id}`, { method: 'DELETE' })

// Products
export const getProducts = () => apiCall('/api/products')
export const getProduct = id => apiCall(`/api/products/${id}`)
export const createProduct = data =>
	apiCall('/api/products', { method: 'POST', body: JSON.stringify(data) })
export const updateProduct = (id, data) =>
	apiCall(`/api/products/${id}`, { method: 'PUT', body: JSON.stringify(data) })
export const deleteProduct = id =>
	apiCall(`/api/products/${id}`, { method: 'DELETE' })

// Orders
export const getOrders = () => apiCall('/api/orders')
export const getOrder = id => apiCall(`/api/orders/${id}`)
export const createOrder = data =>
	apiCall('/api/orders', { method: 'POST', body: JSON.stringify(data) })
export const updateOrder = (id, data) =>
	apiCall(`/api/orders/${id}`, { method: 'PUT', body: JSON.stringify(data) })
export const deleteOrder = id =>
	apiCall(`/api/orders/${id}`, { method: 'DELETE' })

// Customer Orders (for logged-in customers)
export const getMyOrders = () => apiCall('/api/orders/my')
export const createMyOrder = data =>
	apiCall('/api/orders/my', { method: 'POST', body: JSON.stringify(data) })
export const cancelMyOrder = id =>
	apiCall(`/api/orders/my/${id}/cancel`, { method: 'PUT' })

// Deals
export const getDeals = () => apiCall('/api/deals')
export const getDeal = id => apiCall(`/api/deals/${id}`)
export const createDeal = data =>
	apiCall('/api/deals', { method: 'POST', body: JSON.stringify(data) })
export const updateDeal = (id, data) =>
	apiCall(`/api/deals/${id}`, { method: 'PUT', body: JSON.stringify(data) })
export const deleteDeal = id =>
	apiCall(`/api/deals/${id}`, { method: 'DELETE' })

// Dashboard
export const getAdminDashboard = () => apiCall('/api/dashboard/admin')
export const getCustomerDashboard = () => apiCall('/api/dashboard/customer')
