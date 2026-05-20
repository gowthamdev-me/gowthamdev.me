/**
 * Get mailto link with subject and body
 * Works on all devices - automatically opens mail app on mobile, default mail client on desktop
 */
export function getMailtoLink(
  email: string,
  subject?: string,
  body?: string
): string {
  const params = new URLSearchParams();
  if (subject) params.append("subject", subject);
  if (body) params.append("body", body);
  
  const queryString = params.toString();
  return `mailto:${email}${queryString ? `?${queryString}` : ""}`;
}

