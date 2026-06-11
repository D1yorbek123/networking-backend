import dotenv from 'dotenv'
import dns from 'node:dns'
import mongoose from 'mongoose'
import ActivityLog from '../src/models/ActivityLog.js'
import Customer from '../src/models/Customer.js'
import Deal from '../src/models/Deal.js'
import Order from '../src/models/Order.js'
import Product from '../src/models/Product.js'
import User from '../src/models/User.js'

dotenv.config()

const connectDB = async () => {
	try {
		const mongoURI = process.env.MONGODB_URI || process.env.MONGODB_LOCAL
		if (mongoURI?.startsWith('mongodb+srv://')) {
			const dnsServers = (process.env.MONGODB_DNS_SERVERS || '8.8.8.8,1.1.1.1')
				.split(',')
				.map(server => server.trim())
				.filter(Boolean)
			if (dnsServers.length > 0) {
				dns.setServers(dnsServers)
			}
		}
		await mongoose.connect(mongoURI)
		console.log('[v0] Connected to MongoDB')
	} catch (error) {
		console.error('[v0] MongoDB connection failed:', error.message)
		process.exit(1)
	}
}

const seedData = async () => {
	try {
		// Clear existing data
		console.log('[v0] Clearing existing data...')
		await User.deleteMany({})
		await Customer.deleteMany({})
		await Product.deleteMany({})
		await Order.deleteMany({})
		await Deal.deleteMany({})
		await ActivityLog.deleteMany({})

		// Create Admin Users (2)
		console.log('[v0] Creating admin users...')
		const admin1 = await User.create({
			name: 'Admin User',
			email: 'admin@example.com',
			password: 'admin123',
			role: 'admin',
			department: 'Management',
			phone: '+1234567890',
			address: '123 Admin Street',
			city: 'New York',
			country: 'USA',
		})

		const admin2 = await User.create({
			name: 'Sarah Manager',
			email: 'sarah@example.com',
			password: 'password123',
			role: 'admin',
			department: 'Sales',
			phone: '+1234567891',
			address: '124 Business Ave',
			city: 'Los Angeles',
			country: 'USA',
		})

		// Create Customer Users (8)
		console.log('[v0] Creating customer users...')
		const customers = []
		const customerData = [
			{
				name: 'John Smith',
				email: 'john@company1.com',
				password: 'password123',
			},
			{
				name: 'Emma Wilson',
				email: 'emma@company2.com',
				password: 'password123',
			},
			{
				name: 'Michael Brown',
				email: 'michael@company3.com',
				password: 'password123',
			},
			{
				name: 'Sophie Taylor',
				email: 'sophie@company4.com',
				password: 'password123',
			},
			{
				name: 'David Johnson',
				email: 'david@company5.com',
				password: 'password123',
			},
			{
				name: 'Lisa Anderson',
				email: 'lisa@company6.com',
				password: 'password123',
			},
			{
				name: 'James Martinez',
				email: 'james@company7.com',
				password: 'password123',
			},
			{
				name: 'Nina Garcia',
				email: 'nina@company8.com',
				password: 'password123',
			},
		]

		for (const data of customerData) {
			const user = await User.create({
				...data,
				role: 'customer',
				department: 'Purchasing',
				phone: `+123456789${Math.floor(Math.random() * 10)}`,
				city: 'Various',
				country: 'USA',
			})
			customers.push(user)
		}

		// Create Customer Records (10)
		console.log('[v0] Creating customer records...')
		const customerRecords = []
		const customerRecordsData = [
			{
				name: 'Fashion Retail Inc',
				email: 'contact@fashionretail.com',
				company: 'Fashion Retail Inc',
				industry: 'Retail',
			},
			{
				name: 'Boutique Collective',
				email: 'info@boutiquecol.com',
				company: 'Boutique Collective',
				industry: 'Fashion',
			},
			{
				name: 'Department Store Co',
				email: 'sales@deptstore.com',
				company: 'Department Store Co',
				industry: 'Retail',
			},
			{
				name: 'Online Fashion Hub',
				email: 'hello@onlinehub.com',
				company: 'Online Fashion Hub',
				industry: 'E-commerce',
			},
			{
				name: 'Luxury Boutique Group',
				email: 'vip@luxuryboutique.com',
				company: 'Luxury Boutique Group',
				industry: 'Fashion',
			},
			{
				name: 'Urban Clothing',
				email: 'team@urbanclothing.com',
				company: 'Urban Clothing',
				industry: 'Retail',
			},
			{
				name: 'Sports Fashion Co',
				email: 'contact@sportsfashion.com',
				company: 'Sports Fashion Co',
				industry: 'Sports',
			},
			{
				name: 'Kids Fashion World',
				email: 'info@kidsfashion.com',
				company: 'Kids Fashion World',
				industry: 'Fashion',
			},
			{
				name: 'Global Apparel Ltd',
				email: 'sales@globalapparel.com',
				company: 'Global Apparel Ltd',
				industry: 'Wholesale',
			},
			{
				name: 'Designer Showcase',
				email: 'hello@designershowcase.com',
				company: 'Designer Showcase',
				industry: 'Fashion',
			},
		]

		for (let i = 0; i < customerRecordsData.length; i++) {
			// Link first 8 customer records to the 8 customer users
			const linkedUser = i < customers.length ? customers[i]._id : undefined;
			const customer = await Customer.create({
				...customerRecordsData[i],
				userId: linkedUser,
				phone: `+1 (555) ${String(i + 1).padStart(3, '0')}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
				address: `${i + 100} Fashion Street`,
				city: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'][
					i % 5
				],
				country: 'USA',
				status: ['active', 'inactive', 'pending'][
					Math.floor(Math.random() * 3)
				],
				creditLimit: 5000 + i * 1000,
				totalSpent: Math.floor(Math.random() * 50000),
				rating: Math.floor(Math.random() * 5) + 1,
				createdBy: admin1._id,
			})
			customerRecords.push(customer)
		}

		// Link mapping for reference:
		// John Smith (john@company1.com)    -> Fashion Retail Inc
		// Emma Wilson (emma@company2.com)   -> Boutique Collective
		// Michael Brown (michael@company3.com) -> Department Store Co
		// Sophie Taylor (sophie@company4.com) -> Online Fashion Hub
		// David Johnson (david@company5.com)  -> Luxury Boutique Group
		// Lisa Anderson (lisa@company6.com)   -> Urban Clothing
		// James Martinez (james@company7.com) -> Sports Fashion Co
		// Nina Garcia (nina@company8.com)    -> Kids Fashion World

		// Create Products (15)
		console.log('[v0] Creating products...')
		const products = []
		const productCategories = [
			'Shirts',
			'Pants',
			'Dresses',
			'Jackets',
			'Accessories',
		]
		const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

		for (let i = 0; i < 15; i++) {
			const product = await Product.create({
				name: `Product ${i + 1} - ${productCategories[i % productCategories.length]}`,
				sku: `SKU-${String(i + 1).padStart(5, '0')}`,
				category: productCategories[i % productCategories.length],
				description: `High-quality ${productCategories[i % productCategories.length].toLowerCase()} for fashion wholesale`,
				price: 20 + Math.random() * 80,
				cost: 10 + Math.random() * 40,
				quantity: Math.floor(Math.random() * 100) + 10,
				reorderLevel: Math.floor(Math.random() * 20) + 5,
				warehouse: ['Main', 'Secondary', 'Express'][
					Math.floor(Math.random() * 3)
				],
				status: 'active',
			})
			products.push(product)
		}

		// Create Orders (12)
		console.log('[v0] Creating orders...')
		const orders = []
		const orderStatuses = [
			'pending',
			'processing',
			'shipped',
			'delivered',
			'cancelled',
		]

		for (let i = 0; i < 12; i++) {
			const customer = customerRecords[i % customerRecords.length]
			const itemCount = Math.floor(Math.random() * 5) + 1
			const items = []
			let totalAmount = 0

			for (let j = 0; j < itemCount; j++) {
				const product = products[Math.floor(Math.random() * products.length)]
				const quantity = Math.floor(Math.random() * 10) + 1
				const price = product.price
				items.push({
					product: product._id,
					quantity,
					price,
				})
				totalAmount += quantity * price
			}

			const order = await Order.create({
				orderNumber: `ORD-${String(i + 1).padStart(6, '0')}`,
				customer: customer._id,
				items,
				totalAmount: Math.round(totalAmount * 100) / 100,
				status: orderStatuses[Math.floor(Math.random() * orderStatuses.length)],
				shippingAddress: `${i + 200} Delivery Lane, ${customer.city}, ${customer.country}`,
				notes: `Order notes for order ${i + 1}`,
				createdBy: admin1._id,
			})
			orders.push(order)
		}

		// Create Deals (8)
		console.log('[v0] Creating deals...')
		const deals = []
	const dealStages = [
		'lead',
		'qualified',
		'proposal',
		'negotiation',
		'closed_won',
		'closed_lost',
	]

		for (let i = 0; i < 8; i++) {
			const deal = await Deal.create({
				name: `Deal ${i + 1} - ${customerRecords[i % customerRecords.length].company}`,
				customer: customerRecords[i % customerRecords.length]._id,
				value: 5000 + Math.random() * 50000,
				stage: dealStages[Math.floor(Math.random() * dealStages.length)],
				probability: Math.floor(Math.random() * 100),
				expectedCloseDate: new Date(
					Date.now() + Math.random() * 90 * 24 * 60 * 60 * 1000,
				),
				assignedTo: [admin1._id, admin2._id][Math.floor(Math.random() * 2)],
				description: `Sales deal for ${customerRecords[i % customerRecords.length].company}`,
			})
			deals.push(deal)
		}

		// Create Activity Logs (20)
		console.log('[v0] Creating activity logs...')
		const actions = ['CREATE', 'UPDATE', 'DELETE', 'VIEW']
		const resourceTypes = ['customer', 'product', 'order', 'deal']

		for (let i = 0; i < 20; i++) {
			await ActivityLog.create({
				user: [admin1._id, admin2._id][Math.floor(Math.random() * 2)],
				action: actions[Math.floor(Math.random() * actions.length)],
				resourceType:
					resourceTypes[Math.floor(Math.random() * resourceTypes.length)],
				resourceId:
					customerRecords[Math.floor(Math.random() * customerRecords.length)]
						._id,
				details: `Activity log entry ${i + 1}`,
				ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
			})
		}

		console.log('[v0] Seed completed successfully!')
		console.log(
			`[v0] Created: 2 admins, 8 customers, 10 customer records, 15 products, 12 orders, 8 deals, 20 activity logs`,
		)

		process.exit(0)
	} catch (error) {
		console.error('[v0] Seed error:', error.message)
		process.exit(1)
	}
}

connectDB().then(() => seedData())
