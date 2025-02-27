// frontend/src/components/QRCodeGenerator.js
import React, { useState } from "react";
// import axios from "axios";

const QRCodeGenerator = () => {
  const [error, setError] = useState("");

  // const handleGenerateQR = async () => {
  //   try {
  //     // const response = await axios.get(
  //     //   `http://localhost:5000/api/qr/generate-qr/${departmentId}`
  //     // );
  //     setQrCodeUrl(response.data.qrCodeUrl);
  //     setError(""); // Reset error if successful
  //   } catch (err) {
  //     setError("Error generating QR code");
  //     console.error(err);
  //   }
  // };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold text-center mb-6">
        Generate QR Code
      </h2>
      <div className="mb-4">
        <label
          htmlFor="departmentId"
          className="block text-lg font-medium mb-2"
        >
          Department ID:
        </label>
        <input
          type="text"
          id="departmentId"
          // value={departmentId}
          // onChange={(e) => setDepartmentId(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter Department ID"
        />
      </div>
      <button
        // onClick={handleGenerateQR}
        className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-300"
      >
        Generate QR Code
      </button>

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

      {true && (
        <div className="mt-6 text-center">
          <h3 className="text-xl font-medium">QR Code:</h3>
          <img src={true} alt="QR Code" className="mt-4 mx-auto rounded-lg" />
        </div>
      )}
    </div>
  );
};

// const [departmentId, setDepartmentId] = useState("");
// const [qrCodeUrl, setQrCodeUrl] = useState("");
// const [error, setError] = useState("");

//   return (
//     <div className="qr-code-container">
//       <h2>Generate QR Code</h2>
//       <div>
//         <label htmlFor="departmentId">Department ID: </label>
//         <input
//           type="text"
//           id="departmentId"
//           value={departmentId}
//           onChange={(e) => setDepartmentId(e.target.value)}
//         />
//       </div>
//       <button onClick={handleGenerateQR}>Generate QR Code</button>

//       {error && <p style={{ color: "red" }}>{error}</p>}

//       {qrCodeUrl && (
//         <div>
//           <h3>QR Code:</h3>
//           <img src={qrCodeUrl} alt="QR Code" />
//         </div>
//       )}
//     </div>
//   );
// };

export default QRCodeGenerator;
