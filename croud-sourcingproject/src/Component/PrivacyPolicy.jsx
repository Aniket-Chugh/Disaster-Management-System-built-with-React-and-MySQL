import React from 'react';
import Navbar from './NavBar';
import Footer from './Footer';

export const  PrivacyPolicy=()=> {
  return (
    <div>
<Navbar></Navbar>
    <div className="min-h-screen bg-gray-100 px-6 py-12 flex justify-center">
      <div className="max-w-4xl bg-white rounded-2xl shadow-md p-8">
        <h1 className="text-3xl font-bold text-blue-600 mb-6">Privacy Policy</h1>

        <p className="text-gray-700 mb-4">
          We value your privacy and are committed to protecting your personal information. This privacy policy outlines how we collect, use, and protect your data.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2 text-gray-800">Information We Collect</h2>
        <ul className="list-disc pl-6 text-gray-700 space-y-1">
          <li>Phone number and email for authentication</li>
          <li>Location data (only when submitting reports)</li>
          <li>Media files like images or voice recordings</li>
        </ul>

        <h2 className="text-xl font-semibold mt-6 mb-2 text-gray-800">How We Use Your Information</h2>
        <p className="text-gray-700 mb-4">
          Your information is used solely for the purpose of improving disaster response, verifying incidents, and communicating updates. We do not sell or share your data with third parties.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2 text-gray-800">Data Security</h2>
        <p className="text-gray-700 mb-4">
          We use secure servers and encryption to protect your data. Access is restricted and monitored.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2 text-gray-800">Your Rights</h2>
        <p className="text-gray-700 mb-4">
          You may request deletion or access to your personal data anytime by contacting us.
        </p>

        <p className="text-gray-600 text-sm mt-8">
          Last updated: April 2025
        </p>
      </div>
    </div>
    <Footer></Footer>
    </div>
  );
}
