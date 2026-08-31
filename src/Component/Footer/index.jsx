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

const features = [
  { icon: Truck, title: "Free Shipping", desc: "For all Orders" },
  { icon: RotateCcw, title: "30 Days Returns", desc: "For an Exchange Product" },
  { icon: Shield, title: "Secured Payment", desc: "Payment Cards Accepted" },
  { icon: Gift, title: "Special Gifts", desc: "Our First Product Order" },
  { icon: Headphones, title: "Support 24/7", desc: "Contact us Anytime" },
];

const productLinks = [
  { label: "Prices drop", to: "/products?sort=price&order=asc" },
  { label: "New Products", to: "/products" },
  { label: "Best Sales", to: "/products?sort=sales&order=desc" },
  { label: "Contact Us", href: "https://wa.me/2347032355643" },
];

const companyLinks = [
  { label: "About Us", to: "/about" },
  { label: "Terms & Conditions", to: "/terms" },
  { label: "Privacy Policy", to: "/privacy" },
  { label: "Login", to: "/login" },
];

const socialLinks = [
  { icon: Facebook, href: "https://facebook.com", label: "Facebook" },
  { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
  { icon: Twitter, href: "https://x.com", label: "Twitter" },
  { icon: Music, href: "https://tiktok.com", label: "TikTok" },
];

const Footer = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert(`Subscribed: ${email}`);
      setEmail("");
    }
  };

  return (
    <>
      {/* Features strip */}
      <footer className="py-6 bg-neutral-50 border-t border-neutral-100">
        <div className="my-container">
          <div className="flex items-center justify-center gap-2 py-3 lg:py-8 pb-0 lg:pb-8 px-0 lg:px-5 flex-row overflow-x-scroll overflow-y-hidden">
            {features.map((feat) => (
              <div key={feat.title} className="col flex items-center justify-center flex-col group min-w-28 sm:min-w-36 shrink-0 lg:w-[15%] px-2">
                <feat.icon className="text-[28px] sm:text-[36px] text-neutral-400 transition-all duration-300 group-hover:text-primary-500 group-hover:-translate-y-1" aria-hidden="true" />
                <h3 className="text-sm sm:text-base font-semibold mt-3 text-center text-neutral-800">{feat.title}</h3>
                <p className="text-xs font-medium text-center px-1 text-neutral-400">{feat.desc}</p>
              </div>
            ))}
          </div>

          <hr className="border-neutral-200" />

          {/* Main footer content */}
          <div className="footer flex px-3 lg:px-0 flex-col lg:flex-row py-8 gap-8 lg:gap-0">
            {/* Contact */}
            <div className="w-full lg:w-[25%] lg:border-r border-neutral-200">
              <h2 className="text-lg font-semibold mb-4 text-neutral-900">Contact us</h2>
              <p className="text-sm text-neutral-500 pb-4">Chequemart - Nigeria's trusted marketplace</p>
              <a href="mailto:helpusers@chequemart.com" className="text-sm text-neutral-500 hover:text-primary-500 transition-colors">helpusers@chequemart.com</a>
              <span className="text-xl font-semibold block w-full mt-3 mb-5 text-primary-500">
                (+234) 7032-355-643
              </span>
              <a href="https://wa.me/2347032355643" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 group">
                <MessageSquare className="text-[36px] text-primary-500" aria-hidden="true" />
                <span className="text-base font-semibold text-neutral-800 group-hover:text-primary-500 transition-colors">
                  Chat with us<br />on WhatsApp
                </span>
              </a>
            </div>

            {/* Links */}
            <div className="w-full lg:w-[40%] flex pl-0 lg:pl-8">
              <div className="w-[50%]">
                <h2 className="text-lg font-semibold mb-4 text-neutral-900">Products</h2>
                <ul className="space-y-2.5">
                  {productLinks.map((link) => (
                    <li key={link.label} className="text-sm">
                      {link.href ? (
                        <a href={link.href} target="_blank" rel="noopener noreferrer" className="text-neutral-500 hover:text-primary-500 transition-colors">{link.label}</a>
                      ) : (
                        <Link to={link.to} className="text-neutral-500 hover:text-primary-500 transition-colors">{link.label}</Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="w-[50%]">
                <h2 className="text-lg font-semibold mb-4 text-neutral-900">Our Company</h2>
                <ul className="space-y-2.5">
                  {companyLinks.map((link) => (
                    <li key={link.label} className="text-sm">
                      <Link to={link.to} className="text-neutral-500 hover:text-primary-500 transition-colors">{link.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Newsletter */}
            <div className="w-full lg:w-[35%] flex pl-0 lg:pl-8 flex-col pr-8">
              <h2 className="text-lg font-semibold mb-2 lg:mb-4 text-neutral-900">Subscribe to our newsletter</h2>
              <p className="text-sm text-neutral-500">Subscribe to our latest newsletter to get news about special discounts.</p>

              <form onSubmit={handleSubscribe} className="mt-5">
                <label htmlFor="newsletter-email" className="sr-only">Email address</label>
                <input
                  type="email"
                  id="newsletter-email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-11 border border-neutral-200 outline-none pl-4 pr-4 rounded-lg mb-4 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/15 transition"
                  placeholder="Your Email Address"
                  required
                />
                <Button type="submit" className="btn-org">SUBSCRIBE</Button>

                <FormControlLabel
                  control={
                    <Checkbox
                      sx={{
                        color: "#a3a3a3",
                        "&.Mui-checked": {
                          color: "#ff5252",
                        },
                      }}
                    />
                  }
                  label={
                    <span className="text-xs text-neutral-400">
                      I agree to the terms and conditions and the privacy policy
                    </span>
                  }
                />
              </form>
            </div>
          </div>
        </div>
      </footer>

      {/* Bottom strip */}
      <div className="border-t border-neutral-200 pt-3 pb-25 lg:pb-3 bg-white">
        <div className="my-container flex items-center justify-between flex-col lg:flex-row gap-4 lg:gap-0">
          <ul className="flex items-center gap-2">
            {socialLinks.map((social) => (
              <li key={social.label} className="list-none">
                <a
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-400 group hover:bg-primary-500 hover:border-primary-500 hover:text-white transition-all"
                  aria-label={social.label}
                >
                  <social.icon className="text-[16px]" aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
          <p className="text-xs text-neutral-400">&copy; 2025 Chequemart. All rights reserved.</p>
          <div className="flex items-center gap-3">
            <img src={masterCard} alt="Mastercard" className="h-6 opacity-50" />
            <img src={visa} alt="Visa" className="h-6 opacity-50" />
            <img src={americanExpress} alt="American Express" className="h-6 opacity-50" />
          </div>
        </div>
      </div>
    </>
  );
};

export { Footer };
