import React from 'react';
import Navbar from './NavBar';
import Footer from './Footer';

export const  AboutPage=()=> {
  return (
    <div>
<Navbar></Navbar>
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-md">
        <h1 className="text-4xl font-bold text-blue-600 mb-6">About Us</h1>

        <p className="text-gray-700 text-lg mb-4">
          Our disaster management platform empowers users to report emergencies quickly and securely. 
        </p>

        <p className="text-gray-700 text-lg mb-4">
          Users can sign up or log in using phone numbers or email. Once authenticated, they can send reports with their location, voice, image, or written message.
        </p>

        <p className="text-gray-700 text-lg">
          We aim to make disaster reporting accessible, fast, and effective, helping authorities take action in real time.
        </p>
      </div>
    </div>
    <Footer></Footer>
    </div>
  );
}
