import React, { useState } from 'react'
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import {
  Truck,
  RotateCcw,
  Shield,
  Gift,
  Headphones,
  MessageSquare,
  Facebook,
  Instagram,
  Twitter,
  Music,
} from "lucide-react";
import masterCard from "../../assets/image/master_card.png";
import visa from "../../assets/image/visa.png";
import americanExpress from "../../assets/image/american_express.png";

const Footer = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      // TODO: Integrate with newsletter API
      alert(`Subscribed: ${email}`);
      setEmail("");
    } else {
      alert("Please enter a valid email address");
    }
  };

  return (
    <>
      <footer className='py-6 bg-[#fafafa]'>
        <div className="my-container">
          <div className="flex items-center justify-center gap-2 py-3 lg:py-8 pb-0 lg:pb-8 px-0 lg:px-5 flex-row overflow-x-scroll overflow-y-hidden">
            <div className="col flex items-center justify-center flex-col group min-w-30 sm:min-w-37.5 shrink-0 lg:w-[15%] px-2">
              <Truck className='text-[32px] sm:text-[40px] transition-all duration-300 group-hover:text-[#ff5252] group-hover:-translate-y-1' aria-hidden="true" />
              <h3 className="text-[14px] sm:text-[16px] font-semibold mt-3 text-center">
                Free Shipping
              </h3>
              <p className="text-[12px] font-medium text-center px-1">
                For all Orders
              </p>
            </div>
            <div className="col flex items-center justify-center flex-col group min-w-30 sm:min-w-37.5 shrink-0 lg:w-[15%] px-2">
              <RotateCcw className='text-[32px] sm:text-[40px] transition-all duration-300 group-hover:text-[#ff5252] group-hover:-translate-y-1' aria-hidden="true" />
              <h3 className="text-[14px] sm:text-[16px] font-semibold mt-3 text-center">
                30 Days Returns
              </h3>
              <p className="text-[12px] font-medium text-center px-1">
                For an Exchange Product
              </p>
            </div>
            <div className="col flex items-center justify-center flex-col group min-w-30 sm:min-w-37.5 shrink-0 lg:w-[15%] px-2">
              <Shield className='text-[32px] sm:text-[40px] transition-all duration-300 group-hover:text-[#ff5252] group-hover:-translate-y-1' aria-hidden="true" />
              <h3 className="text-[14px] sm:text-[16px] font-semibold mt-3 text-center">
                Secured Payment
              </h3>
              <p className="text-[12px] font-medium text-center px-1">
                Payment Cards Accepted
              </p>
            </div>
            <div className="col flex items-center justify-center flex-col group min-w-30 sm:min-w-37.5 shrink-0 lg:w-[15%] px-2">
              <Gift className='text-[32px] sm:text-[40px] transition-all duration-300 group-hover:text-[#ff5252] group-hover:-translate-y-1' aria-hidden="true" />
              <h3 className="text-[14px] sm:text-[16px] font-semibold mt-3 text-center">
                Special Gifts
              </h3>
              <p className="text-[12px] font-medium text-center px-1">
                Our First Product Order
              </p>
            </div>
            <div className="col flex items-center justify-center flex-col group min-w-30 sm:min-w-37.5 shrink-0 lg:w-[15%] px-2">
              <Headphones className='text-[32px] sm:text-[40px] transition-all duration-300 group-hover:text-[#ff5252] group-hover:-translate-y-1' aria-hidden="true" />
              <h3 className="text-[14px] sm:text-[16px] font-semibold mt-3 text-center">
                Support 24/7
              </h3>
              <p className="text-[12px] font-medium text-center px-1">
                Contact us Anytime
              </p>
            </div>
          </div>

          <hr />

          <div className="footer flex px-3 lg:px-0 flex-col lg:flex-row py-8">
            <div className="part1 w-full lg:w-[25%] border-r border-[rgba(0,0,0,0.1)]">
              <h2 className="text-[18px] font-semibold mb-4">
                Contact us
              </h2>
              <p className="text-[13px] font-normal pb-4">
                {"Chequemart - ecommerce salesive"}
              </p>
              <a href="mailto:helpusers@chequemart.com" className='link text-[13px]'>helpusers@chequemart.com</a>
              <span className="text-[22px] font-semibold block w-full mt-3 mb-5 text-[#ff5252]">
                {"(+234) 7032-355-643"}
              </span>
              <div className="flex items-center gap-2">
                <MessageSquare className='text-[40px] text-[#ff5252]' aria-hidden="true" />
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
                  <li className="list-none text-[14px] w-full mb-2">
                    <Link to="/products?sort=price&order=asc" className='link'>Prices drop</Link>
                  </li>
                  <li className="list-none text-[14px] w-full mb-2">
                    <Link to="/products" className='link'>New Products</Link>
                  </li>
                  <li className="list-none text-[14px] w-full mb-2">
                    <Link to="/products?sort=sales&order=desc" className='link'>Best Sales</Link>
                  </li>
                  <li className="list-none text-[14px] w-full mb-2">
                    <a href="https://wa.me/2347032355643" className='link' target='_blank' rel="noopener noreferrer">Contact Us</a>
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

              <form onSubmit={handleSubscribe} className="mt-5">
                <label htmlFor="newsletter-email" className="sr-only">Email address</label>
                <input
                  type="email"
                  id="newsletter-email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className='w-full h-11.25 border outline-none pl-4 pr-4 rounded-sm mb-4 focus:border-[rgba(0,0,0,0.3)]'
                  placeholder='Your Email Address'
                  required
                />

                <Button type="submit" className='btn-org'>SUBSCRIBE</Button>

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
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className='w-8.75 h-8.75 rounded-full border border-[rgba(0,0,0,0.1)] flex items-center justify-center group hover:bg-[#ff5252] transition-all'
                aria-label="Facebook"
              >
                <Facebook className='text-[17px] group-hover:text-white' aria-hidden="true" />
              </a>
            </li>
            <li className="list-none">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className='w-8.75 h-8.75 rounded-full border border-[rgba(0,0,0,0.1)] flex items-center justify-center group hover:bg-[#ff5252] transition-all'
                aria-label="Instagram"
              >
                <Instagram className='text-[17px] group-hover:text-white' aria-hidden="true" />
              </a>
            </li>
            <li className="list-none">
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                className='w-8.75 h-8.75 rounded-full border border-[rgba(0,0,0,0.1)] flex items-center justify-center group hover:bg-[#ff5252] transition-all'
                aria-label="Twitter"
              >
                <Twitter className='text-[17px] group-hover:text-white' aria-hidden="true" />
              </a>
            </li>
            <li className="list-none">
              <a
                href="https://tiktok.com/"
                target="_blank"
                rel="noopener noreferrer"
                className='w-8.75 h-8.75 rounded-full border border-[rgba(0,0,0,0.1)] flex items-center justify-center group hover:bg-[#ff5252] transition-all'
                aria-label="TikTok"
              >
                <Music className='text-[17px] group-hover:text-white' aria-hidden="true" />
              </a>
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