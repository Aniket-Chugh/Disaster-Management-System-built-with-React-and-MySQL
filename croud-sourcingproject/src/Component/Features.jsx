import React from 'react';
import { FaMapMarkerAlt, FaExclamationCircle, FaListAlt, FaUsers, FaRobot, FaSatellite, FaUserShield } from 'react-icons/fa';

const HelpSection = () => {
  return (
    <section className="bg-gray-100 py-16">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-gray-800">How We’re Helping During Disasters</h2>
        <p className="text-lg text-gray-600 text-center mt-4">
          Our platform provides a range of features to ensure that you get the help you need when disaster strikes. From easy reporting to real-time updates, we are committed to offering quick, efficient, and accessible solutions.
        </p>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
          {/* User Dashboard - Disaster Map */}
          <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
            <FaMapMarkerAlt className="text-blue-600 text-4xl mb-4" />
            <h3 className="text-xl font-semibold text-gray-800">User Dashboard: Disaster Map</h3>
            <p className="text-gray-600 mt-2">
              View real-time disaster data on an interactive map. See where disasters have occurred in your area, track ongoing situations, and stay informed at all times.
            </p>
          </div>

          {/* Emergency Alert System */}
          <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
            <FaExclamationCircle className="text-red-600 text-4xl mb-4" />
            <h3 className="text-xl font-semibold text-gray-800">Emergency Alert System</h3>
            <p className="text-gray-600 mt-2">
              Get instant emergency alerts via SMS or app notifications. The system is designed to keep you updated in real-time during any emergency situation.
            </p>
          </div>

          {/* User-friendly Forms */}
          <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
            <FaListAlt className="text-green-600 text-4xl mb-4" />
            <h3 className="text-xl font-semibold text-gray-800">User-friendly Reporting Forms</h3>
            <p className="text-gray-600 mt-2">
              Quickly report any disaster by simply selecting the type of disaster from predefined options. It's a seamless and fast process, reducing the time required to report emergencies.
            </p>
          </div>

          {/* Resource Dashboard */}
          <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
            <FaUsers className="text-yellow-600 text-4xl mb-4" />
            <h3 className="text-xl font-semibold text-gray-800">Resource Dashboard</h3>
            <p className="text-gray-600 mt-2">
              Access a dashboard of available resources like food, clothing, and shelter. This platform allows users to contribute resources and request help as needed.
            </p>
          </div>

          {/* Chatbot */}
          <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
            <FaRobot className="text-indigo-600 text-4xl mb-4" />
            <h3 className="text-xl font-semibold text-gray-800">Quick Help Assistant (Chatbot)</h3>
            <p className="text-gray-600 mt-2">
              Our intelligent chatbot can help you find the quickest solutions during emergencies. Get instant responses for your questions and concerns 24/7.
            </p>
          </div>

          {/* Satellite View for Editors */}
          <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
            <FaSatellite className="text-gray-800 text-4xl mb-4" />
            <h3 className="text-xl font-semibold text-gray-800">Satellite View for Editors</h3>
            <p className="text-gray-600 mt-2">
              Editors can monitor disaster locations and track updates using satellite view to ensure real-time accuracy in disaster reports.
            </p>
          </div>

          {/* Editor Dashboard */}
          <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
            <FaUserShield className="text-blue-800 text-4xl mb-4" />
            <h3 className="text-xl font-semibold text-gray-800">Editor Dashboard</h3>
            <p className="text-gray-600 mt-2">
              Editors have the ability to verify and manage incoming reports, approve or cancel them, and view satellite imagery to ensure accurate disaster tracking.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HelpSection;
