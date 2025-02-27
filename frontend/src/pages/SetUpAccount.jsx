import React, { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";

const SetUpAccount = () => {
  const { signup } = useAuthStore();
  const [formData, setFormData] = useState;

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="">
      <div className="bg-[#61cee2] w-[100%] h-[336px] absolute left-0 top-0 z-[-111]"></div>

      <div className="mx-auto max-w-5xl text-white pt-[60px]">
        <h1 className="font-bold text-3xl">
          Welcome to the City of San Jose Website
        </h1>
        <p className="text-xs">Let’s set up your Account Information.</p>
      </div>

      {/* Card */}
      <div className="mx-auto shadow-custom z-30 flex max-w-5xl flex-wrap items-center gap-6 rounded-xl bg-white p-6 shadow-lg mt-5 outline outline-black/5 dark:bg-slate-800 dark:shadow-none dark:-outline-offset-1 dark:outline-white/10">
        {/* Left Section */}
        <div className="w-full p-6 rounded-lg">
          <form onSubmit={handleSubmit}>
            {/* Personal Info */}
            <div className="text-xl text-black">
              <h1 className="font-bold">Personal Information</h1>
              <div className="border-t border-[#115db6] mt-1 w-full"></div>

              {/* Form */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-10 text-sm">
                {/* First Input */}
                <div>
                  <label className="block text-black ">First Name</label>
                  <input
                    type="text"
                    placeholder="Enter first name"
                    className="w-full rounded-lg border border-gray-300 bg-transparent py-2 px-4 text-black outline-none focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 "
                  />
                </div>

                {/* Second Input */}
                <div>
                  <label className="block font-medium text-black ">
                    Last Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter last name"
                    className="w-full rounded-lg border border-gray-300 bg-transparent py-2 px-4 text-black outline-none focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 "
                  />
                </div>

                {/* Third Input */}
                <div>
                  <label className="block font-medium text-black ">Email</label>
                  <input
                    type="email"
                    placeholder="Enter email"
                    className="w-full rounded-lg border border-gray-300 bg-transparent py-2 px-4 text-black outline-none focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 "
                  />
                </div>

                {/* Fourth Input */}
                <div>
                  <label className="block font-medium text-black ">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="Enter phone number"
                    className="w-full rounded-lg border border-gray-300 bg-transparent py-2 px-4 text-black outline-none focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 "
                  />
                </div>
              </div>
            </div>

            {/* Complete Address Info */}
            <div className="text-xl font-medium text-black mt-10">
              <h1 className="font-bold">Complete Address</h1>
              <div className="border-t border-[#115db6] mt-1 w-full"></div>

              {/* Form */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 text-sm">
                {/* First Input */}
                <div>
                  <label className="block font-medium text-black ">
                    House Number
                  </label>
                  <input
                    type="text"
                    placeholder="Enter first name"
                    className="w-full rounded-lg border border-gray-300 bg-transparent py-2 px-4 text-black outline-none focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 "
                  />
                </div>

                {/* Second Input */}
                <div>
                  <label className="block font-medium text-black ">
                    Street
                  </label>
                  <input
                    type="text"
                    placeholder="Enter last name"
                    className="w-full rounded-lg border border-gray-300 bg-transparent py-2 px-4 text-black outline-none focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 "
                  />
                </div>

                {/* Third Input */}
                <div>
                  <label className="block font-medium text-black ">
                    Barangay
                  </label>
                  <input
                    type="text"
                    placeholder="Enter email"
                    className="w-full rounded-lg border border-gray-300 bg-transparent py-2 px-4 text-black outline-none focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 "
                  />
                </div>

                {/* Fourth Input */}
                <div>
                  <label className="block font-medium text-black ">City</label>
                  <input
                    type="tel"
                    placeholder="Enter phone number"
                    className="w-full rounded-lg border border-gray-300 bg-transparent py-2 px-4 text-black outline-none focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 "
                  />
                </div>
                {/* Fifth Input */}
                <div>
                  <label className="block font-medium text-black ">
                    Province
                  </label>
                  <input
                    type="text"
                    placeholder="Enter phone number"
                    className="w-full rounded-lg border border-gray-300 bg-transparent py-2 px-4 text-black outline-none focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 "
                  />
                </div>
              </div>
            </div>

            {/* <button
              type="submit"
              className="btn btn-primary w-full text-primary"
            >
              Save and Continue
            </button> */}

            <div className=" flex justify-end m-10">
              <button className="btn btn-primary">Save and Continue</button>
            </div>
          </form>
        </div>

        {/* Logo Section */}
        <img
          className="size-5 shrink-0"
          src="/img/logo.svg"
          alt="ChitChat Logo"
        />
      </div>
    </div>
  );
};

export default SetUpAccount;
