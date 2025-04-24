import React, { useState } from 'react';
import image from "../assets/imagethree.png";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from './Signuppage';
import { LiaEyeSolid } from "react-icons/lia";
import { FaEyeSlash } from "react-icons/fa";

const HeroSection = () => {
  const [phone_num, setphone_num] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [pass, setPass] = useState('');
  const [loading, setLoading] = useState(false);
  const [login, setlogin] = useState(false);
  const [passwordshown, setpasswordshown] = useState(false);
  const navigate = useNavigate();
  const { signedup, setsignedup  ,username , setUserName  ,currentuser , setcurrentuser  } = useAuth();

  const handlePhoneChange = (e) => {
    setphone_num(e.target.value);
    setErrorMessage('');
  };

  const togglePasswordVisibility = () => {
    setpasswordshown(prev => !prev);
  };

  const handlePassChange = (e) => {
    setPass(e.target.value);
  };

  const submitLogin = async () => {
    const isValidPhone = /^[0-9]{10}$/.test(phone_num);
    if (!isValidPhone) {
      setErrorMessage('Please check your phone number again');
      return;
    }

    try {
      setLoading(true);
      const formattedPhone = `+91${phone_num}`;
      const response = await axios.post("http://localhost:3001/login", {
        phone: formattedPhone,
        password: pass,
      });

      if (response.data.success) {
        setlogin(true);
        setsignedup(true);
        setUserName(response.data.user.name);
        setcurrentuser(response.data.user.id);

        navigate('/report');
      } else {
        setErrorMessage(response.data.message || 'Login failed. Please try again.');
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage('Invalid phone number or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-gray-800 to-gray-600 h-screen w-full relative overflow-hidden">
      <div className="absolute top-12 left-8 lg:left-16 xl:left-24 w-full max-w-2xl mb-16">
        <h1 className="text-white text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-wide">
          Report A Disaster
        </h1>
        <p className="text-white text-lg md:text-xl lg:text-2xl mt-4 max-w-lg">
          Quickly report any disaster or emergency situation in your area and get immediate help.
        </p>
        <div className="mt-8">
          <Link to="/report">
            <button className="bg-blue-600 text-white px-8 py-3 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 font-semibold text-lg">
              Report Now
            </button>
          </Link>
        </div>
      </div>

      <div className="hidden lg:flex absolute right-0 bottom-0 w-[50%] h-[80%] items-center justify-center z-0">
        <img src={image} alt="Accident Scene" className="object-cover w-[90%] h-[90%] ml-36 rounded-lg" />
      </div>

      {!signedup && (
        <div className="mt-[380px] ml-9 left-8 lg:left-16 bottom-20 flex flex-wrap gap-4 bg-white p-6 rounded-xl shadow-lg w-[90%] lg:w-[60%] max-w-3xl z-10">
          <div className="flex-1 min-w-[250px]">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Phone Number</h2>
            <input
              type="text"
              value={phone_num}
              onChange={handlePhoneChange}
              placeholder="Enter your phone number"
              className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="flex-1 min-w-[250px]">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Password</h2>
            <div className="relative w-full">
              <input
                type={passwordshown ? "text" : "password"}
                placeholder="Enter your password"
                value={pass}
                onChange={handlePassChange}
                className="border border-gray-300 p-3 rounded-lg w-full pr-12 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                {passwordshown ? (
                  <LiaEyeSolid className="text-xl" />
                ) : (
                  <FaEyeSlash className="text-xl" />
                )}
              </button>
            </div>
          </div>

          <div className="flex-1 flex-col items-end min-w-[200px]">
            <button
              onClick={submitLogin}
              className={`bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all duration-300 w-full font-semibold ${loading ? 'bg-gray-400 cursor-not-allowed' : ''}`}
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Log In'}
            </button>
            {errorMessage && (
              <p className="text-red-600 mt-2 text-sm">{errorMessage}</p>
            )}
            <div className="mt-5">
              <h1>Don't have an account? <Link to="/signup" className="text-red-600">Sign up</Link></h1>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeroSection;
