import React, { useEffect, useState } from "react";
import { examApi, paymentApi, API_ROOT_URL } from "../../api/index";

const PaymentItem = ({ exam }) => {
  const [paymentStatus, setPaymentStatus] = useState(exam.paymentStatus || 'pending');
  const [receiptPaymentId, setReceiptPaymentId] = useState(exam.paymentId || null);
  const [receiptUrl, setReceiptUrl] = useState(exam.receiptUrl || null);

  const handleDownloadReceipt = async () => {
    if (receiptUrl) {
      window.open(receiptUrl, "_blank");
      return;
    }
    if (!receiptPaymentId) return;
    try {
      const res = await paymentApi.getReceipt(receiptPaymentId);
      if (res.data.success && res.data.receiptUrl) {
        window.open(res.data.receiptUrl, "_blank");
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
  key: res.data.key_id,
  amount: res.data.order.amount,
  currency: "INR",
  order_id: res.data.order.id,

  name: "Exam System",
  description: `Payment for ${exam.title || "Exam"}`,

  handler: async function (response) {
    try {
      const verifyRes = await paymentApi.verifyPayment({
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_order_id: response.razorpay_order_id,
          razorpay_signature: response.razorpay_signature,
          examId: exam._id
      });

      if (verifyRes.data.success) {
        setPaymentStatus("paid");
        setReceiptPaymentId(verifyRes.data.paymentId);

        alert("Payment Successful");

        if (verifyRes.data.receiptUrl) {
          setReceiptUrl(verifyRes.data.receiptUrl);
          window.open(verifyRes.data.receiptUrl, "_blank");
        }
      }
    } catch (err) {
      console.error("Verification error", err);
    }
  },

  modal: {
    ondismiss: function () {
      alert("Payment cancelled");
    }
  },

  prefill: {
    name: "Test User"
  },

  theme: {
    color: "#3399cc"
  },

  method: {
    upi: true,
    card: false,        // ❗ disable card (fix your issue)
    netbanking: false,
    wallet: true
  }
};
        const rzp1 = new window.Razorpay(options);
        rzp1.open();
      }
    } catch (error) {
      console.error("Payment Error", error);
    }
  };

  return (
    <div className="p-4 sm:p-6 border border-gray-200 rounded-xl bg-white hover:border-blue-300 hover:shadow-md transition-all duration-200 flex flex-col gap-4">
      <div>
        <h4 className="text-lg sm:text-xl font-bold text-gray-800">{exam.title || "Untitled Exam"}</h4>
        <div className="flex flex-wrap items-center gap-3 mt-2 text-sm font-medium">
          <span className="bg-gray-50 text-gray-700 px-3 py-1.5 rounded-lg border border-gray-200">
            Fee: ₹100
          </span>
        </div>
        <p className="text-gray-500 mt-2 text-sm line-clamp-2">
          {exam.description || "Required fee payment to access this exam."}
        </p>
      </div>

      {paymentStatus === 'pending' ? (
        <button
          onClick={handlePayment}
          className="w-full sm:w-auto self-start px-8 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 hover:shadow-lg font-semibold transition-all active:scale-95 text-center"
        >
          Pay ₹100
        </button>
      ) : (
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handlePayment}
            className="px-8 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 font-semibold transition-all active:scale-95"
          >
            Pay ₹100
          </button>
          <span className="px-5 py-2 bg-green-100 text-green-800 rounded-lg font-semibold border border-green-200 flex items-center gap-2">
            <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            Paid
          </span>
          {(receiptPaymentId || receiptUrl) && (
            <button
              onClick={handleDownloadReceipt}
              className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg font-semibold border border-blue-200 hover:bg-blue-100 transition-colors shadow-sm"
              aria-label="Download payment receipt"
            >
              <span className="material-symbols-outlined text-base">download</span>
              Receipt
            </button>
          )}
        </div>
      )}
    </div>
  );
};

const StudentPayment = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    const fetchExams = async () => {
       try {
         const res = await examApi.getAllExams();
         const fetchedExams = Array.isArray(res.data) ? res.data : res.data.exams || [];
         setExams(fetchedExams);
       } catch (err) {
         console.error(err);
         setError("Failed to fetch exams. Please check your connection or login again.");
       } finally {
         setLoading(false);
       }
    };
    fetchExams();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-gray-500">
        <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
        <p className="font-medium animate-pulse">Loading fees...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 border border-red-200 rounded-lg text-center font-medium my-4">
        {error}
      </div>
    );
  }

  if (exams.length === 0) {
    return (
      <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl p-12 text-center">
        <h3 className="text-lg font-bold text-gray-700 mb-1">No Exams Found</h3>
        <p className="text-gray-500 text-sm max-w-md mx-auto">
          You don't have any pending or available exams to pay for right now.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 sm:p-8 mt-4 sm:mt-6">
      <div className="flex justify-between items-center mb-5 border-b pb-4">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-800">Fee Payment</h3>
      </div>
      <div className="space-y-4">
        {exams.map((exam) => (
          <PaymentItem key={exam._id} exam={exam} />
        ))}
      </div>
    </div>
  );
};

export default StudentPayment;
