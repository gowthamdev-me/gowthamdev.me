import { formatIncompletePhoneNumber } from "@/lib/libphonenumber";

export function decodeEmail(email: string) {
  try {
    return atob(email);
  } catch (error) {
    console.warn("Failed to decode email:", error);
    return "";
  }
}

export function decodePhoneNumber(phone: string) {
  try {
    return atob(phone);
  } catch (error) {
    console.warn("Failed to decode phone number:", error);
    return "";
  }
}

export function formatPhoneNumber(phone: string) {
  return formatIncompletePhoneNumber(phone);
}

