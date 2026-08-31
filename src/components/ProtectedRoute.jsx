import { Navigate, useLocation } from 'react-router-dom';
import { MyContext } from '../MyContext';
import { useContext, useEffect, useState } from 'react';

const ProtectedRoute = ({ children }) => {
    const location = useLocation();
    const context = useContext(MyContext);
    const [authChecked, setAuthChecked] = useState(false);

    // Wait for auth to be ready (the /me call has resolved)
    useEffect(() => {
        if (context.authReady) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setAuthChecked(true);
        }
    }, [context.authReady]);

    if (!authChecked) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    const isAuthenticated = context.isLogin && !!context.user;

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    const user = context.user;

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