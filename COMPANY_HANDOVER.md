# GYANYUG Employee Portal — Handover & Launch Checklist

## 1. Required identity-provider configuration

### Microsoft Entra ID
Create/register the web application in the GYANYUG tenant and provide these values in `server/.env`:

- `MICROSOFT_CLIENT_ID`
- `MICROSOFT_CLIENT_SECRET`
- `MICROSOFT_TENANT_ID`
- `MICROSOFT_REDIRECT_URI=http://localhost:5000/api/auth/microsoft/callback`

The portal accepts authorized Microsoft accounts using `@gyanyug.org.in` or the organization's `@ext.gyanyug.org.in` UPN form shown by Microsoft for this tenant.

### Google Workspace
Create the OAuth web client in the GYANYUG Google Workspace project and provide:

- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GOOGLE_REDIRECT_URI=http://localhost:5000/api/auth/google/callback`

The portal only accepts the `@gyanyug.riginnovations.in` Google account domain.

## 2. Environment files

### Frontend: `.env`
```env
VITE_API_URL=http://localhost:5000
```

### Backend: `server/.env`
Copy `server/.env.example` and fill the real values:

```env
PORT=5000
MONGO_URI=YOUR_MONGODB_CONNECTION_STRING
JWT_SECRET=YOUR_LONG_RANDOM_SECRET
FRONTEND_ORIGIN=http://localhost:5173
BACKEND_ORIGIN=http://localhost:5000

GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET=YOUR_GOOGLE_CLIENT_SECRET
GOOGLE_REDIRECT_URI=http://localhost:5000/api/auth/google/callback

MICROSOFT_CLIENT_ID=YOUR_MICROSOFT_CLIENT_ID
MICROSOFT_CLIENT_SECRET=YOUR_MICROSOFT_CLIENT_SECRET
MICROSOFT_TENANT_ID=YOUR_MICROSOFT_TENANT_ID
MICROSOFT_REDIRECT_URI=http://localhost:5000/api/auth/microsoft/callback

EMAIL_USER=YOUR_COMPANY_EMAIL
EMAIL_PASS=YOUR_GMAIL_APP_PASSWORD

OFFICE_ATTENDANCE_QR_CODE=GYANYUG-OFFICE-ATTENDANCE
```

Never commit `server/.env`.

## 3. Start the portal

Terminal 1:
```bat
cd server
npm install
npm start
```

The backend must show:
```text
MongoDB connected successfully
Server running on http://localhost:5000
```

Terminal 2:
```bat
npm install
npm run dev
```

Open exactly:
```text
http://localhost:5173
```

Vite is configured with `strictPort: true` so it will NOT silently move to another port and break OAuth redirects.

## 4. Login flow

Microsoft:
`Login → Microsoft → company account → /oauth/callback → dashboard`

Google:
`Login → Google Workspace → company account → /oauth/callback → dashboard`

Personal accounts are rejected by the backend domain check.

## 5. Functional modules

- Dashboard: live attendance/task summary from MongoDB
- Attendance: Office QR check-in, Home check-in, checkout and history
- Leave Management: submit and view leave requests
- My Tasks: search, status updates and completion state
- Documents: authenticated document list and downloads
- Employee Directory: database-backed directory; adding employees is restricted to HR/Admin
- Settings: profile edits and gallery/camera profile photo
- Logout: clears the local application session

## 6. Important launch note

This package is application-ready, but production deployment still requires:
1. A real HTTPS frontend URL.
2. A real HTTPS backend URL.
3. Production OAuth redirect URIs added to Google and Entra.
4. Production environment secrets.
5. MongoDB network/IP access configured for the production server.


## Final functional checks added
- Microsoft-only sign-in path is used by the login page.
- OAuth callback now respects a saved post-login route before falling back to Dashboard.
- Settings route remains protected and is included in the main router.
- QR phone confirmation page: `/attendance/confirm`.
- Office and Work From Home confirmation both call the same protected attendance API.
- Work From Home requires a non-empty reason on both frontend and backend.
- Calendar component has previous/next month state navigation.
- Dashboard Apply Leave navigates to Leave Management and Get Report exports attendance CSV.
- Additional dark-theme coverage was added for profile/settings cards and modals.


## Final logo update
The supplied exact GYANYUG logo image has been installed as `public/gyanyug-logo.png`. Existing UI references use this shared asset.
