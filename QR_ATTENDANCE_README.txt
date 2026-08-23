GYANYUG QR ATTENDANCE - IMPORTANT

The included public/gyanyug-office-attendance-qr.png is a REAL, machine-readable QR.
It encodes:
GYANYUG-OFFICE-ATTENDANCE

It works with the Employee Portal's built-in QR scanner:
Attendance -> Check In -> Scan Office QR.

For scanning directly with a phone's normal camera and opening the Present page, the QR must encode the public URL of the deployed portal:
https://YOUR-COMPANY-DOMAIN/attendance/confirm?code=GYANYUG-OFFICE-ATTENDANCE

The project already contains this Present page route:
 /attendance/confirm

Do not encode localhost for a phone camera QR. After the company gives the final public website domain, regenerate the QR with that exact URL.
