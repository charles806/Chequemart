import { Navigate, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';

const ProtectedRoute = ({ children }) => {
    const token = Cookies.get('accessToken');
    const location = useLocation();
    
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // Optional: decode token to check expiration
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.exp && payload.exp * 1000 < Date.now()) {
            // Token expired
            Cookies.remove('accessToken');
            Cookies.remove('user');
            Cookies.remove('isLogin');
            return <Navigate to="/login" replace />;
        }
    } catch (e) {
        // Invalid token
        Cookies.remove('accessToken');
        Cookies.remove('user');
        Cookies.remove('isLogin');
        return <Navigate to="/login" replace />;
    }

    // Check user role and onboarding status for seller routes
    const userStr = Cookies.get('user');
    if (!userStr) {
        return <Navigate to="/login" replace />;
    }

    let user;
    try {
        user = JSON.parse(userStr);
    } catch (e) {
        Cookies.remove('user');
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