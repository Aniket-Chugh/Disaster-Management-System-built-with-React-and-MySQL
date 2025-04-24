import React, { useState } from "react";
import Navbar from "./NavBar";
import Footer from "./Footer";

export const  ContactPage = ()=> {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Sending...");
    
    // Simulate API call
    setTimeout(() => {
      setStatus("Message sent!");
      setFormData({ name: "", email: "", message: "" });
    }, 1500);
  };

  return (
    <div>
<Navbar></Navbar>
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white shadow-xl rounded-2xl w-full max-w-xl p-8">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">Contact Us</h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Name"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Message"
            rows="5"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition duration-300"
          >
            Send Message
          </button>
          {status && <p className="text-center text-green-600">{status}</p>}
        </form>
      </div>
    </div>
    <Footer></Footer>
            </div>
  );
}
