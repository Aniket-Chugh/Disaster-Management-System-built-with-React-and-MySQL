import React from 'react';
import Navbar from './NavBar';
import Footer from './Footer';

export const  TermsAndConditions=()=> {
  return (
    <div>
<Navbar></Navbar>
    <div className="min-h-screen bg-gray-100 px-6 py-12 flex justify-center">
      <div className="max-w-4xl bg-white rounded-2xl shadow-md p-8">
        <h1 className="text-3xl font-bold text-blue-600 mb-6">Terms and Conditions</h1>

        <p className="text-gray-700 mb-4">
          By accessing and using this disaster management platform, you agree to be bound by these terms and conditions. Please read them carefully.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2 text-gray-800">1. Account Usage</h2>
        <p className="text-gray-700 mb-4">
          Users must provide accurate information during registration. You are responsible for maintaining the confidentiality of your login credentials.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2 text-gray-800">2. Reporting Responsibility</h2>
        <p className="text-gray-700 mb-4">
          Users must only submit genuine disaster or emergency reports. False reports may lead to suspension or legal action.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2 text-gray-800">3. Intellectual Property</h2>
        <p className="text-gray-700 mb-4">
          All content, logos, and assets on this platform are the property of the developers unless stated otherwise.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2 text-gray-800">4. Limitation of Liability</h2>
        <p className="text-gray-700 mb-4">
          We are not liable for delays in response or loss caused by incorrect or missed reports. We provide tools, not guarantees.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2 text-gray-800">5. Changes to Terms</h2>
        <p className="text-gray-700 mb-4">
          These terms may be updated occasionally. Continued use of the platform implies acceptance of the updated terms.
        </p>

        <p className="text-gray-600 text-sm mt-8">Last updated: April 2025</p>
      </div>
    </div>
<Footer></Footer>
    </div>
  );
}
