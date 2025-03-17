import React from "react";
import { FaEdit, FaCamera } from "react-icons/fa";

const UserProfile = () => {
  // Example user data
  const user = {
    avatar: "https://i.pravatar.cc/150?img=3", // Placeholder image
    firstName: "Juan",
    lastName: "Dela Cruz",
    middleInitial: "C",
    suffix: "Jr.",
    email: "juandelacruz@gmail.com",
    contactNumber: "09347584399",
    facebook: "https://www.figma.com/design/BXl3JL",
    membership: "Gold Member",
    address: {
      houseNumber: "Blk 44 Lt 57",
      street: "San Isidro",
      barangay: "Minuyan",
      city: "Makati",
      province: "None",
    },
  };

  return (
    <div className="h-screen w-full flex justify-center mt-24 md:h-auto overflow-y-auto ">
      <div className="w-full max-w-5xl bg-white shadow-lg rounded-lg overflow-hidden h-full">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-pink-600 to-pink-300 p-10 relative">
          <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-14 w-28 h-28 rounded-full bg-pink border-4 border-gray-200 shadow-md flex justify-center items-center">
            <img
              src={user.avatar}
              alt="User Avatar"
              className="w-24 h-24 rounded-full object-cover"
            />
            <div className="absolute bottom-0 right-0 bg-blue-500 p-2 rounded-full shadow-md cursor-pointer">
              <FaCamera className="text-white text-sm" />
            </div>
          </div>
        </div>

        {/* User Details - Scrollable Content */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Personal Info */}
          <div className="bg-gray-50 p-4 rounded-lg border mt-10">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">
                Personal Information
              </h3>
              <button className="flex items-center gap-2 text-blue-500 hover:text-blue-600">
                <FaEdit />
                Edit
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 text-gray-700">
              <p>
                <span className="font-semibold">First Name:</span>{" "}
                {user.firstName}
              </p>
              <p>
                <span className="font-semibold">Last Name:</span>{" "}
                {user.lastName}
              </p>
              <p>
                <span className="font-semibold">M.I.:</span>{" "}
                {user.middleInitial}
              </p>
              <p>
                <span className="font-semibold">Suffix:</span> {user.suffix}
              </p>
              <p>
                <span className="font-semibold">Email Address:</span>{" "}
                {user.email}
              </p>
              <p>
                <span className="font-semibold">Contact No.:</span>{" "}
                {user.contactNumber}
              </p>
              <p className="col-span-2">
                <span className="font-semibold">Facebook Link:</span>{" "}
                <a
                  href={user.facebook}
                  className="text-blue-500 hover:underline"
                >
                  {user.facebook}
                </a>
              </p>
            </div>
          </div>

          {/* Address Info */}
          <div className="bg-gray-50 p-4 rounded-lg border">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">
                Address Information
              </h3>
              <button className="flex items-center gap-2 text-blue-500 hover:text-blue-600">
                <FaEdit />
                Edit
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 text-gray-700">
              <p>
                <span className="font-semibold">House No.:</span>{" "}
                {user.address.houseNumber}
              </p>
              <p>
                <span className="font-semibold">Street:</span>{" "}
                {user.address.street}
              </p>
              <p>
                <span className="font-semibold">Barangay:</span>{" "}
                {user.address.barangay}
              </p>
              <p>
                <span className="font-semibold">City:</span> {user.address.city}
              </p>
              <p>
                <span className="font-semibold">Province:</span>{" "}
                {user.address.province}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
