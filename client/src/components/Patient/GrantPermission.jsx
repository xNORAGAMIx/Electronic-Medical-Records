import React from 'react'

const GrantPermission = () => {
  return (
    <div>
        {/* Grant Permission Button */}
        <button
              onClick={toggleModal}
              className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition cursor-pointer duration-300"
            >
              Grant Permission
            </button>

            {/* Modal for Granting Permission */}
            {isModalOpen && (
              <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50 backdrop-blur-lg">
                <div className="bg-white p-8 rounded-xl w-full max-w-xl space-y-6 shadow-xl">
                  <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                    Grant Permission
                  </h3>
                  <form onSubmit={handleShare}>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label
                          className="text-sm font-medium text-gray-600"
                          htmlFor="name"
                        >
                          Address
                        </label>
                        <input
                          value={address}
                          type="text"
                          id="name"
                          onChange={(e) => setAddress(e.target.value)}
                          className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <label
                          className="text-sm font-medium text-gray-600"
                          htmlFor="email"
                        >
                          Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <select
                        id="selectNumber"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option>People With Access</option>
                        {addressList.map((opt, index) => (
                          <option key={index} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>

                      <div className="flex justify-end space-x-4">
                        <button
                          type="button"
                          onClick={toggleModal}
                          className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                        >
                          Submit
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            )}
    </div>
  )
}

export default GrantPermission