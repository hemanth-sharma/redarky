
export const config = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000",
  demo: {
    email: import.meta.env.VITE_DEMO_EMAIL || "demo@redarky.com",
    password: import.meta.env.VITE_DEMO_PASSWORD || "redarky_password",
    fullName: import.meta.env.VITE_DEMO_FULL_NAME || "Redarky Demo",
  },
};