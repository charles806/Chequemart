import React, { useState, useContext, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MyContext } from '../../MyContext';
import { authFetch } from '../../api';
import { FaCloudUploadAlt, FaRegUser, FaHeart, FaShoppingBag, FaTrash, FaLock } from 'react-icons/fa';
import { CiLogout } from 'react-icons/ci';
import {
  Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions,
  Alert, CircularProgress, IconButton, InputAdornment,
} from "@mui/material";
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Account = () => {
  const context = useContext(MyContext);
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef(null);

  const [nav, setNav] = useState("profile");
  const [loading, setLoading] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [formData, setFormData] = useState({ firstName: "", lastName: "", email: "", phone: "" });
  const [sellerForm, setSellerForm] = useState({ storeName: "", businessCategory: "", businessAddress: "", bankCode: "", accountNumber: "" });
  const [sellerLoading, setSellerLoading] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [showPasswords, setShowPasswords] = useState({ current: false, new: false, confirm: false });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (context.isLogin === false) navigate("/login");
    else if (context.user) {
      const nameParts = context.user.name ? context.user.name.split(" ") : ["", ""];
      setFormData({
        firstName: nameParts[0] || "",
        lastName: nameParts.slice(1).join(" ") || "",
        email: context.user.email || "",
        phone: context.user.phone || ""
      });
    }
  }, [context.isLogin, context.user, navigate]);

  useEffect(() => {
    if (new URLSearchParams(location.search).get("openBecomeSeller") === "true") setNav("seller");
  }, [location.search]);

  const handleFormChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      const response = await authFetch(`${import.meta.env.VITE_API_URL}/api/users/profile`, {
        method: 'PUT',
        body: JSON.stringify({ name: `${formData.firstName} ${formData.lastName}`.trim(), phone: formData.phone })
      });
      const data = await response.json();
      if (data.success) {
        context.openAlertBox?.('success', 'Profile updated successfully!');
        if (context.user) { context.user.name = data.user.name; context.user.phone = data.user.phone; }
      } else {
        context.openAlertBox?.('error', data.message || 'Failed to update profile');
      }
    } catch {
      context.openAlertBox?.('error', 'Network error. Please try again.');
    } finally { setLoading(false); }
  };

  const handleAvatarClick = () => fileInputRef.current?.click();

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.type)) {
      context.openAlertBox?.('error', 'Invalid file type. Use JPEG, PNG, GIF, or WebP.'); return;
    }
    if (file.size > 2 * 1024 * 1024) {
      context.openAlertBox?.('error', 'File too large. Maximum 2MB allowed.'); return;
    }
    setUploadingAvatar(true);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append('avatar', file);
      const response = await authFetch(`${import.meta.env.VITE_API_URL}/api/users/avatar`, { method: 'POST', body: formDataUpload });
      const data = await response.json();
      if (data.success) {
        context.openAlertBox?.('success', 'Avatar updated successfully!');
        if (context.user) context.user.avatar = data.user.avatar;
      } else {
        context.openAlertBox?.('error', data.message || 'Failed to upload avatar');
      }
    } catch {
      context.openAlertBox?.('error', 'Network error. Please try again.');
    } finally { setUploadingAvatar(false); if (fileInputRef.current) fileInputRef.current.value = ''; }
  };

  const handleDeleteAvatar = async () => {
    if (!confirm('Are you sure you want to delete your profile picture?')) return;
    setLoading(true);
    try {
      const response = await authFetch(`${import.meta.env.VITE_API_URL}/api/users/avatar`, { method: 'DELETE' });
      const data = await response.json();
      if (data.success) {
        context.openAlertBox?.('success', 'Avatar deleted successfully!');
        if (context.user) context.user.avatar = null;
      } else {
        context.openAlertBox?.('error', data.message || 'Failed to delete avatar');
      }
    } catch { context.openAlertBox?.('error', 'Network error. Please try again.'); }
    finally { setLoading(false); }
  };

  const handleBecomeSeller = async (e) => {
    e.preventDefault();
    setSellerLoading(true);
    try {
      const response = await authFetch(`${import.meta.env.VITE_API_URL}/api/auth/become-seller`, {
        method: 'POST',
        body: JSON.stringify({ ...sellerForm, bankCode: sellerForm.bankCode || undefined, accountNumber: sellerForm.accountNumber || undefined })
      });
      const data = await response.json();
      if (data.success) {
        context.openAlertBox?.('success', 'Congratulations! You are now a seller. Redirecting...');
        if (context.login) context.login(data.user);
        setTimeout(() => navigate('/seller/onboarding'), 2000);
      } else {
        context.openAlertBox?.('error', data.message || 'Failed to become seller');
      }
    } catch { context.openAlertBox?.('error', 'Network error. Please try again.'); }
    finally { setSellerLoading(false); }
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) { context.openAlertBox?.('error', 'Passwords do not match'); return; }
    setPasswordLoading(true);
    try {
      const response = await authFetch(`${import.meta.env.VITE_API_URL}/api/users/password`, {
        method: 'PUT',
        body: JSON.stringify({ currentPassword: passwordData.currentPassword, newPassword: passwordData.newPassword })
      });
      const data = await response.json();
      if (data.success) {
        context.openAlertBox?.('success', 'Password changed successfully! Please log in again.');
        setPasswordDialogOpen(false);
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setTimeout(() => { context.logout(); navigate('/login'); }, 2000);
      } else {
        context.openAlertBox?.('error', data.message || 'Failed to change password');
      }
    } catch { context.openAlertBox?.('error', 'Network error. Please try again.'); }
    finally { setPasswordLoading(false); }
  };

  const getAvatarUrl = () => context.user?.avatar || 'https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png';

  const navItems = [
    { id: 'profile', icon: FaRegUser, label: 'User Profile' },
    { id: 'list', icon: FaHeart, label: 'My List' },
    { id: 'orders', icon: FaShoppingBag, label: 'Orders', action: () => navigate('/orders') },
    ...(context.user?.role === 'buyer' ? [{ id: 'seller', icon: FaShoppingBag, label: 'Become a Seller' }] : []),
  ];

  return (
    <section className="py-6 md:py-10 w-full">
      <div className="my-container flex flex-col md:flex-row gap-5 px-4 md:px-6">
        {/* Sidebar */}
        <div className="w-full md:w-[40%] lg:w-[25%]">
          <div className="bg-white border border-neutral-100 shadow-sm rounded-xl p-4 md:p-5">
            <div className="w-full p-3 flex items-center justify-center flex-col">
              <div className="w-24 h-24 md:w-27.5 md:h-27.5 rounded-full overflow-hidden mb-4 relative group cursor-pointer shadow-sm border border-neutral-100">
                {uploadingAvatar ? (
                  <div className="w-full h-full bg-neutral-50 flex items-center justify-center"><CircularProgress size={30} /></div>
                ) : (
                  <>
                    <img src={getAvatarUrl()} alt="avatar" className="w-full h-full rounded-full object-cover transition-transform duration-300 group-hover:scale-110" />
                    <div className="overlay w-full h-full absolute top-0 left-0 z-10 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer" onClick={handleAvatarClick}>
                      <FaCloudUploadAlt className="text-white text-2xl" />
                    </div>
                  </>
                )}
                <input type="file" ref={fileInputRef} accept="image/jpeg,image/png,image/gif,image/webp" className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer" onChange={handleAvatarChange} />
              </div>
              <h3 className="text-base md:text-lg font-semibold text-neutral-800">{formData.firstName} {formData.lastName}</h3>
              <p className="text-xs md:text-sm text-neutral-400">{formData.email}</p>
              {context.user?.avatar && (
                <Button size="small" startIcon={<FaTrash />} onClick={handleDeleteAvatar} className="mt-2! text-error-500! text-xs!" disabled={loading}>Remove Photo</Button>
              )}
            </div>

            <ul className="list-none mt-2 flex flex-col gap-1">
              {navItems.map((item) => (
                <li key={item.id} className="w-full">
                  <Button
                    className={`w-full! text-left! px-5! flex items-center gap-5 h-10! md:h-11! justify-start! rounded-lg! text-sm! capitalize! transition-all! ${
                      nav === item.id ? 'bg-primary-500! text-white!' : 'text-neutral-600! hover:bg-neutral-50!'
                    }`}
                    onClick={() => item.action ? item.action() : setNav(item.id)}
                  >
                    <item.icon className="text-lg shrink-0" /> {item.label}
                  </Button>
                </li>
              ))}
              <li className="w-full pt-2 mt-2 border-t border-neutral-100">
                <Button
                  className="w-full! text-left! px-5! flex items-center text-error-500! gap-5 h-10! md:h-11! justify-start! rounded-lg! text-sm! capitalize! hover:bg-error-50!"
                  onClick={() => { context.logout(); navigate("/"); }}
                >
                  <CiLogout className="text-lg shrink-0" /> Logout
                </Button>
              </li>
            </ul>
          </div>
        </div>

        {/* Main content */}
        <div className="w-full md:w-[60%] lg:w-[75%] bg-white border border-neutral-100 shadow-sm rounded-xl p-4 md:p-5">
          {nav === 'profile' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl md:text-2xl font-bold text-neutral-900">Personal Information</h2>
                <Button variant="outlined" startIcon={<FaLock />} onClick={() => setPasswordDialogOpen(true)} className="border-neutral-200! text-neutral-500! hover:border-primary-500! hover:text-primary-500! text-sm!">
                  Change Password
                </Button>
              </div>
              <form className="form w-full" onSubmit={handleSave}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <TextField label="First Name" name="firstName" value={formData.firstName} onChange={handleFormChange} variant="outlined" fullWidth size="small" sx={{ "& .MuiInputBase-root": { height: "45px" } }} />
                  <TextField label="Last Name" name="lastName" value={formData.lastName} onChange={handleFormChange} variant="outlined" fullWidth size="small" sx={{ "& .MuiInputBase-root": { height: "45px" } }} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <TextField label="Email" name="email" value={formData.email} onChange={handleFormChange} variant="outlined" fullWidth size="small" disabled helperText="Email cannot be changed" sx={{ "& .MuiInputBase-root": { height: "45px" } }} />
                  <TextField label="Phone" name="phone" value={formData.phone} onChange={handleFormChange} variant="outlined" fullWidth size="small" placeholder="Enter phone number" sx={{ "& .MuiInputBase-root": { height: "45px" } }} />
                </div>
                <div className="flex justify-end">
                  <Button type="submit" variant="contained" disabled={loading} className="btn-org! px-8! py-2.5!" startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}>
                    Save Changes
                  </Button>
                </div>
              </form>
            </div>
          )}

          {nav === 'list' && (
            <div className="text-center py-20">
              <div className="flex justify-center mb-4">
                <div className="w-20 h-20 bg-neutral-50 rounded-full flex items-center justify-center"><FaHeart className="text-4xl text-neutral-300" /></div>
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-neutral-800 mb-2">Your Wishlist is Empty</h2>
              <p className="text-neutral-400 max-w-xs mx-auto">Start adding items you love to your list so you can find them easily later.</p>
              <Button variant="contained" className="btn-org! mt-8 rounded-lg! px-6!" onClick={() => navigate('/products')}>Explore Products</Button>
            </div>
          )}

          {nav === 'seller' && (
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-neutral-900 mb-6">Become a Seller</h2>
              <p className="text-neutral-400 mb-8">Fill in your business details to start selling on Chequemart.</p>
              <form onSubmit={handleBecomeSeller}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <TextField label="Store/Business Name" name="storeName" value={sellerForm.storeName} onChange={(e) => setSellerForm({ ...sellerForm, storeName: e.target.value })} variant="outlined" fullWidth size="small" required />
                  <TextField name="businessCategory" value={sellerForm.businessCategory} onChange={(e) => setSellerForm({ ...sellerForm, businessCategory: e.target.value })} variant="outlined" fullWidth size="small" required select SelectProps={{ native: true }}>
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
                <div className="mb-6">
                  <TextField label="Business Address" name="businessAddress" value={sellerForm.businessAddress} onChange={(e) => setSellerForm({ ...sellerForm, businessAddress: e.target.value })} variant="outlined" fullWidth size="small" required />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <TextField label="Bank Code (optional)" name="bankCode" value={sellerForm.bankCode} onChange={(e) => setSellerForm({ ...sellerForm, bankCode: e.target.value })} variant="outlined" fullWidth size="small" helperText="e.g., 044 for Access Bank" />
                  <TextField label="Account Number (optional)" name="accountNumber" value={sellerForm.accountNumber} onChange={(e) => setSellerForm({ ...sellerForm, accountNumber: e.target.value })} variant="outlined" fullWidth size="small" helperText="10-digit account number" />
                </div>
                <div className="flex justify-end">
                  <Button type="submit" variant="contained" disabled={sellerLoading} className="btn-org! px-8! py-2.5!" startIcon={sellerLoading ? <CircularProgress size={20} color="inherit" /> : null}>
                    Become a Seller
                  </Button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Password dialog */}
      <Dialog open={passwordDialogOpen} onClose={() => setPasswordDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle className="flex items-center gap-2">
          <FaLock className="text-primary-500" /> Change Password
        </DialogTitle>
        <DialogContent>
          <div className="pt-2 flex flex-col gap-5">
            {[
              { key: 'current', label: 'Current Password' },
              { key: 'new', label: 'New Password', helper: 'At least 8 characters' },
              { key: 'confirm', label: 'Confirm New Password' },
            ].map(({ key, label, helper }) => (
              <TextField
                key={key}
                label={label}
                type={showPasswords[key] ? 'text' : 'password'}
                value={passwordData[key === 'current' ? 'currentPassword' : key === 'new' ? 'newPassword' : 'confirmPassword']}
                onChange={(e) => setPasswordData({ ...passwordData, [key === 'current' ? 'currentPassword' : key === 'new' ? 'newPassword' : 'confirmPassword']: e.target.value })}
                fullWidth size="small" helperText={helper}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPasswords({ ...showPasswords, [key]: !showPasswords[key] })} edge="end">
                        {showPasswords[key] ? <FaEyeSlash /> : <FaEye />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            ))}
          </div>
        </DialogContent>
        <DialogActions className="p-4">
          <Button onClick={() => setPasswordDialogOpen(false)} className="text-neutral-500!">Cancel</Button>
          <Button onClick={handlePasswordChange} variant="contained" disabled={passwordLoading || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword} className="btn-org!" startIcon={passwordLoading ? <CircularProgress size={20} color="inherit" /> : null}>
            Update Password
          </Button>
        </DialogActions>
      </Dialog>
    </section>
  );
};

export default Account;
