export const DEV_ADMIN_COOKIE = "roxwana_dev_admin";
export const DEV_ADMIN_EMAIL = "admin@roxwana.local";
export const DEV_ADMIN_PASSWORD = "roxwana123";

export function isDevAdminEnabled() {
  return process.env.NODE_ENV !== "production";
}

export function isDevAdminCredential(email: string, password: string) {
  return isDevAdminEnabled() && email.trim().toLowerCase() === DEV_ADMIN_EMAIL && password === DEV_ADMIN_PASSWORD;
}
