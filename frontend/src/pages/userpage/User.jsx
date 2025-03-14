import React, { useEffect, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Outlet, useNavigate } from "react-router-dom";
import { useDepartmentStore } from "../../store/useDepartmentStore";
import { useTicketStore } from "../../store/useTicketStore";

const User = () => {
  const [qrData, setQrData] = useState("No QR code scanned");
  const [scanner, setScanner] = useState(null);
  const [cameras, setCameras] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState(null);
  const [isScanningPhoto, setIsScanningPhoto] = useState(false);
  const [isScannerRunning, setIsScannerRunning] = useState(false);
  const navigate = useNavigate();
  const { setSelectedDepartment } = useDepartmentStore();
  const { setTicketAuth } = useTicketStore();

  useEffect(() => {
    let isMounted = true;

    Html5Qrcode.getCameras()
      .then((devices) => {
        if (isMounted && devices.length > 0) {
          setCameras(devices);

          // Prioritize back camera if available
          const backCamera = devices.find(
            (device) =>
              device.label.toLowerCase().includes("back") ||
              device.label.toLowerCase().includes("environment")
          );

          const defaultCamera = backCamera ? backCamera.id : devices[0].id;
          setSelectedCamera(defaultCamera);

          if (!isScannerRunning) {
            startScanner(defaultCamera);
          }
        }
      })
      .catch((err) => console.error("Camera error:", err));

    return () => {
      isMounted = false;
      stopScanner();
    };
  }, []);

  const startScanner = (cameraId) => {
    if (isScannerRunning || !cameraId) return; // Prevent multiple starts

    stopScanner(); // Stop any previous instance before starting a new one

    const newScanner = new Html5Qrcode("reader");
    newScanner
      .start(
        cameraId,
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        async (decodedText) => {
          const departmentId = decodedText.split("department_id=")[1];
          setQrData(departmentId);
          stopScanner(); // Stop after successful scan

          if (departmentId) {
            await setSelectedDepartment(departmentId);
            navigate(`/ticket`);
          } else {
            alert("Invalid QR Code!");
          }
        },
        (error) => {
          if (!error.message.includes("NotFoundException")) {
            console.log("Scanning Error:", error);
          }
        }
      )
      .then(() => {
        setScanner(newScanner);
        setIsScannerRunning(true);
      })
      .catch((err) => console.error("Scanner start error:", err));
  };

  const stopScanner = () => {
    if (scanner) {
      scanner
        .stop()
        .then(() => {
          scanner.clear();
          setScanner(null);
          setIsScannerRunning(false);
        })
        .catch((err) => console.error("Error stopping scanner:", err));
    }
  };

  const handlePhotoScan = (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsScanningPhoto(true);
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const maxSize = 800;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxSize) {
              height *= maxSize / width;
              width = maxSize;
            }
          } else {
            if (height > maxSize) {
              width *= maxSize / height;
              height = maxSize;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (!blob) {
                console.error("Failed to create Blob from canvas.");
                setIsScanningPhoto(false);
                return;
              }

              const resizedFile = new File([blob], file.name, {
                type: "image/jpeg",
                lastModified: Date.now(),
              });

              const qrCodeScanner = new Html5Qrcode("reader");
              qrCodeScanner
                .scanFile(resizedFile, true)
                .then(async (decodedText) => {
                  const departmentId = decodedText.split("department_id=")[1];
                  setQrData(departmentId);

                  if (departmentId) {
                    // await setTicketAuth(departmentId);
                    await setSelectedDepartment(departmentId).then(() => {
                      localStorage.setItem("departmentId", departmentId);
                      navigate(`/ticket`);
                    });
                    // navigate(`/ticket`);
                  } else {
                    alert("Invalid QR Code!");
                  }
                })
                .catch((err) => {
                  console.error("Error scanning image:", err);
                  setQrData("Failed to scan QR code from image.");
                })
                .finally(() => {
                  setIsScanningPhoto(false);
                });
            },
            "image/jpeg",
            0.9
          );
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-black">
      {/* Camera View */}
      <div id="reader" className="absolute inset-0 w-full"></div>

      {/* Scanned QR Code Result */}
      <div
        className={`absolute top-4 bg-white px-4 py-2 rounded-md shadow-md ${
          qrData !== "No QR code scanned" ? "block" : "hidden"
        }`}
      >
        {qrData}
      </div>

      {/* Floating Buttons */}
      <div className="absolute bottom-8 flex gap-4">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md"
          onClick={() => startScanner(selectedCamera)}
        >
          🔍 Scan Again
        </button>
        <label
          htmlFor="photoScanInput"
          className={`bg-green-600 text-white px-4 py-2 rounded-lg shadow-md cursor-pointer ${
            isScanningPhoto ? "opacity-50" : ""
          }`}
        >
          {isScanningPhoto ? "⏳ Scanning..." : "📷 Scan from Photo"}
        </label>
        <input
          id="photoScanInput"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handlePhotoScan}
          disabled={isScanningPhoto}
        />
      </div>
      <Outlet />
    </div>
  );
};

export default User;
