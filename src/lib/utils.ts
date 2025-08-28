import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getUserAvatarUrl(email: string | undefined | null): string {
  if (!email) {
    return `https://api.dicebear.com/7.x/initials/svg?seed=guest`
  }
  // Use a consistent hash for the seed to get the same avatar for the same email
  const hash = btoa(email).substring(0, 10); // Simple base64 hash
  return `https://api.dicebear.com/7.x/initials/svg?seed=${hash}`
}