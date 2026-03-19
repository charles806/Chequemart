import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('accessToken');
    const location = useLocation();
    
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // Optional: decode token to check expiration
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.exp && payload.exp * 1000 < Date.now()) {
            // Token expired
            localStorage.removeItem('accessToken');
            localStorage.removeItem('user');
            localStorage.removeItem('isLogin');
            return <Navigate to="/login" replace />;
        }
    } catch (e) {
        // Invalid token
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        localStorage.removeItem('isLogin');
        return <Navigate to="/login" replace />;
    }

    // Check user role and onboarding status for seller routes
    const userStr = localStorage.getItem('user');
    if (!userStr) {
        return <Navigate to="/login" replace />;
    }

    let user;
    try {
        user = JSON.parse(userStr);
    } catch (e) {
        localStorage.removeItem('user');
        return <Navigate to="/login" replace />;
    }

    if (user.role !== 'seller') {
        // Buyers should not access seller dashboard
        return <Navigate to="/" replace />;
    }
    // Seller but onboarding not complete
    if (!user.sellerInfo?.onboardingComplete) {
        // Allow access to onboarding page
        if (!location.pathname.includes('/seller/onboarding')) {
            return <Navigate to="/seller/onboarding" replace />;
        }
    } else {
        // Onboarding complete, but trying to access onboarding page -> redirect to dashboard
        if (location.pathname.includes('/seller/onboarding')) {
            return <Navigate to="/seller/dashboard" replace />;
        }
    }

    return children;
};

export default ProtectedRoute;