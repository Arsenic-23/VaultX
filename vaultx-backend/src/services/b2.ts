import B2 from "backblaze-b2";

function requiredEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

const B2_KEY_ID = requiredEnv("B2_KEY_ID");
const B2_APPLICATION_KEY = requiredEnv("B2_APPLICATION_KEY");

export const b2 = new B2({
  applicationKeyId: B2_KEY_ID,
  applicationKey: B2_APPLICATION_KEY,
});

let isAuthorized = false;
let authorizePromise: Promise<void> | null = null;

/**
 * Authorize Backblaze B2 exactly once (concurrency-safe)
 */
export async function authorizeB2() {
  if (isAuthorized) return;

  if (!authorizePromise) {
    authorizePromise = (async () => {
      await b2.authorize();
      isAuthorized = true;
      console.log("[B2] Authorized successfully");
    })().catch((err) => {
      authorizePromise = null;
      isAuthorized = false;
      throw err;
    });
  }

  return authorizePromise;
}
