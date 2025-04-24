import React, { useState } from 'react';
import Navbar from './NavBar';
import Footer from './Footer';
import axios from "axios";

const faqs = [
  {
    question: 'How do I report a disaster?',
    answer: 'You can report disasters using our SOS feature or by submitting a report form with location, image, or voice.',
  },
  {
    question: 'Can I report anonymously?',
    answer: 'Yes, you can choose not to share personal details while reporting, although it may limit follow-up support.',
  },
  {
    question: 'How long does it take to respond?',
    answer: 'We aim to alert local authorities in real-time, but response times may vary based on severity and region.',
  },
];

export const SupportPage = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const [form, setForm] = useState({ name: '', phone_num: '', message: '' });
  const [status, setStatus] = useState('');

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Submitting...');
    try {
      await axios.post("http://localhost:3001/support-data", {
        ...form,
      });
      console.log("Submitted successfully");
      setStatus('Submitted successfully!');
      setForm({ name: '', phone_num: '', message: '' }); // Reset form
    } catch (error) {
      console.error("Submission error:", error);
      setStatus('Submission failed. Please try again.');
    }
  };

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gray-100 py-12 px-6">
        <div className="max-w-6xl mx-auto space-y-12">

          {/* Header */}
          <div className="text-center">
            <h1 className="text-4xl font-bold text-blue-700 mb-2">Support Center</h1>
            <p className="text-gray-600">Need help? We’re here to support you.</p>
          </div>

          {/* Search Bar */}
          <div className="max-w-xl mx-auto">
            <input
              type="text"
              placeholder="Search support topics..."
              className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* FAQs Section */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Frequently Asked Questions</h2>
            {faqs.map((faq, index) => (
              <div key={index} className="border-b py-3">
                <button
                  onClick={() => toggleFAQ(index)}
                  className="flex justify-between w-full text-left text-lg font-medium text-gray-700 focus:outline-none"
                >
                  {faq.question}
                  <span>{openIndex === index ? '−' : '+'}</span>
                </button>
                {openIndex === index && (
                  <p className="text-gray-600 mt-2">{faq.answer}</p>
                )}
              </div>
            ))}
          </div>

          {/* Contact Support Form */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Contact Support</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Your Name"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                name="phone_num"
                value={form.phone_num}
                onChange={handleChange}
                placeholder="Enter Registered Phone Number"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="Your Message"
                rows={5}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition duration-300"
              >
                Submit
              </button>
              {status && <p className="text-green-600 font-medium mt-2">{status}</p>}
            </form>
          </div>

          {/* Emergency Section */}
          <div className="bg-red-100 border border-red-300 text-red-800 p-6 rounded-2xl text-center">
            <h3 className="text-2xl font-bold mb-2">Emergency Help</h3>
            <p>If you're in immediate danger, call your local emergency services or use the SOS button in the app.</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};
