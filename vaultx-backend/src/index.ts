import "dotenv/config";

import Fastify from "fastify";
import cors from "@fastify/cors";
import multipart from "@fastify/multipart";

import { uploadRoutes } from "./routes/upload";
import { fileRoutes } from "./routes/file";
import { downloadRoutes } from "./routes/download";

async function startServer() {
  const app = Fastify({
    logger: true,
  });

  await app.register(cors, {
    origin: [
      "http://localhost:3000",
      "https://vaultx.io",
    ],
    methods: ["GET", "POST"],
  });

  await app.register(multipart, {
    limits: {
      fileSize: 250 * 1024 * 1024 * 1024,
    },
  });

  app.get("/health", async () => ({ ok: true }));

  await app.register(uploadRoutes);
  await app.register(fileRoutes);
  await app.register(downloadRoutes);

  const port = Number(process.env.PORT) || 3001;

  await app.listen({
    port,
    host: "0.0.0.0",
  });

  app.log.info(`Server listening on http://localhost:${port}`);
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
