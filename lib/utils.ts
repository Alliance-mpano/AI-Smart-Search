import { customAlphabet } from "nanoid";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyz0123456789");

export function chunkText(
  text: string,
  maxLen = 1000,
  overlap = 200
): string[] {
  const chars = [...text];
  const chunks: string[] = [];
  for (let i = 0; i < chars.length; i += maxLen - overlap) {
    chunks.push(chars.slice(i, i + maxLen).join(''));
  }
  return chunks;
}
