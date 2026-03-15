import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaCloudUploadAlt } from 'react-icons/fa'
import { FaRegUser } from 'react-icons/fa'
import { FaHeart } from 'react-icons/fa'
import { MdShoppingBag } from 'react-icons/md'
import { CiLogout } from 'react-icons/ci'
import {
    Button,
    TextField,
} from "@mui/material";

const Account = () => {
    const [nav, setNav] = useState("profile");
    const [formData, setFormData] = useState({
        firstName: "John",
        lastName: "Doe",
        email: "johndoe@example.com",
        phone: "+1234567890"
    });

    const handleFormChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = (e) => {
        e.preventDefault();
        console.log("Saving data:", formData);
        alert("Profile updated successfully!");
    };

    const navigate = useNavigate();

    return (
        <section className='py-6 md:py-10 w-full'>
            <div className="my-container flex flex-col md:flex-row gap-5 px-4 md:px-6">
                <div className="col1 w-full md:w-[40%] lg:w-[25%]">
                    <div className="card bg-white shadow-md rounded-md p-4 md:p-5">
                        <div className="w-full p-3 flex items-center justify-center flex-col">
                            <div className="w-24 h-24 md:w-[110px] md:h-[110px] rounded-full overflow-hidden mb-4 relative group cursor-pointer shadow-sm border border-gray-100">
                                <img
                                    src='https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png'
                                    alt="avatar"
                                    className='w-full h-full rounded-full object-cover transition-transform duration-300 group-hover:scale-110'
                                />
                                <div className="overlay w-full h-full absolute top-0 left-0 z-10 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <FaCloudUploadAlt className='text-white text-2xl' />
                                    <input type="file" accept='image/*' className='absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer' />
                                </div>
                            </div>
                            <h3 className='text-base md:text-lg font-semibold text-gray-800'>{formData.firstName} {formData.lastName}</h3>
                            <p className='text-xs md:text-sm text-gray-500'>{formData.email}</p>
                        </div>

                        <ul className="list-none mt-2 flex flex-col gap-1">
                            <li className='w-full'>
                                <Button
                                    className={`w-full! !text-left px-5! flex items-center gap-5 h-10! md:h-11! !justify-start rounded-md! text-sm! capitalize! transition-all! ${nav === 'profile' ? 'bg-primary! text-black!' : 'text-gray-700! hover:bg-gray-100!'}`}
                                    onClick={() => setNav('profile')}
                                >
                                    <FaRegUser className='text-lg shrink-0' />
                                    User Profile
                                </Button>
                            </li>
                            <li className='w-full'>
                                <Button
                                    className={`w-full! !text-left px-5! flex items-center gap-5 h-10! md:h-11! !justify-start rounded-md! text-sm! capitalize! transition-all! ${nav === 'list' ? 'bg-primary! text-black!' : 'text-gray-700! hover:bg-gray-100!'}`}
                                    onClick={() => setNav('list')}
                                >
                                    <FaHeart className='text-lg shrink-0' />
                                    My List
                                </Button>
                            </li>
                            <li className='w-full'>
                                <Button
                                    className={`w-full! !text-left px-5! flex items-center gap-5 h-10! md:h-11! !justify-start rounded-md! text-sm! capitalize! transition-all! ${nav === 'orders' ? 'bg-primary! text-black!' : 'text-gray-700! hover:bg-gray-100!'}`}
                                    onClick={() => setNav('orders')}
                                >
                                    <MdShoppingBag className='text-lg shrink-0' />
                                    Orders
                                </Button>
                            </li>
                            <li className='w-full pt-2 mt-2 border-t border-gray-100'>
                                <Button
                                    className='w-full! !text-left px-5! flex items-center text-red-600! gap-5 h-10! md:h-11! !justify-start rounded-md! text-sm! capitalize! hover:bg-red-50!'
                                    onClick={() => alert("Logging out...")}
                                >
                                    <CiLogout className='text-lg shrink-0' />
                                    Logout
                                </Button>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="col2 w-full md:w-[60%] lg:w-[75%] bg-white shadow-md rounded-md p-4 md:p-5">

                    {nav === 'profile' && (
                        <div className="animate-in fade-in duration-500">
                            <h2 className='text-xl md:text-2xl font-bold text-gray-800 mb-6'>Personal Information</h2>

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
                                            sx={{ "& .MuiInputBase-root": { height: "45px" } }}
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-end">
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        className="bg-[#ff5252]! hover:bg-[#ff5252]! text-white! px-8! py-2.5! rounded-md! font-semibold! transition-all!"
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

                    {nav === 'orders' && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 text-center py-20">
                            <div className="flex justify-center mb-4">
                                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center">
                                    <MdShoppingBag className="text-4xl text-gray-300" />
                                </div>
                            </div>
                            <h2 className='text-xl md:text-2xl font-bold text-gray-800 mb-2'>No Orders Yet</h2>
                            <p className="text-gray-500 max-w-xs mx-auto">It looks like you haven't placed any orders yet. When you do, they'll appear here.</p>
                            <Button variant="contained" className="mt-8 bg-[#ff5252]! hover:bg-[#ff5252]! text-white! rounded-md! px-8!" onClick={() => navigate('/products')}>
                                Start Shopping
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}

export default Account