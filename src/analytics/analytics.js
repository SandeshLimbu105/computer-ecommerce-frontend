// ============================================
// Google Analytics 4
// ============================================

export const trackPageView = (page, title) => {
    if (window.gtag) {
        window.gtag('event', 'page_view', {
            page_title: title || page,
            page_path: page,
        });
    }
};

export const trackProductView = (product) => {
    if (window.gtag) {
        window.gtag('event', 'view_item', {
            items: [{
                item_id: product.productId,
                item_name: product.name,
                price: product.price,
                item_category: product.category?.name,
                currency: 'NPR',
            }],
        });
    }
    if (window.fbq) {
        window.fbq('track', 'ViewContent', {
            content_ids: [product.productId],
            content_name: product.name,
            content_type: 'product',
            value: product.price,
            currency: 'NPR',
        });
    }
};

export const trackSearch = (searchTerm) => {
    if (window.gtag) {
        window.gtag('event', 'search', { search_term: searchTerm });
    }
};

export const trackAddToCart = (product, quantity) => {
    if (window.gtag) {
        window.gtag('event', 'add_to_cart', {
            items: [{
                item_id: product.productId,
                item_name: product.name,
                price: product.price,
                quantity: quantity,
                currency: 'NPR',
            }],
        });
    }
    if (window.fbq) {
        window.fbq('track', 'AddToCart', {
            content_ids: [product.productId],
            content_name: product.name,
            value: product.price * quantity,
            currency: 'NPR',
        });
    }
};

export const trackBeginCheckout = (cart) => {
    if (window.gtag) {
        window.gtag('event', 'begin_checkout', {
            items: cart.cartItems?.map(item => ({
                item_id: item.product.productId,
                item_name: item.product.name,
                price: item.product.price,
                quantity: item.quantity,
            })),
        });
    }
};

export const trackPurchase = (order) => {
    if (window.gtag) {
        window.gtag('event', 'purchase', {
            transaction_id: order.orderId,
            value: order.totalAmount,
            currency: 'NPR',
            items: order.orderItems?.map(item => ({
                item_id: item.product?.productId,
                item_name: item.product?.name,
                price: item.priceAtPurchase,
                quantity: item.quantity,
            })),
        });
    }
    if (window.fbq) {
        window.fbq('track', 'Purchase', {
            value: order.totalAmount,
            currency: 'NPR',
        });
    }
};

// ============================================
// Custom Backend Analytics
// ============================================

//  Use environment variable for backend API URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

export const trackBackendActivity = async (activityType, data = {}) => {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/admin/analytics/track`, {  // FIXED
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(token && { 'Authorization': `Bearer ${token}` }),
            },
            body: JSON.stringify({
                activityType,
                ...data,
                pageUrl: window.location.pathname,
            }),
        });
        return response.ok;
    } catch (error) {
        console.error('Backend analytics tracking failed:', error);
        return false;
    }
};