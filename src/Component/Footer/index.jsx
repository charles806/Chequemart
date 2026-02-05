import React from 'react'
import { Link } from "react-router-dom";
//UIs
import Button from "@mui/material/Button";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
//Icons
import { FaShippingFast } from "react-icons/fa";
import { PiKeyReturn } from "react-icons/pi";
import { BsWallet2 } from "react-icons/bs";
import { CiGift } from "react-icons/ci";
import { BiSupport } from "react-icons/bi";
import { IoChatboxOutline } from "react-icons/io5";
import { FaXTwitter } from "react-icons/fa6";
import { FaFacebookF } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaTiktok } from "react-icons/fa";
// //Images
import masterCard from "../../assets/image/master_card.png";
import visa from "../../assets/image/visa.png";
import americanExpress from "../../assets/image/american_express.png";


const Footer = () => {
    return (
        <>
            <footer className='py-6 bg-[#fafafa]'>
                <div className="my-container">
                    <div className="flex items-center justify-start lg:justify-center gap-4 lg:gap-2 py-3 lg:py-8 pb-3 lg:pb-8 px-3 lg:px-5 overflow-x-auto scrollableBox footerBoxWrap">
                        <div className="col flex items-center justify-center flex-col group min-w-[150px] shrink-0 lg:min-w-0 lg:w-[15%]">
                            <FaShippingFast className='text-[40px] transition-all duration-300 group-hover:text-[#ff5252] group-hover:-translate-y-1' />
                            <h3 className="text-[16px] font-semibold mt-3">
                                Free Shipping
                            </h3>
                            <p className="text-[12px] font-medium">
                                For all Orders
                            </p>
                        </div>
                        <div className="col flex items-center justify-center flex-col group min-w-[150px] shrink-0 lg:min-w-0 lg:w-[15%]">
                            <PiKeyReturn className='text-[40px] transition-all duration-300 group-hover:text-[#ff5252] group-hover:-translate-y-1' />
                            <h3 className="text-[16px] font-semibold mt-3">
                                30 Days Returns
                            </h3>
                            <p className="text-[12px] font-medium">
                                For an Exchange Product
                            </p>
                        </div>
                        <div className="col flex items-center justify-center flex-col group min-w-[150px] shrink-0 lg:min-w-0 lg:w-[15%]">
                            <BsWallet2 className='text-[40px] transition-all duration-300 group-hover:text-[#ff5252] group-hover:-translate-y-1' />
                            <h3 className="text-[16px] font-semibold mt-3">
                                Secured Payment
                            </h3>
                            <p className="text-[12px] font-medium">
                                Payment Cards Accepted
                            </p>
                        </div>
                        <div className="col flex items-center justify-center flex-col group min-w-[150px] shrink-0 lg:min-w-0 lg:w-[15%]">
                            <CiGift className='text-[40px] transition-all duration-300 group-hover:text-[#ff5252] group-hover:-translate-y-1' />
                            <h3 className="text-[16px] font-semibold mt-3">
                                Special Gifts
                            </h3>
                            <p className="text-[12px] font-medium">
                                Our First Product Order
                            </p>
                        </div>
                        <div className="col flex items-center justify-center flex-col group min-w-[150px] shrink-0 lg:min-w-0 lg:w-[15%]">
                            <BiSupport className='text-[40px] transition-all duration-300 group-hover:text-[#ff5252] group-hover:-translate-y-1' />
                            <h3 className="text-[16px] font-semibold mt-3">
                                Support 24/7
                            </h3>
                            <p className="text-[12px] font-medium">
                                Contact us Anytime
                            </p>
                        </div>
                    </div>

                    <br />
                    <hr />

                    <div className="footer flex px-3 lg:px-0 flex-col lg:flex-row py-8">
                        <div className="part1 w-full lg:w-[25%] border-r border-[rgba(0,0,0,0.1)]">
                            <h2 className="text-[18px] font-semibold mb-4">
                                Contact us
                            </h2>
                            <p className="text-[13px] font-normal pb-4">
                                {"Chequemart - ecommerce salesive"}
                            </p>
                            <Link to="mailto:c08445333@gmail.com" className='link text-[13px]'>chequemart@gmail.com</Link>
                            <span className="text-[22px] font-semibold block w-full mt-3 mb-5 text-[#ff5252]">
                                {"(+234) 7032-355-643"}
                            </span>
                            <div className="flex items-center gap-2">
                                <IoChatboxOutline className='text-[40px] text-[#ff5252]' />
                                <span className="text-[16px] font-semibold">
                                    {"Chat with us"}
                                    <br />
                                    {"on WhatsApp"}
                                </span>
                            </div>
                        </div>

                        <div className="part2  w-full lg:w-[40%] flex pl-0 lg:pl-8 mt-5 lg:mt-0">
                            <div className="part2_col1 w-[50%]">
                                <h2 className="text-[18px] font-semibold mb-4">Products</h2>
                                <ul className="list">
                                    <li className='list-none text-[14px] w-full mb-2'>
                                        <Link to="/" className='link'>Prices drop</Link>
                                    </li>
                                    <li className='list-none text-[14px] w-full mb-2'>
                                        <Link to="/products" className='link'>New Products</Link>
                                    </li>
                                    <li className='list-none text-[14px] w-full mb-2'>
                                        <Link to="/products" className='link'>Best Sales</Link>
                                    </li>
                                    <li className='list-none text-[14px] w-full mb-2'>
                                        <Link to="/" className='link'>Contact Us</Link>
                                    </li>
                                </ul>
                            </div>
                            <div className="part2_col2 w-[50%]">
                                <h2 className="text-[18px] font-semibold mb-4">
                                    Our Company
                                </h2>
                                <ul className="list">
                                    <li className="list-none text-[14px] w-full mb-2">
                                        <Link to="/about" className='link'>About Us</Link>
                                    </li>
                                    <li className="list-none text-[14px] w-full mb-2">
                                        <Link to="/terms" className='link'>Terms & Conditions</Link>
                                    </li>
                                    <li className="list-none text-[14px] w-full mb-2">
                                        <Link to="/privacy" className='link'>Privacy Policy</Link>
                                    </li>
                                    <li className="list-none text-[14px] w-full mb-2">
                                        <Link to="/payment" className='link'>Payment Information</Link>
                                    </li>
                                    <li className="list-none text-[14px] w-full mb-2">
                                        <Link to="/login" className='link'>Login</Link>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="part3  w-full lg:w-[35%] flex pl-0 lg:pl-8 flex-col pr-8 mt-5 lg:mt-0">
                            <h2 className="text-[18px] font-semibold mb-2 lg:mb-4">
                                Subscribe to our newsletter
                            </h2>
                            <p className="text-[13px]">Subscribe to our latest newsletter to get news about special discounts.</p>

                            <form action="" className="mt-5">
                                <input type="email" name="" className='w-full h-11.25 border outline-none pl-4 pr-4 rounded-sm mb-4 focus:border-[rgba(0,0,0,0.3)]' id="" placeholder='Your Email Address' />

                                <Button className='btn-org'>SUBSCRIBE</Button>

                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            sx={{
                                                color: "#000",
                                                "&.Mui-checked": {
                                                    color: "#ff6b26",
                                                },
                                            }}
                                        />
                                    }
                                    label={
                                        <span style={{ fontSize: "13px" }}>
                                            I agree to the terms and conditions and the privacy policy
                                        </span>
                                    }
                                />
                            </form>
                        </div>
                    </div>


                </div>
            </footer>

            <div className="bottomStrip border-t border-[rgba(0,0,0,0.1)] pt-3 pb-25 lg:pb-3 bg-white">
                <div className="my-container flex items-center justify-between flex-col lg:flex-row gap-4 lg:gap-0">
                    <ul className="flex items-center gap-2">
                        <li className="list-none">
                            <Link className='w-8.75 h-8.75 rounded-full border border-[rgba(0,0,0,0.1)] flex items-center justify-center group hover:bg-[#ff5252] transition-all' to="/" target='_blank'>
                                <FaFacebookF className='text-[17px] group-hover:text-white' />

                            </Link>
                        </li>
                        <li className="list-none">
                            <Link className='w-8.75 h-8.75 rounded-full border border-[rgba(0,0,0,0.1)] flex items-center justify-center group hover:bg-[#ff5252] transition-all' to="/" target='_blank'>
                                <FaInstagram className='text-[17px] group-hover:text-white' />
                            </Link>
                        </li>
                        <li className="list-none">
                            <Link className='w-8.75 h-8.75 rounded-full border border-[rgba(0,0,0,0.1)] flex items-center justify-center group hover:bg-[#ff5252] transition-all' to="/" target='_blank'>
                                <FaXTwitter className='text-[17px] group-hover:text-white' />
                            </Link>
                        </li>
                        <li className="list-none">
                            <Link className='w-8.75 h-8.75 rounded-full border border-[rgba(0,0,0,0.1)] flex items-center justify-center group hover:bg-[#ff5252] transition-all' to="/" target='_blank'>
                                <FaTiktok className='text-[17px] group-hover:text-white' />
                            </Link>
                        </li>
                    </ul>
                    <p className="text-[13px] text-center mb-0">
                        © 2026 - Chequemart
                    </p>
                    <div className="flex items-center gap-1">
                        <img src={masterCard} alt="Master Card" />
                        <img src={visa} alt="Visa" />
                        <img src={americanExpress} alt="American Express" />
                    </div>
                </div>
            </div>
        </>
    )
}

export { Footer }