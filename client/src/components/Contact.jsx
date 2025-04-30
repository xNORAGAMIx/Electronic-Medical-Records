import React from "react";

const Contact = () => {
  return (
    <div className="flex-1 max-w-4xl mx-auto py-10 px-4">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 p-6 text-white">
          <h2 className="text-2xl font-semibold">Contact Us</h2>
          <p className="text-indigo-100 mt-1">We&apos;d love to hear from you.</p>
        </div>

        {/* Body */}
        <div className="p-6 grid md:grid-cols-2 gap-8">
          {/* Contact Form */}
          <form className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Your full name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Message
              </label>
              <textarea
                rows="4"
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Write your message here..."
              ></textarea>
            </div>
            <button
              type="submit"
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-200 shadow-sm"
            >
              Send Message
            </button>
          </form>

          {/* Contact Info */}
          <div className="flex flex-col justify-center space-y-5">
            <div className="flex items-start space-x-4">
              <span className="text-indigo-600 text-2xl">📧</span>
              <div>
                <p className="font-medium text-gray-700">Email</p>
                <p className="text-gray-500">support@emrapp.com</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <span className="text-indigo-600 text-2xl">📞</span>
              <div>
                <p className="font-medium text-gray-700">Phone</p>
                <p className="text-gray-500">+91 98765 43210</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <span className="text-indigo-600 text-2xl">📍</span>
              <div>
                <p className="font-medium text-gray-700">Address</p>
                <p className="text-gray-500">
                  EMR HQ, 2nd Floor, HealthTech Tower,
                  <br />
                  New Delhi, India - 110001
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
