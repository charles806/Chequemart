import { Navigate, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';
import { MyContext } from '../MyContext';
import { useContext, useEffect, useState, useRef } from 'react';

const ProtectedRoute = ({ children }) => {
    const token = Cookies.get('accessToken');
    const location = useLocation();
    const context = useContext(MyContext);
    // Lazy initialization - function is only called once
    const currentDateRef = useRef(() => Date.now());
    const [authChecked, setAuthChecked] = useState(false);
    const [tokenExpired, setTokenExpired] = useState(false);
    
    // Update current date on each render (in useEffect to avoid purity rule)
    useEffect(() => {
        currentDateRef.current = Date.now();
    });
    
    // Wait for auth to be ready
    useEffect(() => {
        if (context.authReady) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setAuthChecked(true);
        }
    }, [context.authReady]);
    
    // Check token expiration when token changes
    useEffect(() => {
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                if (payload.exp && payload.exp * 1000 < currentDateRef.current) {
                    // eslint-disable-next-line react-hooks/set-state-in-effect
                    setTokenExpired(true);
                }
            } catch (e) {
                console.log(e);
                // eslint-disable-next-line react-hooks/set-state-in-effect
                setTokenExpired(true);
            }
        }
    }, [token]);

    if (!authChecked) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    // Check both cookie and context for auth state
    const isAuthenticated = token || context.isLogin || context.accessToken;
    
    if (!isAuthenticated || tokenExpired) {
        return <Navigate to="/login" replace />;
    }

    // Check user role and onboarding status for seller routes
    // Use context user if available, fallback to cookie
    const user = context.user || (() => {
        const userStr = Cookies.get('user');
        if (!userStr) return null;
        try {
            return JSON.parse(userStr);
        } catch (e) {
            console.log(e)
            Cookies.remove('user');
            return null;
        }
    })();
    
    if (!user) {
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