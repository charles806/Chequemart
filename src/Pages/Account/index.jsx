import React, { useState, useContext, useEffect, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { MyContext } from '../../MyContext'
import { FaCloudUploadAlt, FaRegUser, FaHeart, FaShoppingBag, FaTrash, FaCheck, FaTimes, FaLock } from 'react-icons/fa'
// import { FaMdNotifications } from 'react-icons/fa'
import { CiLogout } from 'react-icons/ci'
import {
    Button,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Alert,
    CircularProgress,
    IconButton,
    InputAdornment,
} from "@mui/material";
import { FaEye, FaEyeSlash } from 'react-icons/fa'

const Account = () => {
    const context = useContext(MyContext);
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const [nav, setNav] = useState("profile");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [uploadingAvatar, setUploadingAvatar] = useState(false);

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: ""
    });

    const [sellerForm, setSellerForm] = useState({
        storeName: "",
        businessCategory: "",
        businessAddress: "",
        bankCode: "",
        accountNumber: ""
    });
    const [sellerLoading, setSellerLoading] = useState(false);

    // Password change state
    const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false
    });
    const [passwordLoading, setPasswordLoading] = useState(false);

    useEffect(() => {
        if (context.isLogin === false) {
            navigate("/login");
        } else if (context.user) {
            const nameParts = context.user.name ? context.user.name.split(" ") : ["", ""];
            setFormData({
                firstName: nameParts[0] || "",
                lastName: nameParts.slice(1).join(" ") || "",
                email: context.user.email || "",
                phone: context.user.phone || ""
            });
        }
    }, [context.isLogin, context.user, navigate]);

    const handleFormChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const token = context.accessToken || localStorage.getItem('accessToken');
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: `${formData.firstName} ${formData.lastName}`.trim(),
                    phone: formData.phone
                })
            });

            const data = await response.json();

            if (data.success) {
                setMessage({ type: 'success', text: 'Profile updated successfully!' });
                // Update context with new user data
                if (context.user) {
                    context.user.name = data.user.name;
                    context.user.phone = data.user.phone;
                }
            } else {
                setMessage({ type: 'error', text: data.message || 'Failed to update profile' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Network error. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleAvatarChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            setMessage({ type: 'error', text: 'Invalid file type. Use JPEG, PNG, GIF, or WebP.' });
            return;
        }

        // Validate file size (2MB)
        if (file.size > 2 * 1024 * 1024) {
            setMessage({ type: 'error', text: 'File too large. Maximum 2MB allowed.' });
            return;
        }

        setUploadingAvatar(true);
        setMessage({ type: '', text: '' });

        try {
            const token = context.accessToken || localStorage.getItem('accessToken');
            const formDataUpload = new FormData();
            formDataUpload.append('avatar', file);

            console.log("Uploading avatar, token:", token ? "present" : "missing");

            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/avatar`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                credentials: 'include',
                body: formDataUpload
            });

            console.log("Upload response status:", response.status);

            const data = await response.json();
            console.log("Upload response data:", data);

            if (data.success) {
                setMessage({ type: 'success', text: 'Avatar updated successfully!' });
                if (context.user) {
                    context.user.avatar = data.user.avatar;
                }
            } else {
                setMessage({ type: 'error', text: data.message || 'Failed to upload avatar' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Network error. Please try again.' });
        } finally {
            setUploadingAvatar(false);
            // Reset file input
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleDeleteAvatar = async () => {
        if (!confirm('Are you sure you want to delete your profile picture?')) return;

        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const token = context.accessToken || localStorage.getItem('accessToken');
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/avatar`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (data.success) {
                setMessage({ type: 'success', text: 'Avatar deleted successfully!' });
                if (context.user) {
                    context.user.avatar = null;
                }
            } else {
                setMessage({ type: 'error', text: data.message || 'Failed to delete avatar' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Network error. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    const handleBecomeSeller = async (e) => {
        e.preventDefault();
        setSellerLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const token = context.accessToken || localStorage.getItem('accessToken');
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/become-seller`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    storeName: sellerForm.storeName,
                    businessCategory: sellerForm.businessCategory,
                    businessAddress: sellerForm.businessAddress,
                    bankCode: sellerForm.bankCode || undefined,
                    accountNumber: sellerForm.accountNumber || undefined
                })
            });

            const data = await response.json();

            if (data.success) {
                setMessage({ type: 'success', text: 'Congratulations! You are now a seller. Redirecting to onboarding...' });
                // Update user in context
                if (context.login) {
                    context.login(data.user, data.accessToken);
                }
                // Redirect to seller onboarding after short delay
                setTimeout(() => {
                    navigate('/seller/onboarding');
                }, 2000);
            } else {
                setMessage({ type: 'error', text: data.message || 'Failed to become seller' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Network error. Please try again.' });
        } finally {
            setSellerLoading(false);
        }
    };

    const handlePasswordChange = async () => {
        // Validation
        if (passwordData.newPassword.length < 8) {
            setMessage({ type: 'error', text: 'Password must be at least 8 characters' });
            return;
        }

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setMessage({ type: 'error', text: 'Passwords do not match' });
            return;
        }

        setPasswordLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const token = context.accessToken || localStorage.getItem('accessToken');
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/password`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    currentPassword: passwordData.currentPassword,
                    newPassword: passwordData.newPassword
                })
            });

            const data = await response.json();

            if (data.success) {
                setMessage({ type: 'success', text: 'Password changed successfully! Please log in again.' });
                setPasswordDialogOpen(false);
                setPasswordData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                });
                // Logout user after password change
                setTimeout(() => {
                    context.logout();
                    navigate('/login');
                }, 2000);
            } else {
                setMessage({ type: 'error', text: data.message || 'Failed to change password' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Network error. Please try again.' });
        } finally {
            setPasswordLoading(false);
        }
    };

    const handleLogout = () => {
        context.logout();
        navigate("/");
    };

    const getAvatarUrl = () => {
        if (context.user?.avatar) {
            return context.user.avatar;
        }
        return 'https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png';
    };

    return (
        <section className='py-6 md:py-10 w-full'>
            <div className="my-container flex flex-col md:flex-row gap-5 px-4 md:px-6">
                <div className="col1 w-full md:w-[40%] lg:w-[25%]">
                    <div className="card bg-white shadow-md rounded-md p-4 md:p-5">
                        <div className="w-full p-3 flex items-center justify-center flex-col">
                            <div className="w-24 h-24 md:w-27.5 md:h-27.5 rounded-full overflow-hidden mb-4 relative group cursor-pointer shadow-sm border border-gray-100">
                                {uploadingAvatar ? (
                                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                        <CircularProgress size={30} />
                                    </div>
                                ) : (
                                    <>
                                        <img
                                            src={getAvatarUrl()}
                                            alt="avatar"
                                            className='w-full h-full rounded-full object-cover transition-transform duration-300 group-hover:scale-110'
                                        />
                                        <div
                                            className="overlay w-full h-full absolute top-0 left-0 z-10 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                                            onClick={handleAvatarClick}
                                        >
                                            <FaCloudUploadAlt className='text-white text-2xl' />
                                        </div>
                                    </>
                                )}
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    accept='image/jpeg,image/png,image/gif,image/webp'
                                    className='absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer'
                                    onChange={handleAvatarChange}
                                />
                            </div>
                            <h3 className='text-base md:text-lg font-semibold text-gray-800'>
                                {formData.firstName} {formData.lastName}
                            </h3>
                            <p className='text-xs md:text-sm text-gray-500'>{formData.email}</p>

                            {/* Delete Avatar Button */}
                            {context.user?.avatar && (
                                <Button
                                    size="small"
                                    startIcon={<FaTrash />}
                                    onClick={handleDeleteAvatar}
                                    className="mt-2! text-red-500! text-xs!"
                                    disabled={loading}
                                >
                                    Remove Photo
                                </Button>
                            )}
                        </div>

                        <ul className="list-none mt-2 flex flex-col gap-1">
                            <li className='w-full'>
                                <Button
                                    className={`w-full! text-left! px-5! flex items-center gap-5 h-10! md:h-11! justify-start! rounded-md! text-sm! capitalize! transition-all! ${nav === 'profile' ? 'bg-[#ff525]! text-black!' : 'text-gray-700! hover:bg-gray-100!'}`}
                                    onClick={() => setNav('profile')}
                                >
                                    <FaRegUser className='text-lg shrink-0' />
                                    User Profile
                                </Button>
                            </li>
                            <li className='w-full'>
                                <Button
                                    className={`w-full! text-left! px-5! flex items-center gap-5 h-10! md:h-11! justify-start! rounded-md! text-sm! capitalize! transition-all! ${nav === 'list' ? 'bg-[#ff525]! text-black!' : 'text-gray-700! hover:bg-gray-100!'}`}
                                    onClick={() => setNav('list')}
                                >
                                    <FaHeart className='text-lg shrink-0' />
                                    My List
                                </Button>
                            </li>
                            <li className='w-full'>
                                <Button
                                    className={`w-full! text-left! px-5! flex items-center gap-5 h-10! md:h-11! justify-start! rounded-md! text-sm! capitalize! transition-all! ${nav === 'orders' ? 'bg-[#ff525]! text-black!' : 'text-gray-700! hover:bg-gray-100!'}`}
                                    onClick={() => navigate('/orders')}
                                >
                                    <FaShoppingBag className='text-lg shrink-0' />
                                    Orders
                                </Button>
                            </li>
                            {context.user?.role === 'buyer' && (
                                <li className='w-full'>
                                    <Button
                                        className={`w-full! text-left! px-5! text-white! flex items-center gap-5 h-10! md:h-11! justify-start! rounded-md! text-sm! capitalize! transition-all! ${nav === 'seller' ? 'bg-[#ff525]! text-black!' : 'text-gray-700! hover:bg-gray-100!'}`}
                                        onClick={() => setNav('seller')}
                                    >
                                        <FaShoppingBag className='text-lg shrink-0' />
                                        Become a Seller 
                                    </Button>
                                </li>
                            )}
                            <li className='w-full pt-2 mt-2 border-t border-gray-100'>
                                <Button
                                    className='w-full! text-left! px-5! flex items-center text-red-600! gap-5 h-10! md:h-11! justify-start! rounded-md! text-sm! capitalize! hover:bg-red-50!'
                                    onClick={handleLogout}
                                >
                                    <CiLogout className='text-lg shrink-0' />
                                    Logout
                                </Button>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="col2 w-full md:w-[60%] lg:w-[75%] bg-white shadow-md rounded-md p-4 md:p-5">
                    {message.text && (
                        <Alert
                            severity={message.type}
                            className="mb-4"
                            onClose={() => setMessage({ type: '', text: '' })}
                        >
                            {message.text}
                        </Alert>
                    )}

                    {nav === 'profile' && (
                        <div className="animate-in fade-in duration-500">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className='text-xl md:text-2xl font-bold text-gray-800'>Personal Information</h2>
                                <Button
                                    variant="outlined"
                                    startIcon={<FaLock />}
                                    onClick={() => setPasswordDialogOpen(true)}
                                    className="border-gray-300! text-gray-600! hover:border-[#ff5252] hover:text-[#ff5252]! text-sm!"
                                >
                                    Change Password
                                </Button>
                            </div>

                            <form className="form w-full" onSubmit={handleSave}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div className="col">
                                        <TextField
                                            label="First Name"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleFormChange}
                                            variant="outlined"
                                            fullWidth
                                            size="small"
                                            sx={{ "& .MuiInputBase-root": { height: "45px" } }}
                                        />
                                    </div>
                                    <div className="col">
                                        <TextField
                                            label="Last Name"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleFormChange}
                                            variant="outlined"
                                            fullWidth
                                            size="small"
                                            sx={{ "& .MuiInputBase-root": { height: "45px" } }}
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                    <div className="col">
                                        <TextField
                                            label="Email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleFormChange}
                                            variant="outlined"
                                            fullWidth
                                            size="small"
                                            disabled
                                            helperText="Email cannot be changed"
                                            sx={{ "& .MuiInputBase-root": { height: "45px" } }}
                                        />
                                    </div>
                                    <div className="col">
                                        <TextField
                                            label="Phone"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleFormChange}
                                            variant="outlined"
                                            fullWidth
                                            size="small"
                                            placeholder="Enter phone number"
                                            sx={{ "& .MuiInputBase-root": { height: "45px" } }}
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-end">
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        disabled={loading}
                                        className="bg-[#ff5252]! text-white! hover:bg-[#ff5252]! ! px-8! py-2.5! rounded-md! font-semibold! transition-all!"
                                        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
                                    >
                                        Save Changes
                                    </Button>
                                </div>
                            </form>
                        </div>
                    )}

                    {nav === 'list' && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 text-center py-20">
                            <div className="flex justify-center mb-4">
                                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center">
                                    <FaHeart className="text-4xl text-gray-300" />
                                </div>
                            </div>
                            <h2 className='text-xl md:text-2xl font-bold text-gray-800 mb-2'>Your Wishlist is Empty</h2>
                            <p className="text-gray-500 max-w-xs mx-auto">Start adding items you love to your list so you can find them easily later.</p>
                            <Button variant="outlined" className="mt-8 border-[#ff5252]! bg-[#ff5252]! text-white!  rounded-md! px-6!" onClick={() => navigate('/products')}>
                                Explore Products
                            </Button>
                        </div>
                    )}

                    {nav === 'seller' && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <h2 className='text-xl md:text-2xl font-bold text-gray-800 mb-6'>Become a Seller</h2>
                            <p className="text-gray-500 mb-8">Fill in your business details to start selling on Chequemart.</p>
                            <form onSubmit={handleBecomeSeller}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div className="col">
                                        <TextField
                                            label="Store/Business Name"
                                            name="storeName"
                                            value={sellerForm.storeName}
                                            onChange={(e) => setSellerForm({ ...sellerForm, storeName: e.target.value })}
                                            variant="outlined"
                                            fullWidth
                                            size="small"
                                            required
                                        />
                                    </div>
                                    <div className="col">
                                        <TextField
                                            // label="Business Category"
                                            name="businessCategory"
                                            value={sellerForm.businessCategory}
                                            onChange={(e) => setSellerForm({ ...sellerForm, businessCategory: e.target.value })}
                                            variant="outlined"
                                            fullWidth
                                            size="small"
                                            required
                                            select
                                            SelectProps={{ native: true }}
                                        >
                                            <option value="">Select Category</option>
                                            <option value="Electronics">Electronics</option>
                                            <option value="Fashion">Fashion</option>
                                            <option value="Bags & Accessories">Bags & Accessories</option>
                                            <option value="Sports & Fitness">Sports & Fitness</option>
                                            <option value="Home & Living">Home & Living</option>
                                            <option value="Health & Beauty">Health & Beauty</option>
                                            <option value="Books & Stationery">Books & Stationery</option>
                                            <option value="Food & Grocery">Food & Grocery</option>
                                        </TextField>
                                    </div>
                                </div>
                                <div className="mb-6">
                                    <TextField
                                        label="Business Address"
                                        name="businessAddress"
                                        value={sellerForm.businessAddress}
                                        onChange={(e) => setSellerForm({ ...sellerForm, businessAddress: e.target.value })}
                                        variant="outlined"
                                        fullWidth
                                        size="small"
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                    <div className="col">
                                        <TextField
                                            label="Bank Code (optional)"
                                            name="bankCode"
                                            value={sellerForm.bankCode}
                                            onChange={(e) => setSellerForm({ ...sellerForm, bankCode: e.target.value })}
                                            variant="outlined"
                                            fullWidth
                                            size="small"
                                            helperText="e.g., 044 for Access Bank"
                                        />
                                    </div>
                                    <div className="col">
                                        <TextField
                                            label="Account Number (optional)"
                                            name="accountNumber"
                                            value={sellerForm.accountNumber}
                                            onChange={(e) => setSellerForm({ ...sellerForm, accountNumber: e.target.value })}
                                            variant="outlined"
                                            fullWidth
                                            size="small"
                                            helperText="10-digit account number"
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-end">
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        disabled={sellerLoading}
                                        className="bg-[#ff5252]! hover:bg-[#ff5252]! ! px-8! py-2.5! rounded-md! font-semibold! transition-all!"
                                        startIcon={sellerLoading ? <CircularProgress size={20} color="inherit" /> : null}
                                    >
                                        Become a Seller
                                    </Button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </div>

            {/* Password Change Dialog */}
            <Dialog
                open={passwordDialogOpen}
                onClose={() => setPasswordDialogOpen(false)}
                maxWidth="xs"
                fullWidth
            >
                <DialogTitle className="flex items-center gap-2">
                    <FaLock className="text-[#ff5252]" />
                    Change Password
                </DialogTitle>
                <DialogContent>
                    <div className="pt-2 flex flex-col gap-5 space-y-4">
                        <TextField
                            label="Current Password"
                            type={showPasswords.current ? 'text' : 'password'}
                            value={passwordData.currentPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                            fullWidth
                            size="small"
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                                            edge="end"
                                        >
                                            {showPasswords.current ? <FaEyeSlash /> : <FaEye />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <TextField
                            label="New Password"
                            type={showPasswords.new ? 'text' : 'password'}
                            value={passwordData.newPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                            fullWidth
                            size="small"
                            helperText="At least 8 characters"
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                                            edge="end"
                                        >
                                            {showPasswords.new ? <FaEyeSlash /> : <FaEye />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <TextField
                            label="Confirm New Password"
                            type={showPasswords.confirm ? 'text' : 'password'}
                            value={passwordData.confirmPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                            fullWidth
                            size="small"
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                                            edge="end"
                                        >
                                            {showPasswords.confirm ? <FaEyeSlash /> : <FaEye />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </div>
                </DialogContent>
                <DialogActions className="p-4">
                    <Button onClick={() => setPasswordDialogOpen(false)} className="text-gray-600!">
                        Cancel
                    </Button>
                    <Button
                        onClick={handlePasswordChange}
                        variant="contained"
                        disabled={passwordLoading || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                        className="bg-[#ff5252]! hover:bg-[#ff5252]! text-white! cursor-pointer!"
                        startIcon={passwordLoading ? <CircularProgress size={20} color="inherit" /> : null}
                    >
                        Update Password
                    </Button>
                </DialogActions>
            </Dialog>
        </section>
    )
}

export default Account
