import React, { useState, useEffect } from "react";
import { teacherApi } from "../../api/index";
import { Scanner } from "@yudiel/react-qr-scanner";

const TeacherAttendance = () => {
  const [attendances, setAttendances] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toDateString());
  const [isLoading, setIsLoading] = useState(false);
  const [scanMessage, setScanMessage] = useState("");
  const [isScanning, setIsScanning] = useState(true);

  // Fetch Attendance List whenever the date changes
  const fetchAttendance = async () => {
    setIsLoading(true);
    try {
      // Ensure we pass the date string exactly as stored in DB (toDateString format)
      const res = await teacherApi.getAttendanceList(selectedDate);
      setAttendances(res.data);
    } catch (error) {
      console.error("Failed to fetch attendance:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, [selectedDate]);

  const handleScan = async (text) => {
    if (!isScanning) return;
    
    // Pause scanning immediately so we don't spam the backend
    setIsScanning(false);

    try {
      const res = await teacherApi.markAttendance({ userId: text });
      
      // Clear scan message first to trigger animation
      setScanMessage("");

      if (res.data.message === "Already marked") {
        setScanMessage("Student already marked for today!");
      } else {
        setScanMessage("Attendance marked successfully!");
        // Small delay before refreshing to ensure DB consistency
        setTimeout(() => {
          fetchAttendance();
        }, 500);
      }
    } catch (error) {
      console.error("Error marking attendance", error);
      setScanMessage("Invalid QR Code or Request Failed.");
    } finally {
      // Resume scanning after 2 seconds
      setTimeout(() => {
        setScanMessage("");
        setIsScanning(true);
      }, 2000);
    }
  };

  return (
    <div className="flex flex-col-reverse lg:flex-row gap-6 sm:gap-12 animate-in fade-in slide-in-from-right-8 duration-700">
      {/* Left Side - Attendance Data List */}
      <div className="flex-1 bg-white/60 backdrop-blur-xl p-5 sm:p-10 rounded-[2rem] sm:rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-white/40 overflow-hidden flex flex-col">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-10 gap-4 sm:gap-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#191c1d] tracking-tight">Session Log</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-1">Real-time attendance authentication</p>
          </div>
          <div className="bg-[#f8f9fa] p-4 rounded-2xl border border-slate-100/50 flex flex-col min-w-[200px] group hover:bg-white transition-all">
            <label className="text-[9px] font-black text-[#004276] uppercase tracking-widest mb-1.5 ml-1">Archive Query</label>
            <input
              type="date"
              className="bg-transparent border-none outline-none text-sm font-bold text-[#31444c] cursor-pointer"
              value={new Date(selectedDate).toLocaleDateString('en-CA')}
              onChange={(e) => {
                if (e.target.value) {
                  const newDateString = new Date(e.target.value).toDateString();
                  setSelectedDate(newDateString);
                }
              }}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-4 pt-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-16 bg-[#f8f9fa] rounded-2xl animate-pulse"></div>
            ))}
          </div>
        ) : attendances.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-20 text-slate-300 bg-[#f8f9fa]/50 rounded-[2rem] border border-dashed border-slate-200">
            <span className="text-6xl mb-6 grayscale opacity-20">📅</span>
            <p className="text-sm font-black uppercase tracking-[0.2em]">Zero entries for selected date</p>
            <p className="text-xs font-medium italic mt-2">Initialize capture via optical scanning portal</p>
          </div>
        ) : (
          <div className="overflow-x-auto -mx-5 sm:mx-0">
            <div className="inline-block min-w-full align-middle">
              <div className="overflow-hidden rounded-[1.5rem] sm:rounded-[2rem] border border-slate-50 shadow-sm">
                <table className="min-w-full divide-y divide-slate-50 text-left bg-white">
                  <thead className="bg-[#f8f9fa] text-[#004276]">
                    <tr>
                      <th className="px-4 sm:px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em]">Identity</th>
                      <th className="px-4 sm:px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] hidden md:table-cell">Communication</th>
                      <th className="px-4 sm:px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {attendances.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-4 sm:px-8 py-5">
                          <div className="flex items-center gap-3 sm:gap-4">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-[#f8f9fa] text-slate-400 font-black text-[10px] sm:text-xs flex items-center justify-center shadow-inner group-hover:text-[#004276] transition-colors shrink-0">
                              {(item.userId?.name || "U").charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <p className="font-bold text-[#31444c] capitalize text-xs sm:text-sm truncate">{item.userId?.name || "Unverified Candidate"}</p>
                              <p className="text-[8px] sm:text-[9px] font-black text-slate-300 uppercase tracking-widest leading-none mt-1 truncate">{item.userId?.class || "No Division"}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 sm:px-8 py-5 hidden md:table-cell">
                          <p className="text-xs font-medium text-slate-400 group-hover:text-slate-600 transition-colors truncate">{item.userId?.email || "n/a"}</p>
                        </td>
                        <td className="px-4 sm:px-8 py-5 text-center">
                          <span className="inline-flex items-center gap-1 sm:gap-1.5 px-3 sm:px-4 py-1 sm:py-1.5 bg-[#ecfdf5] text-[#059669] text-[8px] sm:text-[9px] font-black tracking-widest uppercase rounded-full shadow-sm whitespace-nowrap">
                            <span className="w-1 h-1 rounded-full bg-[#059669] animate-pulse"></span>
                            OK
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Right Side - QR Code Scanner */}
      <div className="w-full lg:w-[420px] flex flex-col">
        <div className="bg-white/80 backdrop-blur-xl p-6 sm:p-10 rounded-[2rem] sm:rounded-[2.5rem] shadow-[0_30px_60px_rgba(0,0,0,0.05)] border border-white lg:sticky lg:top-10 flex flex-col items-center">
          <div className="w-16 h-16 bg-[#004276]/5 rounded-[1.5rem] flex items-center justify-center text-3xl mb-6 shadow-inner">📸</div>
          <h2 className="text-2xl font-black text-[#191c1d] tracking-tight mb-2">Optical Gateway</h2>
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.3em] mb-8">Biometric Token Validation</p>
          
          <div className="w-full rounded-[2rem] overflow-hidden shadow-2xl shadow-[#004276]/10 border-4 border-white bg-slate-900 relative aspect-square group">
            <Scanner 
              onScan={(result) => {
                if (result && result[0]) {
                  handleScan(result[0].rawValue);
                }
              }}
              paused={!isScanning}
              components={{
                audio: false,
                video: true,
                onOff: true,
                torch: true,
                tracker: true
              }}
              format={["qr_code"]}
              allowMultiple={true}
              scanDelay={500}
            />

            {!isScanning && (
              <div className="absolute inset-0 bg-[#004276]/60 backdrop-blur-md flex flex-col items-center justify-center z-10 animate-in fade-in duration-300 transition-all">
                <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin mb-4"></div>
                <p className="text-[10px] font-bold text-white uppercase tracking-[0.4em]">Decrypting...</p>
              </div>
            )}
            
            {/* Visual Guide Borders */}
            <div className="absolute inset-8 border-2 border-white/20 rounded-3xl pointer-events-none group-hover:border-white/40 transition-colors"></div>
          </div>
          
          <div className="mt-8 w-full min-h-[50px] flex items-center justify-center">
            {scanMessage && (
              <div className={`w-full py-4 px-6 rounded-2xl animate-in zoom-in-95 duration-300 text-center shadow-lg ${
                scanMessage.includes("successfully") 
                  ? "bg-emerald-500 text-white shadow-emerald-500/20" 
                  : scanMessage.includes("already")
                  ? "bg-[#004276] text-white shadow-[#004276]/20"
                  : "bg-rose-500 text-white shadow-rose-500/20"
              }`}>
                <p className="text-[10px] font-black uppercase tracking-[0.2em]">{scanMessage}</p>
              </div>
            )}
          </div>
          
          <div className="mt-8 pt-8 border-t border-slate-50 w-full space-y-4">
            <div className="flex items-start gap-4 text-slate-400 group/tip">
              <span className="w-5 h-5 rounded-lg bg-slate-50 flex items-center justify-center text-[10px] font-black transition-colors group-hover/tip:bg-[#004276] group-hover/tip:text-white">01</span>
              <p className="text-xs font-medium leading-relaxed">Align student cryptogram within the viewfinder portal.</p>
            </div>
            <div className="flex items-start gap-4 text-slate-400 group/tip">
              <span className="w-5 h-5 rounded-lg bg-slate-50 flex items-center justify-center text-[10px] font-black transition-colors group-hover/tip:bg-[#004276] group-hover/tip:text-white">02</span>
              <p className="text-xs font-medium leading-relaxed">System validates identity and creates a persistent session record.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherAttendance;