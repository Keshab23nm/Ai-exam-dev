import React, { useState } from "react";
import { examApi, paymentApi, API_ROOT_URL } from "../../api/index";
import OtpModal from "./OtpModal";

const ExamItem = ({ exam }) => {
  const [open, setOpen] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(exam.paymentStatus || 'pending'); // 'pending', 'paid', 'otp-generated'
  const [receiptPaymentId, setReceiptPaymentId] = useState(exam.paymentId || null);

  const handleDownloadReceipt = async () => {
    if (!receiptPaymentId) return;
    try {
      const res = await paymentApi.getReceipt(receiptPaymentId);
      if (res.data.success && res.data.receiptUrl) {
        window.open(API_ROOT_URL + res.data.receiptUrl, "_blank");
      }
    } catch (error) {
      console.error("Error downloading receipt:", error);
    }
  };

  const handlePayment = async () => {
    try {
      const res = await paymentApi.createOrder({ examId: exam._id, amount: 100 });
      if (res.data.success) {
        const options = {
          key: res.data.key_id, // Fetching the dynamic key from backend order!
          amount: res.data.order.amount,
          currency: "INR",
          name: "Exam fee",
          description: `Payment for ${exam.title || 'Exam'}`,
          order_id: res.data.order.id,
          handler: async function (response) {
            const data = {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              examId: exam._id
            };
            const verifyRes = await paymentApi.verifyPayment(data);
            if (verifyRes.data.success) {
              setPaymentStatus('paid');
              if (verifyRes.data.paymentId) {
                setReceiptPaymentId(verifyRes.data.paymentId);
              }
            }
          },
          theme: { color: "#3399cc" }
        };
        const rzp1 = new window.Razorpay(options);
        rzp1.open();
      }
    } catch (error) {
      console.error("Payment Error", error);
    }
  };

  const handleGenerateOtp = async () => {
    try {
      const res = await paymentApi.generateOtp({ examId: exam._id });
      if (res.data.success) {
        setPaymentStatus('otp-generated');
        alert("OTP Generated successfully!");
      }
    } catch (error) {
       console.error("OTP Error", error);
    }
  };

  return (
    <>
      <div className="p-6 border border-gray-200 rounded-xl bg-white hover:border-blue-300 hover:shadow-md transition-all duration-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h4 className="text-xl font-bold text-gray-800">{exam.title || "Untitled Exam"}</h4>
          <div className="flex flex-wrap items-center gap-3 mt-3 text-sm font-medium">
            <span className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg border border-blue-100 flex items-center gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {exam.duration || "N/A"} Minutes
            </span>
            <span className="bg-gray-50 text-gray-700 px-3 py-1.5 rounded-lg border border-gray-200">
              Pass Marks: {exam.passingMarks || "N/A"}
            </span>
          </div>
          <p className="text-gray-500 mt-2 text-sm line-clamp-2 max-w-lg">
             {exam.description || "No description provided for this exam. Make sure you are ready before proceeding."}
          </p>
        </div>
        
        {paymentStatus === 'pending' ? (
          <div className="flex flex-col items-center gap-2 mt-4 md:mt-0">
            <button 
              disabled
              className="px-8 py-3 bg-red-600 text-white rounded-xl opacity-75 cursor-not-allowed font-semibold w-full whitespace-nowrap"
            >
              Start Exam
            </button>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row items-center gap-3 mt-4 md:mt-0">
            <button 
              onClick={async () => {
                if (paymentStatus === 'paid') {
                  await handleGenerateOtp();
                }
                setOpen(true);
              }}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 hover:shadow-lg font-semibold transition-all transform hover:-translate-y-0.5 w-full md:w-auto whitespace-nowrap h-full"
            >
              Start Exam
            </button>
          </div>
        )}
      </div>

      {open && <OtpModal exam={exam} onClose={() => setOpen(false)} />}
    </>
  );
};

export default ExamItem;