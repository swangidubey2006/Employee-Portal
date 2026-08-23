const express = require("express");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");
const { sendWelcomeEmail } = require("../emailService");

const router = express.Router();

const MICROSOFT_DOMAINS = [
  "@gyanyug.org.in",
  "@ext.gyanyug.org.in",
];
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "http://localhost:5173";
const BACKEND_ORIGIN = process.env.BACKEND_ORIGIN || "http://localhost:5000";

const ADMIN_EMAILS = String(process.env.ADMIN_EMAILS || "")
  .split(",")
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean);

const getRoleForEmail = (email, currentRole = "Employee") => {
  return ADMIN_EMAILS.includes(String(email).toLowerCase().trim()) ? "Admin" : currentRole;
};

const isAllowedEmail = (email, provider) => {
  const normalized = String(email || "").toLowerCase().trim();
  if (provider === "microsoft") {
    return MICROSOFT_DOMAINS.some((domain) => normalized.endsWith(domain));
  }
  return false;
};

const signAccessToken = (user) => jwt.sign(
  {
    id: user._id,
    email: user.email,
    fullName: user.fullName,
    role: user.role,
    department: user.department,
    designation: user.designation,
  },
  process.env.JWT_SECRET,
  { expiresIn: "7d" }
);

const signOAuthTicket = (user) => jwt.sign(
  { purpose: "oauth-ticket", userId: user._id.toString() },
  process.env.JWT_SECRET,
  { expiresIn: "60s" }
);

const safeUser = (user) => ({
  id: user._id,
  fullName: user.fullName,
  email: user.email,
  role: user.role,
  department: user.department,
  designation: user.designation,
  avatarData: user.avatarData || "",
  authProvider: user.authProvider,
});

// Microsoft OAuth start
router.get("/microsoft", (req, res) => {
  const {
    MICROSOFT_CLIENT_ID,
    MICROSOFT_TENANT_ID = "common",
    MICROSOFT_REDIRECT_URI = `${BACKEND_ORIGIN}/api/auth/microsoft/callback`,
  } = process.env;

  if (!MICROSOFT_CLIENT_ID) {
    return res.status(503).send("Microsoft sign-in is not configured on the server.");
  }

  const state = jwt.sign({ purpose: "microsoft-oauth-state", nonce: crypto.randomBytes(16).toString("hex") }, process.env.JWT_SECRET, { expiresIn: "5m" });
  const params = new URLSearchParams({
    client_id: MICROSOFT_CLIENT_ID,
    response_type: "code",
    redirect_uri: MICROSOFT_REDIRECT_URI,
    response_mode: "query",
    scope: "openid profile email User.Read",
    prompt: "select_account",
    state,
  });

  res.redirect(
    `https://login.microsoftonline.com/${encodeURIComponent(MICROSOFT_TENANT_ID)}/oauth2/v2.0/authorize?${params.toString()}`
  );
});

// Microsoft callback
router.get("/microsoft/callback", async (req, res) => {
  try {
    const { code, error, state } = req.query;
    if (error || !code || !state) {
      return res.redirect(`${FRONTEND_ORIGIN}/login?error=${encodeURIComponent("Microsoft sign-in was cancelled or failed.")}`);
    }

    try {
      const statePayload = jwt.verify(state, process.env.JWT_SECRET);
      if (statePayload.purpose !== "microsoft-oauth-state") throw new Error("Invalid OAuth state");
    } catch {
      return res.redirect(`${FRONTEND_ORIGIN}/login?error=${encodeURIComponent("Invalid Microsoft sign-in request. Please try again.")}`);
    }

    const {
      MICROSOFT_CLIENT_ID,
      MICROSOFT_CLIENT_SECRET,
      MICROSOFT_TENANT_ID = "common",
      MICROSOFT_REDIRECT_URI = `${BACKEND_ORIGIN}/api/auth/microsoft/callback`,
    } = process.env;

    if (!MICROSOFT_CLIENT_ID || !MICROSOFT_CLIENT_SECRET) {
      return res.redirect(`${FRONTEND_ORIGIN}/login?error=${encodeURIComponent("Microsoft sign-in is not configured.")}`);
    }

    const tokenResponse = await fetch(
      `https://login.microsoftonline.com/${encodeURIComponent(MICROSOFT_TENANT_ID)}/oauth2/v2.0/token`,
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_id: MICROSOFT_CLIENT_ID,
          client_secret: MICROSOFT_CLIENT_SECRET,
          code,
          redirect_uri: MICROSOFT_REDIRECT_URI,
          grant_type: "authorization_code",
          scope: "openid profile email User.Read",
        }),
      }
    );

    const tokenData = await tokenResponse.json();
    if (!tokenResponse.ok || !tokenData.access_token) {
      throw new Error(tokenData.error_description || "Microsoft token exchange failed.");
    }

    const profileResponse = await fetch("https://graph.microsoft.com/v1.0/me?$select=id,displayName,mail,userPrincipalName", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const profile = await profileResponse.json();

    const email = String(profile.mail || profile.userPrincipalName || "").toLowerCase().trim();

    if (!email || !isAllowedEmail(email, "microsoft")) {
      return res.redirect(`${FRONTEND_ORIGIN}/login?error=${encodeURIComponent("Only authorized GYANYUG Microsoft accounts are allowed (@gyanyug.org.in or @ext.gyanyug.org.in).")}`);
    }

    const user = await upsertOAuthUser({
      email,
      fullName: profile.displayName || email.split("@")[0],
      provider: "microsoft",
      providerId: profile.id,
    });

    const ticket = signOAuthTicket(user);
    res.redirect(`${FRONTEND_ORIGIN}/oauth/callback?ticket=${encodeURIComponent(ticket)}`);
  } catch (error) {
    console.error("Microsoft OAuth error:", error);
    res.redirect(`${FRONTEND_ORIGIN}/login?error=${encodeURIComponent("Microsoft sign-in could not be completed.")}`);
  }
});

// Exchange one-time, short-lived OAuth ticket for the application's JWT.
router.get("/oauth/complete", async (req, res) => {
  try {
    const { ticket } = req.query;
    if (!ticket) {
      return res.status(400).json({ success: false, message: "Missing sign-in ticket." });
    }

    const payload = jwt.verify(ticket, process.env.JWT_SECRET);
    if (payload.purpose !== "oauth-ticket") {
      return res.status(401).json({ success: false, message: "Invalid sign-in ticket." });
    }

    const user = await User.findById(payload.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "Employee account not found." });
    }

    const token = signAccessToken(user);

    res.json({
      success: true,
      token,
      user: safeUser(user),
    });
  } catch (error) {
    console.error("OAuth ticket error:", error.message);
    res.status(401).json({
      success: false,
      message: "Sign-in ticket expired or invalid. Please try again.",
    });
  }
});

async function upsertOAuthUser({ email, fullName, provider, providerId, avatarData = "" }) {
  const normalizedEmail = email.toLowerCase().trim();

  let user = await User.findOne({ email: normalizedEmail });

  if (!user) {
    user = await User.create({
      fullName: fullName.trim(),
      email: normalizedEmail,
      password: "",
      authProvider: provider,
      providerId,
      avatarData,
      role: getRoleForEmail(normalizedEmail),
    });

    // Best effort welcome notification. Authentication does not fail if email delivery is unavailable.
    try {
      await sendWelcomeEmail(user.email, user.fullName);
    } catch (error) {
      console.error("Welcome email failed:", error.message);
    }

    return user;
  }

  user.authProvider = provider;
  user.providerId = providerId;
  user.role = getRoleForEmail(normalizedEmail, user.role);
  if (avatarData) user.avatarData = avatarData;
  if (!user.fullName && fullName) user.fullName = fullName.trim();

  await user.save();
  return user;
}

// Legacy password login is intentionally disabled.
// Company requirement: Microsoft company SSO only.
router.post("/login", (req, res) => {
  res.status(403).json({
    success: false,
    message: "Password login is disabled. Please use your authorized Microsoft company account.",
  });
});

// Public signup is intentionally disabled.
// Employees enter through company SSO.
router.post("/signup", (req, res) => {
  res.status(403).json({
    success: false,
    message: "Public registration is disabled. Please sign in with your authorized company account.",
  });
});

// Password change is disabled because company SSO owns authentication.
router.put("/change-password", authMiddleware, (req, res) => {
  res.status(403).json({
    success: false,
    message: "Password management is handled by your company's Microsoft account.",
  });
});

module.exports = router;
