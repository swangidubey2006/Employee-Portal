import React, { useEffect, useRef, useState } from 'react';
import { Home, QrCode, X, Loader2, ArrowLeft } from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';

const AttendanceCheckInModal = ({ onClose, onCheckIn, loading }) => {
  const [mode, setMode] = useState(null);
  const [scanError, setScanError] = useState('');
  const [wfhReason, setWfhReason] = useState('');
  const scannerRef = useRef(null);

  useEffect(() => {
    let scanner;
    const startScanner = async () => {
      if (mode !== 'office-scan' && mode !== 'home-scan') return;
      try {
        setScanError('');
        scanner = new Html5Qrcode('employee-portal-qr-reader');
        scannerRef.current = scanner;
        await scanner.start({ facingMode: 'environment' }, { fps: 10, qrbox: { width: 230, height: 230 }, aspectRatio: 1 },
          async (decodedText) => {
            try { await scanner.stop(); } catch (_) {}
            scannerRef.current = null;
            await onCheckIn({
              workMode: mode === 'home-scan' ? 'Home' : 'Office',
              scanCode: decodedText.trim(),
              reason: mode === 'home-scan' ? wfhReason.trim() : '',
            });
          }, () => {});
      } catch (error) {
        console.error('QR scanner error:', error);
        setScanError('Camera could not be started. Allow camera access in your browser and try again.');
      }
    };
    startScanner();
    return () => {
      if (scannerRef.current) scannerRef.current.stop().catch(()=>{}).finally(()=>{scannerRef.current?.clear?.().catch?.(()=>{}); scannerRef.current=null;});
    };
  }, [mode, onCheckIn, wfhReason]);

  const continueWfh = () => {
    if (!wfhReason.trim()) { setScanError('Please enter your Work From Home reason first.'); return; }
    setScanError(''); setMode('home-scan');
  };

  return <div className="attendance-modal-backdrop" onClick={onClose}>
    <div className="attendance-checkin-modal" onClick={e=>e.stopPropagation()}>
      <div className="attendance-modal-header">
        <div><span className="attendance-modal-eyebrow">ATTENDANCE</span><h3>How are you checking in?</h3><p>Select your attendance method for today.</p></div>
        <button className="attendance-modal-close" onClick={onClose} aria-label="Close"><X size={18}/></button>
      </div>

      {!mode && <div className="attendance-checkin-options">
        <button className="attendance-checkin-option" onClick={()=>setMode('office-scan')} disabled={loading}>
          <span className="attendance-option-icon scan"><QrCode size={25}/></span><span><strong>Scan Office QR</strong><small>Scan the official GYANYUG office code.</small></span>
        </button>
        <button className="attendance-checkin-option" onClick={()=>setMode('home-reason')} disabled={loading}>
          <span className="attendance-option-icon home"><Home size={25}/></span><span><strong>Work From Home</strong><small>Add a reason, then verify with QR.</small></span>
        </button>
      </div>}

      {mode === 'home-reason' && <div className="attendance-scanner-view">
        <label className="input-label-sm" htmlFor="wfh-reason">Reason for Work From Home</label>
        <textarea id="wfh-reason" className="leave-custom-textarea" rows="4" placeholder="Example: Working remotely due to scheduled client work..." value={wfhReason} onChange={e=>setWfhReason(e.target.value)} autoFocus />
        {scanError && <p className="attendance-scanner-error">{scanError}</p>}
        <div className="camera-modal-actions">
          <button type="button" className="btn-action-cancel" onClick={()=>{setScanError('');setMode(null)}}><ArrowLeft size={15}/> Back</button>
          <button type="button" className="btn-action-save" onClick={continueWfh}>Continue to Scan</button>
        </div>
      </div>}

      {(mode === 'office-scan' || mode === 'home-scan') && <div className="attendance-scanner-view">
        <div id="employee-portal-qr-reader"/>
        {scanError && <p className="attendance-scanner-error">{scanError}</p>}
        <p className="attendance-scanner-help">{mode === 'home-scan' ? 'Scan the verification QR after submitting your WFH reason.' : 'Point your camera at the official GYANYUG attendance QR code.'}</p>
        <button className="attendance-back-option" onClick={()=>{setScanError('');setMode(mode==='home-scan'?'home-reason':null)}} disabled={loading}>Choose another method</button>
      </div>}
      {loading && <div className="attendance-loading-overlay"><Loader2 className="spin" size={20}/> Checking in...</div>}
    </div>
  </div>;
};
export default AttendanceCheckInModal;
