import React from 'react';
import { QRCodeSVG } from "qrcode.react";

function StudentQR({ user }) {
  if (!user) return null;

  return (
    <div className="flex flex-col items-center justify-center p-6 w-full">
      {/* ID Card Container */}
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200 transition-transform hover:scale-[1.02]">
        
        {/* Card Header */}
        <div className="bg-blue-600 px-6 py-5 text-center">
          <h2 className="text-2xl font-bold text-white uppercase tracking-widest">
            Student ID
          </h2>
          <p className="text-blue-200 text-sm mt-1">Official Attendance Card</p>
        </div>
        
        {/* Card Body */}
        <div className="px-6 py-8 flex flex-col items-center bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
          
          {/* User Details */}
          <div className="text-center mb-8 w-full">
            <h3 className="text-2xl font-extrabold text-gray-800 capitalize">
              {user.name || "Student Name"}
            </h3>
            <p className="text-sm font-medium text-gray-500 mt-1">
              {user.email || "student@example.com"}
            </p>
            
            {user.class && (
              <div className="mt-4 inline-block px-5 py-1.5 bg-blue-50 border border-blue-100 text-blue-700 rounded-full text-sm font-bold shadow-sm">
                Class: {user.class}
              </div>
            )}
          </div>
          
          {/* QR Code Section */}
          <div className="p-4 bg-white rounded-2xl shadow-inner border border-gray-100">
            <QRCodeSVG 
              value={user._id} 
              size={180} 
              level="H" // High error correction so it scans easily even if slightly covered
              className="mx-auto"
            />
          </div>
          
          <p className="text-xs font-semibold text-gray-400 mt-5 text-center tracking-wide">
            SCAN TO MARK ATTENDANCE
          </p>
        </div>
        
        {/* Card Footer */}
        <div className="bg-gray-50 px-6 py-4 text-center border-t border-gray-200">
          <p className="text-xs text-gray-500 font-bold tracking-wider">
            EXAMISYSTEM
          </p>
        </div>
        
      </div>
    </div>
  );
}

export default StudentQR;