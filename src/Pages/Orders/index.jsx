import React, { useState } from 'react'
import { Link } from 'react-router-dom'
//MUI
import Button from '@mui/material/Button';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
//Icons
import { FaBoxOpen } from "react-icons/fa";
import { FaShippingFast } from "react-icons/fa";
import { FaCheckCircle } from "react-icons/fa";
import { FaTimesCircle } from "react-icons/fa";
import { FaRegArrowAltCircleLeft } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import { FaRedo } from "react-icons/fa";
import { FaChevronDown } from "react-icons/fa";
import { FaCalendarAlt } from "react-icons/fa";
import { FaMapMarkerAlt } from "react-icons/fa";
import { FaWallet } from "react-icons/fa";
import { FaGift } from "react-icons/fa";
import { FiShoppingBag } from "react-icons/fi";

const mockOrders = [
    {
        id: "ORD-2024-78234",
        date: "2024-01-15",
        status: "delivered",
        items: [
            { name: "Premium Wireless Headphones", price: 45000, qty: 1, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100" },
            { name: "Phone Case Premium", price: 3500, qty: 2, image: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=100" }
        ],
        total: 52000,
        shipping: 1500,
        payment: "Paid",
        address: "123 Main Street, Lagos, Nigeria"
    },
    {
        id: "ORD-2024-78156",
        date: "2024-01-10",
        status: "shipped",
        items: [
            { name: "Smart Watch Series 8", price: 120000, qty: 1, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100" }
        ],
        total: 120000,
        shipping: 2000,
        payment: "Paid",
        address: "123 Main Street, Lagos, Nigeria"
    },
    {
        id: "ORD-2024-78089",
        date: "2024-01-05",
        status: "processing",
        items: [
            { name: "Leather Crossbody Bag", price: 28000, qty: 1, image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=100" },
            { name: "Leather Belt", price: 5500, qty: 1, image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=100" }
        ],
        total: 33500,
        shipping: 1000,
        payment: "Pending",
        address: "456 Oak Avenue, Abuja, Nigeria"
    },
    {
        id: "ORD-2023-76543",
        date: "2023-12-20",
        status: "cancelled",
        items: [
            { name: "Running Shoes Pro", price: 35000, qty: 1, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100" }
        ],
        total: 35000,
        shipping: 1500,
        payment: "Refunded",
        address: "123 Main Street, Lagos, Nigeria"
    }
]

const statusConfig = {
    processing: { label: "Processing", color: "#f59e0b", bg: "#fef3c7", icon: <FaBoxOpen /> },
    shipped: { label: "Shipped", color: "#3b82f6", bg: "#dbeafe", icon: <FaShippingFast /> },
    delivered: { label: "Delivered", color: "#10b981", bg: "#d1fae5", icon: <FaCheckCircle /> },
    cancelled: { label: "Cancelled", color: "#ef4444", bg: "#fee2e2", icon: <FaTimesCircle /> }
}

const Orders = () => {
    const [activeTab, setActiveTab] = useState(0)
    const [expandedOrder, setExpandedOrder] = useState(null)

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    const getFilteredOrders = () => {
        const filters = ['all', 'processing', 'shipped', 'delivered', 'cancelled']
        const filter = filters[activeTab]
        if (filter === 'all') return mockOrders
        return mockOrders.filter(order => order.status === filter)
    }

    const filteredOrders = getFilteredOrders()

    const formatDate = (dateStr) => {
        const date = new Date(dateStr)
        return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
    }

    const handleViewDetails = (orderId) => {
        console.log("View details:", orderId)
    }

    const handleReorder = (orderId) => {
        console.log("Reorder:", orderId)
    }

    return (
        <section className='section py-8 pb-12 bg-gray-50 min-h-screen'>
            <div className="my-container">
                {/* Header Section */}
                <div className="mb-8">
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                        <Link to="/" className="hover:text-[#ff5252] transition-colors">Home</Link>
                        <FaRegArrowAltCircleLeft className="rotate-180 text-xs" />
                        <span className="text-gray-800">My Orders</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className='text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-3'>
                                <FaBoxOpen className="text-[#ff5252]" />
                                My Orders
                            </h1>
                            <p className="mt-1 text-gray-500">
                                {mockOrders.length} orders placed
                            </p>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <Box className="mb-6 bg-white rounded-xl shadow-sm p-2">
                    <Tabs
                        value={activeTab}
                        onChange={handleTabChange}
                        variant="scrollable"
                        scrollButtons="auto"
                        className="order-tabs"
                        TabIndicatorProps={{
                            style: { backgroundColor: '#ff5252' }
                        }}
                    >
                        <Tab label="All Orders" className={activeTab === 0 ? "text-[#ff5252]!" : "text-gray-600!"} />
                        <Tab label={
                            <span className="flex items-center gap-2">
                                Processing
                                <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full text-xs">
                                    {mockOrders.filter(o => o.status === 'processing').length}
                                </span>
                            </span>
                        } className={activeTab === 1 ? "text-[#ff5252]!" : "text-gray-600!"} />
                        <Tab label={
                            <span className="flex items-center gap-2">
                                Shipped
                                <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs">
                                    {mockOrders.filter(o => o.status === 'shipped').length}
                                </span>
                            </span>
                        } className={activeTab === 2 ? "text-[#ff5252]!" : "text-gray-600!"} />
                        <Tab label={
                            <span className="flex items-center gap-2">
                                Delivered
                                <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs">
                                    {mockOrders.filter(o => o.status === 'delivered').length}
                                </span>
                            </span>
                        } className={activeTab === 3 ? "text-[#ff5252]!" : "text-gray-600!"} />
                        <Tab label="Cancelled" className={activeTab === 4 ? "text-[#ff5252]!" : "text-gray-600!"} />
                    </Tabs>
                </Box>

                {/* Orders List */}
                {filteredOrders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl shadow-sm">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                            <FiShoppingBag className="text-4xl text-gray-400" />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">
                            No orders found
                        </h2>
                        <p className="text-gray-500 text-center max-w-md mb-6">
                            {activeTab === 0
                                ? "You haven't placed any orders yet. Start shopping to see your orders here."
                                : `You don't have any ${statusConfig[Object.keys(statusConfig)[activeTab - 1]]?.label || ''} orders.`
                            }
                        </p>
                        <Button
                            variant="contained"
                            className="bg-gradient-to-r from-[#ff5252] to-[#ff7b7b] hover:from-[#e04848] hover:to-[#ff5252] text-white px-8 py-2.5 rounded-lg"
                        >
                            <Link to="/products" className="text-white">
                                Start Shopping
                            </Link>
                        </Button>
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        {filteredOrders.map((order) => (
                            <div key={order.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
                                {/* Order Header */}
                                <div className="p-5 border-b border-gray-100 flex flex-wrap items-center justify-between gap-4 bg-gradient-to-r from-gray-50 to-white">
                                    <div className="flex flex-wrap items-center gap-4">
                                        <div>
                                            <p className="text-xs text-gray-500 mb-1">Order ID</p>
                                            <p className="font-semibold text-gray-800">{order.id}</p>
                                        </div>
                                        <div className="h-8 w-px bg-gray-300 hidden sm:block"></div>
                                        <div>
                                            <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                                                <FaCalendarAlt className="text-xs" />
                                                Date Placed
                                            </p>
                                            <p className="font-medium text-gray-800">{formatDate(order.date)}</p>
                                        </div>
                                        <div className="h-8 w-px bg-gray-300 hidden sm:block"></div>
                                        <div>
                                            <p className="text-xs text-gray-500 mb-1">Total</p>
                                            <p className="font-semibold text-gray-800">₦{(order.total + order.shipping).toLocaleString()}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Chip
                                            icon={<span className="ml-2">{statusConfig[order.status].icon}</span>}
                                            label={statusConfig[order.status].label}
                                            style={{
                                                backgroundColor: statusConfig[order.status].bg,
                                                color: statusConfig[order.status].color,
                                                fontWeight: 600
                                            }}
                                            className="!rounded-full"
                                        />
                                    </div>
                                </div>

                                {/* Order Items Preview */}
                                <div className="p-5">
                                    <div className="flex flex-wrap items-center gap-4 mb-4">
                                        {order.items.slice(0, 3).map((item, idx) => (
                                            <div key={idx} className="flex items-center gap-3">
                                                <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                </div>
                                                <div className="hidden sm:block">
                                                    <p className="text-sm font-medium text-gray-800 line-clamp-1 max-w-[200px]">{item.name}</p>
                                                    <p className="text-xs text-gray-500">Qty: {item.qty}</p>
                                                </div>
                                            </div>
                                        ))}
                                        {order.items.length > 3 && (
                                            <div className="w-16 h-16 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center">
                                                <span className="text-sm font-medium text-gray-500">+{order.items.length - 3}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Order Actions */}
                                    <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-100">
                                        {/* <Button
                                            variant="outlined"
                                            size="small"
                                            startIcon={<FaEye />}
                                            onClick={() => handleViewDetails(order.id)}
                                            className="border-gray-300! text-gray-600! hover:border-[#ff5252]! hover:text-[#ff5252]!"
                                        >
                                            View Details
                                        </Button> */}
                                        {order.status !== 'cancelled' && (
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                startIcon={<FaRedo />}
                                                onClick={() => handleReorder(order.id)}
                                                className="border-gray-300! text-gray-600! hover:border-[#ff5252] hover:text-[#ff5252]!"
                                            >
                                                Buy Again
                                            </Button>
                                        )}
                                    </div>
                                </div>

                                {/* Expandable Details */}
                                <Accordion
                                    expanded={expandedOrder === order.id}
                                    onChange={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                                    className="!shadow-none !bg-gray-50"
                                >
                                    <AccordionSummary
                                        expandIcon={<FaChevronDown className={`transition-transform ${expandedOrder === order.id ? 'rotate-180' : ''}`} />}
                                        className="!min-h-0 !py-2 !px-5 hover:!bg-gray-100"
                                    >
                                        <span className="text-sm font-medium text-gray-600">View Order Details</span>
                                    </AccordionSummary>
                                    <AccordionDetails className="!pt-0 !px-5 !pb-5">
                                        <div className="bg-white rounded-lg p-4 border border-gray-200">
                                            {/* Items */}
                                            <div className="mb-4">
                                                <h4 className="text-sm font-semibold text-gray-800 mb-3">Items Ordered</h4>
                                                <div className="flex flex-col gap-3">
                                                    {order.items.map((item, idx) => (
                                                        <div key={idx} className="flex items-center gap-4">
                                                            <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 shrink-0">
                                                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                            </div>
                                                            <div className="flex-1">
                                                                <p className="text-sm font-medium text-gray-800">{item.name}</p>
                                                                <p className="text-xs text-gray-500">Qty: {item.qty}</p>
                                                            </div>
                                                            <p className="text-sm font-semibold text-gray-800">₦{item.price.toLocaleString()}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Order Info Grid */}
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-100">
                                                <div className="flex items-start gap-3">
                                                    <FaMapMarkerAlt className="text-[#ff5252] mt-0.5" />
                                                    <div>
                                                        <p className="text-xs text-gray-500 mb-1">Shipping Address</p>
                                                        <p className="text-sm font-medium text-gray-800">{order.address}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-start gap-3">
                                                    <FaWallet className="text-[#ff5252] mt-0.5" />
                                                    <div>
                                                        <p className="text-xs text-gray-500 mb-1">Payment</p>
                                                        <p className="text-sm font-medium text-gray-800">{order.payment}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-start gap-3">
                                                    <FaGift className="text-[#ff5252] mt-0.5" />
                                                    <div>
                                                        <p className="text-xs text-gray-500 mb-1">Order Summary</p>
                                                        <p className="text-sm font-medium text-gray-800">
                                                            Subtotal: ₦{order.total.toLocaleString()}<br/>
                                                            Shipping: ₦{order.shipping.toLocaleString()}<br/>
                                                            <span className="text-[#ff5252]">Total: ₦{(order.total + order.shipping).toLocaleString()}</span>
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </AccordionDetails>
                                </Accordion>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    )
}

export default Orders
