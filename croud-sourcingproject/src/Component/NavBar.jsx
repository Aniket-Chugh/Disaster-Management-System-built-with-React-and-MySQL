import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaTimes, FaChevronDown } from "react-icons/fa";
import { RiAccountCircleFill } from "react-icons/ri";
import { useAuth } from "./Signuppage";
import axios from "axios";

const Navbar = () => {
  const [openDesktopMenu, setOpenDesktopMenu] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openMobileMenu, setOpenMobileMenu] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const accountMenuRef = useRef();
  const { signedup, setsignedup  ,username , setUserName } = useAuth(); // Accessing the context

  const toggleDesktopMenu = () => {
    setOpenDesktopMenu(!openDesktopMenu);
  };






  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleMobileDropdownMenu = () => {
    setOpenMobileMenu(!openMobileMenu);
  };

  // Close account dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (accountMenuRef.current && !accountMenuRef.current.contains(event.target)) {
        setAccountMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <nav className="bg-gray-900 text-white py-3 px-6 flex items-center justify-between shadow-md sticky top-0 z-10">
        <div className="flex items-center gap-6">
          <Link to="/">
            <h1 className="text-2xl font-bold tracking-wide">DisasterMS</h1>
          </Link>

          {/* Mobile Menu Button */}
          <button className="lg:hidden text-white" onClick={toggleMobileMenu}>
            {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>

          {/* Desktop Navigation Links */}
          <ul className="hidden lg:flex gap-6 text-sm">
            <Link to={"/"}> <li className="hover:text-blue-400 cursor-pointer transition">Home</li></Link>
            <Link to={"/support"}> <li className="hover:text-blue-400 cursor-pointer transition">Support</li></Link>
            <Link to={"/about"}> <li className="hover:text-blue-400 cursor-pointer transition">About Us</li></Link>
            <Link to={"/terms"}> <li className="hover:text-blue-400 cursor-pointer transition">Terms and condition</li></Link>
          </ul>
        </div>

        {/* Center - Search Bar */}
        <div className="hidden md:flex bg-gray-600 px-4 py-2 rounded-full items-center shadow-inner">
          <input
            type="text"
            placeholder="Find urgent help"
            className="bg-transparent outline-none text-white placeholder-gray-200 px-2"
          />
          <Link to="/ngosearch">
            <button className="text-white hover:text-blue-100 transition">🔍</button>
          </Link>
        </div>

        {/* Right - Account/Sign Up */}
        {signedup ? (
          <div className="relative" ref={accountMenuRef}>
            <button
              onClick={() => setAccountMenuOpen(!accountMenuOpen)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
            >
              <div className="flex items-center gap-2">

              <RiAccountCircleFill className="size-9" />  {username}
              </div>

            </button>

            {accountMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white text-gray-800 border border-gray-200 rounded-md shadow-lg z-50">
                <ul className="py-2">
                  <Link to="/reports">
                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Your Reports</li>
                  </Link>

                  <Link to="/reports">
                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Help</li>
                  </Link>
                  <li
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-500"
                    onClick={() => setsignedup(false)}
                  >
                    Logout
                  </li>
                </ul>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Link to="/signup">
              <button className="text-sm px-4 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition">
                Sign Up
              </button>
            </Link>
          </div>
        )}
      </nav>

      {/* Mobile Menu Section */}
      {isMobileMenuOpen && (
        <div className="lg:hidden w-full bg-gray-900 p-4">
          <ul className="flex flex-col gap-4 text-sm">
            <li className="text-white hover:text-blue-400 cursor-pointer transition">Home</li>
            <li className="text-white hover:text-blue-400 cursor-pointer transition">One-time Report</li>

            {/* Mobile Dropdown */}
            <li className="relative">
              <button onClick={toggleMobileDropdownMenu} className="flex items-center gap-1 text-white">
                <span className="hover:text-blue-400 cursor-pointer transition">Volunteer Hub 🤝</span>
                <FaChevronDown
                  strokeWidth={2.5}
                  className={`h-3 w-3 transition-transform ${openMobileMenu ? "rotate-180" : ""}`}
                />
              </button>

              {openMobileMenu && (
                <ul className="absolute bg-gray-900 w-[150px] p-2 mt-2 rounded-md shadow-lg max-h-40 overflow-auto">
                  <li className="text-white hover:bg-gray-500 hover:rounded-md p-1 cursor-pointer">Join as Volunteer</li>
                  <li className="text-white hover:bg-gray-500 hover:rounded-md p-1 cursor-pointer">Manage Tasks</li>
                  <li className="text-white hover:bg-gray-500 hover:rounded-md p-1 cursor-pointer">Emergency Assistance</li>
                </ul>
              )}
            </li>

            <li className="text-white hover:text-blue-400 cursor-pointer transition">Support</li>

            {/* Mobile Search Bar */}
            <div className="flex bg-gray-600 px-4 py-2 rounded-full items-center shadow-inner mt-2">
              <input
                type="text"
                placeholder="Find urgent help"
                className="bg-transparent outline-none text-white placeholder-gray-200 px-2"
              />
              <Link to="/ngosearch">
                <button className="text-white hover:text-blue-100 transition">🔍</button>
              </Link>
            </div>
          </ul>
        </div>
      )}
    </>
  );
};

export default Navbar;
