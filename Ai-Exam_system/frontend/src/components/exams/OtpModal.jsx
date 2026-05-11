import React, { useState } from "react";
import { useNavigate } from "react-router";
import { examApi } from "../../api/index";

const OtpModal = ({ exam, onClose }) => {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleVerify = async () => {
    if (!otp) {
      setError("Please enter the OTP");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await examApi.verifyOtp({
        examId: exam._id,
        otp,
      });

      // We expect the backend to return success/accessGranted
      if (res.data.accessGranted || res.status === 200) {
        navigate(`/exam/${exam._id}`);
      } else {
        setError("Invalid OTP. Try again.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP or Server Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Security Check</h3>
        <p className="text-gray-500 text-sm mb-6">
          Enter the OTP to access the "{exam.title}" exam.
        </p>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4">
            {error}
          </div>
        )}

        <div className="mb-6">
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP Code"
            className="w-full text-center text-2xl tracking-widest px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            maxLength={6}
          />
        </div>

        <div className="flex gap-3">
          <button 
            onClick={onClose}
            className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
            disabled={loading}
          >
            Cancel
          </button>
          <button 
            onClick={handleVerify}
            className="flex-1 py-3 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex justify-center items-center"
            disabled={loading}
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              "Verify"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OtpModal;