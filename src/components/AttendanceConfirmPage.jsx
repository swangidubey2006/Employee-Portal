import React, { useState } from "react";
import { CheckCircle2, Home, Building2, Loader2 } from "lucide-react";
import { attendanceApi } from "../services/api.js";

const AttendanceConfirmPage = () => {
  const [mode, setMode] = useState("Office");
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const code = new URLSearchParams(window.location.search).get("code") || "GYANYUG-OFFICE-ATTENDANCE";
  const token = localStorage.getItem("token");

  const signIn = () => {
    sessionStorage.setItem("postLoginPath", window.location.pathname + window.location.search);
    const api = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "");
    window.location.assign(`${api}/api/auth/microsoft`);
  };

  const confirm = async () => {
    if (mode === "Home" && !reason.trim()) {
      setMessage("Please enter your Work From Home reason first.");
      return;
    }
    try {
      setLoading(true); setMessage("");
      const res = await attendanceApi.checkIn({ workMode: mode, reason: reason.trim(), scanCode: code });
      if (res.success) {
        setMessage(`Attendance confirmed. Checked in at ${res.data.checkInTime}. You can close this page.`);
      }
    } catch (e) {
      setMessage(e.message || "Unable to confirm attendance.");
    } finally { setLoading(false); }
  };

  return <main className="attendance-phone-page">
    <section className="attendance-phone-card">
      <img src="/gyanyug-logo.png" alt="GYANYUG" className="gyanyug-exact-logo" />
      <span className="attendance-modal-eyebrow">QR ATTENDANCE</span>
      <h1>Confirm your attendance</h1>
      <p>Choose how you are working today, then confirm your check-in.</p>
      {!token ? <>
        <p className="attendance-scanner-error">Please sign in with your authorized Microsoft account to continue.</p>
        <button className="btn-action-save attendance-confirm-btn" onClick={signIn}>Continue with Microsoft</button>
      </> : <>
        <div className="attendance-checkin-options">
          <button className={`attendance-checkin-option ${mode==="Office"?"selected":""}`} onClick={()=>setMode("Office")}><Building2 size={22}/><span><strong>Office</strong><small>Working from office</small></span></button>
          <button className={`attendance-checkin-option ${mode==="Home"?"selected":""}`} onClick={()=>setMode("Home")}><Home size={22}/><span><strong>Work From Home</strong><small>Reason required</small></span></button>
        </div>
        {mode==="Home" && <textarea className="leave-custom-textarea" rows="4" value={reason} onChange={e=>setReason(e.target.value)} placeholder="Why are you working from home today?" />}
        <button className="btn-action-save attendance-confirm-btn" disabled={loading} onClick={confirm}>
          {loading ? <Loader2 size={18} className="spin"/> : <CheckCircle2 size={18}/>} {loading ? "Confirming..." : "Present — Check In"}
        </button>
        {message && <p className={message.startsWith("Attendance confirmed") ? "attendance-confirm-success" : "attendance-scanner-error"}>{message}</p>}
      </>}
    </section>
  </main>;
};
export default AttendanceConfirmPage;
