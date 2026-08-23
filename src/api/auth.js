import {
  api,
  API_BASE,
  tokenStore,
  refreshTokenStore,
  demoModeStore,
} from "./client";

const DEMO_EMAIL = "demo@redarky.com";
const DEMO_PASSWORD = "redarky_password";
const DEMO_FULL_NAME = "Redarky Demo";

export const authApi = {
  async register({ email, password, full_name }) {
    const body = { email, password };
    if (full_name) body.full_name = full_name;
    const data = await api.post("/auth/register", body, { auth: false });
    if (data.access_token) {
      tokenStore.setAccess(data.access_token);
      refreshTokenStore.set(data.refresh_token);
    }
    return data;
  },

  async login({ email, password }) {
    const data = await api.post(
      "/auth/login",
      { email, password },
      { auth: false },
    );
    if (data.access_token) {
      tokenStore.setAccess(data.access_token);
      refreshTokenStore.set(data.refresh_token);
    }
    return data;
  },

  async me() {
    const data = await api.get("/auth/me");
    tokenStore.setUser(data);
    return data;
  },

  async refresh() {
    const refreshToken = refreshTokenStore.get();
    if (!refreshToken) throw new Error("No refresh token");
    const data = await api.post(
      "/auth/refresh",
      { refresh_token: refreshToken },
      { auth: false },
    );
    if (data.access_token) {
      tokenStore.setAccess(data.access_token);
      refreshTokenStore.set(data.refresh_token);
    }
    return data;
  },

  /**
   * Default-user demo login. One-click for recruiters viewing the resume.
   * Tries login first; if 401, registers then logs in.
   */
  async loginAsDemoUser() {
    demoModeStore.setDemoUser(true);
    try {
      const loginData = await this.login({
        email: DEMO_EMAIL,
        password: DEMO_PASSWORD,
      });
      // Try to fetch the user object
      try {
        await this.me();
      } catch {
        // ignore — tokens are set, /me can refresh later
      }
      return loginData;
    } catch (err) {
      // 401 → user doesn't exist; register then login
      if (err?.status === 401 || err?.status === 400) {
        await this.register({
          email: DEMO_EMAIL,
          password: DEMO_PASSWORD,
          full_name: DEMO_FULL_NAME,
        });
        // register response already includes tokens
        try {
          await this.me();
        } catch {
          // ignore
        }
        return { access_token: tokenStore.getAccess() };
      }
      throw err;
    }
  },

  logout() {
    demoModeStore.setDemoUser(false);
    tokenStore.clearAccess();
    refreshTokenStore.clear();
  },

  getGoogleLoginUrl(nextPath = "/") {
    return `${API_BASE}/auth/google/login?next=${encodeURIComponent(nextPath)}`;
  },
};
