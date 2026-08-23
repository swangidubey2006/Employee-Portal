import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const API_BASE = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "");

const OAuthCallback = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [message, setMessage] = useState("Completing secure sign-in...");

  useEffect(() => {
    let cancelled = false;

    const complete = async () => {
      const ticket = params.get("ticket");
      const error = params.get("error");

      if (error) {
        if (!cancelled) {
          setMessage(error);
          window.setTimeout(() => navigate("/login", { replace: true }), 1800);
        }
        return;
      }

      if (!ticket) {
        if (!cancelled) {
          setMessage("Sign-in could not be completed. Please start again.");
          window.setTimeout(() => navigate("/login", { replace: true }), 1800);
        }
        return;
      }

      try {
        const response = await fetch(
          `${API_BASE}/api/auth/oauth/complete?ticket=${encodeURIComponent(ticket)}`,
          {
            method: "GET",
            headers: { Accept: "application/json" },
            cache: "no-store",
          }
        );

        const raw = await response.text();
        let data = {};
        try {
          data = raw ? JSON.parse(raw) : {};
        } catch {
          throw new Error("The authentication server returned an invalid response.");
        }

        if (!response.ok || !data.success || !data.token) {
          throw new Error(data.message || "Sign-in could not be completed.");
        }

        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user || {}));

        // Replace the OAuth callback URL immediately. This also removes the short-lived
        // ticket from browser history/address bar before the dashboard loads.
        if (!cancelled) {
          setMessage("Sign-in successful. Opening your workspace...");
          const nextPath = sessionStorage.getItem("postLoginPath") || "/dashboard";
          sessionStorage.removeItem("postLoginPath");
          navigate(nextPath, { replace: true });
        }
      } catch (err) {
        console.error("OAuth completion error:", err);
        if (!cancelled) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setMessage(err.message || "Sign-in failed. Please try again.");
          window.setTimeout(() => navigate("/login", { replace: true }), 2500);
        }
      }
    };

    complete();
    return () => {
      cancelled = true;
    };
  }, [navigate, params]);

  return (
    <main className="app-container">
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Inter, system-ui, sans-serif",
          color: "#111827",
          background: "#F8FAFC",
        }}
      >
        <div
          style={{
            width: "min(420px, 90vw)",
            padding: "32px",
            borderRadius: "16px",
            background: "#fff",
            boxShadow: "0 20px 60px rgba(15,23,42,.12)",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 32, marginBottom: 16 }}>🔐</div>
          <h2 style={{ margin: "0 0 10px" }}>Employee Portal</h2>
          <p style={{ margin: 0, color: "#64748B" }}>{message}</p>
        </div>
      </div>
    </main>
  );
};

export default OAuthCallback;
