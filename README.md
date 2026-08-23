# GYANYUG Employee Portal

## Run locally

### Frontend

```bat
cd "C:\Employee portal"
npm install
npm run dev
```

Open `http://localhost:5173`.

### Backend

```bat
cd "C:\Employee portal\server"
npm install
npm run dev
```

Backend runs on `http://localhost:5000`.

## `server/.env`

Create `server/.env` from `server/.env.example`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
FRONTEND_ORIGIN=http://localhost:5173

# Required for signup confirmation emails
EMAIL_USER=your_company_gmail_address
EMAIL_PASS=your_gmail_app_password

# The text encoded inside the official office attendance QR
OFFICE_ATTENDANCE_QR_CODE=GYANYUG-OFFICE-ATTENDANCE
```

For Gmail, use a Google App Password rather than your normal Gmail password.

## Attendance QR

The Attendance page now provides:

- Scan Office QR
- Work From Home
- Check Out
- Real MongoDB attendance history
- Month filtering
- CSV export

The official office QR must encode exactly the value configured in
`OFFICE_ATTENDANCE_QR_CODE`.

## Signup email

After a successful signup, the backend sends a welcome email when
`EMAIL_USER` and `EMAIL_PASS` are configured. If SMTP is not configured,
the account is still created but the API reports that the email could not be sent.

## Tasks

Tasks are stored in MongoDB and scoped to the assigned employee. Employees can mark
their own tasks complete; completed tasks display a green check.

HR/Admin can create tasks through the API.

## Important

Do not commit `server/.env` to GitHub.


## Latest production-oriented updates

- Settings profile photo upload from Gallery or live Camera.
- Profile photo is stored on the authenticated user's MongoDB profile as validated image data.
- Dashboard Attendance summary is loaded from real attendance records and opens a detailed percentage modal.
- Dashboard Pending Tasks summary is loaded from real assigned tasks and opens a detailed pending-work modal.
- Dashboard Today's Tasks is database-backed; no hard-coded task list.
- Completed task action uses a persistent green completion state.
- Profile avatar is reflected in the dashboard header after saving.
- Server JSON body limit supports profile image payloads up to 5 MB; individual profile images are limited to 3 MB.


## Company SSO login

The portal is configured for the company requirement:

- Google Workspace: `@gyanyug.riginnovations.in`
- Microsoft: `@gyanyug.org.in`

Public email/password registration and password login are disabled.

### Required OAuth configuration

Copy `server/.env.example` to `server/.env` and set:

- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GOOGLE_REDIRECT_URI`
- `MICROSOFT_CLIENT_ID`
- `MICROSOFT_CLIENT_SECRET`
- `MICROSOFT_TENANT_ID`
- `MICROSOFT_REDIRECT_URI`

Register these exact local callback URLs with the respective identity providers:

- `http://localhost:5000/api/auth/google/callback`
- `http://localhost:5000/api/auth/microsoft/callback`

The frontend callback is:

- `http://localhost:5173/oauth/callback`

The backend independently checks the returned verified email domain before issuing the Employee Portal JWT.

Important: OAuth cannot work until the company's Google Workspace and Microsoft Entra administrators provide/configure the application credentials and redirect URIs. Do not commit `server/.env` to Git.


## Company handover
See `COMPANY_HANDOVER.md` for the exact OAuth, environment, local launch and production handover checklist.

## Login flow fix

- Microsoft tenant UPNs using `@ext.gyanyug.org.in` are accepted in addition to `@gyanyug.org.in`.
- OAuth completion now navigates directly to `/dashboard` after the application JWT is stored.
- OAuth errors are displayed on the login page instead of silently returning to an identical-looking login screen.


## QR attendance on a phone
The route `/attendance/confirm?code=GYANYUG-OFFICE-ATTENDANCE` opens the phone confirmation page. The employee signs in with Microsoft if needed, chooses Office or Work From Home, enters a required WFH reason, and presses **Present — Check In**.

For a real phone camera QR, deploy the frontend first and generate the company QR using the deployed URL, for example:
`https://YOUR-DOMAIN/attendance/confirm?code=GYANYUG-OFFICE-ATTENDANCE`
Do not use `localhost` in a QR that will be scanned by another phone.


## Admin announcements and task assignment

The portal now includes a protected **Admin Control Center** at `/admin`.

- HR/Admin users can publish announcements; published announcements are stored in MongoDB and shown on the employee dashboard.
- HR/Admin users can assign tasks to authenticated users.
- Employees see only tasks assigned to their own user ID.
- Task status can be changed between `TO DO`, `IN PROGRESS`, `REVIEW`, and `COMPLETED`, and the status is persisted in MongoDB.
- The global header search searches tasks, employees, and announcements.

### Making the first admin

Set this in `server/.env` before the admin's first Microsoft sign-in:

`ADMIN_EMAILS=admin@gyanyug.org.in`

Multiple admin emails can be comma-separated. The server assigns the Admin role when that Microsoft company email signs in. Existing users matching the configured email are promoted to Admin on their next Microsoft sign-in.

Microsoft company login is restricted by the server to `@gyanyug.org.in` and `@ext.gyanyug.org.in`.
