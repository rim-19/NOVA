export function getAdminEmails(): string[] {
  const raw = process.env.NEXT_PUBLIC_ADMIN_EMAILS || "";
  return raw
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  const allowed = getAdminEmails();
  // If no admin list is configured, allow authenticated users to avoid lockout.
  if (allowed.length === 0) return true;
  return allowed.includes(email.toLowerCase());
}

