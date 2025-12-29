import { randomBytes } from "crypto";

const ALPHABET =
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

export function generateSlug(length: number = 8): string {
  const bytes = randomBytes(length);
  let slug = "";

  for (let i = 0; i < length; i++) {
    slug += ALPHABET[bytes[i] % ALPHABET.length];
  }

  return slug;
}
