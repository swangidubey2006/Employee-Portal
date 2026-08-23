const BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "");

// Reusable fetch wrapper that handles token attachment and response formatting
const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config);

    // If token expired / unauthorized, clear local credentials and redirect
    if (response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      // Check if not already on login page to avoid redirect loops
      if (!window.location.pathname.startsWith("/login")) {
        window.location.href = "/login?expired=true";
      }
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.message || "Session expired. Please login again.");
    }

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Request failed.");
    }

    return data;
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error.message);
    throw error;
  }
};

export const authApi = {
  me: async () => {
    return apiRequest("/api/profile");
  },
  login: async (credentials) => {
    return apiRequest("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  },
  signup: async (data) => {
    return apiRequest("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  changePassword: async (data) => {
    return apiRequest("/api/auth/change-password", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },
};

export const attendanceApi = {
  getAttendance: async () => {
    return apiRequest("/api/attendance");
  },
  checkIn: async (data = {}) => {
    return apiRequest("/api/attendance/check-in", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  checkOut: async () => {
    return apiRequest("/api/attendance/check-out", {
      method: "POST",
    });
  },
};

export const leaveApi = {
  getLeaves: async () => {
    return apiRequest("/api/leaves");
  },
  applyLeave: async (data) => {
    return apiRequest("/api/leaves", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
};

export const taskApi = {
  getTasks: async () => {
    return apiRequest("/api/tasks");
  },
  createTask: async (data) => {
    return apiRequest("/api/tasks", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  updateTaskStatus: async (id, statusData) => {
    return apiRequest(`/api/tasks/${id}`, {
      method: "PATCH",
      body: JSON.stringify(statusData),
    });
  },
};

export const documentApi = {
  getDocuments: async () => {
    return apiRequest("/api/documents");
  },
  downloadDoc: async (id) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${BASE_URL}/api/documents/${id}/download`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.message || "Unable to download document.");
    }

    const blob = await response.blob();
    const disposition = response.headers.get("content-disposition") || "";
    const match = disposition.match(/filename="?([^"]+)"?/i);
    const filename = match?.[1] || "GYANYUG_Document.txt";

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  },
};

export const employeeApi = {
  getEmployees: async (params = {}) => {
    const query = new URLSearchParams();
    if (params.search) query.append("search", params.search);
    if (params.department) query.append("department", params.department);
    if (params.sort) query.append("sort", params.sort);
    const queryString = query.toString() ? `?${query.toString()}` : "";
    return apiRequest(`/api/employees${queryString}`);
  },
  addEmployee: async (data) => {
    return apiRequest("/api/employees", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
};

export const profileApi = {
  getProfile: async () => {
    return apiRequest("/api/profile");
  },
  updateProfile: async (data) => {
    return apiRequest("/api/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },
};

export const announcementApi = {
  getAnnouncements: async () => apiRequest("/api/announcements"),
  createAnnouncement: async (data) =>
    apiRequest("/api/announcements", { method: "POST", body: JSON.stringify(data) }),
  setActive: async (id, isActive) =>
    apiRequest(`/api/announcements/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ isActive }),
    }),
};

export const adminApi = {
  getUsers: async () => apiRequest("/api/admin/users"),
};
export const holidayApi = {
  getHolidays: async (params = {}) => {
    const query = new URLSearchParams();
    if (Number.isInteger(params.year)) query.append("year", String(params.year));
    if (Number.isInteger(params.month)) query.append("month", String(params.month));
    const qs = query.toString() ? `?${query.toString()}` : "";
    return apiRequest(`/api/holidays${qs}`);
  },
  createHoliday: async (data) =>
    apiRequest("/api/holidays", { method: "POST", body: JSON.stringify(data) }),
  removeHoliday: async (id) => apiRequest(`/api/holidays/${id}`, { method: "DELETE" }),
};
