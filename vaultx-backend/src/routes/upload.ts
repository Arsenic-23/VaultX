import { FastifyInstance } from "fastify";
import { randomUUID } from "crypto";
import { generateSlug } from "../utils/slug";
import { MemoryStore } from "../services/memoryStore";
import { b2, authorizeB2 } from "../services/b2";

export async function uploadRoutes(app: FastifyInstance) {
  app.post("/upload", async (req, reply) => {
    const file = await req.file();

    if (!file) {
      return reply.status(400).send({ error: "No file uploaded" });
    }

    const chunks: Buffer[] = [];
    for await (const chunk of file.file) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);

    await authorizeB2();

    const fileId = randomUUID();
    const slug = generateSlug();
    const objectKey = `${slug}/${file.filename}`;

    // Get B2 upload URL
    const { data } = await b2.getUploadUrl({
      bucketId: process.env.B2_BUCKET_ID!,
    });

    const uploadRes = await b2.uploadFile({
      uploadUrl: data.uploadUrl,
      uploadAuthToken: data.authorizationToken,
      fileName: objectKey,
      data: buffer, 
      contentType: file.mimetype || "application/octet-stream",
    });

    MemoryStore.save({
      fileId,
      slug,
      filename: file.filename,
      mime: file.mimetype,
      size: buffer.length,
      objectKey,
      createdAt: Date.now(),
    });

    return {
      ok: true,
      fileId,
      slug,
      downloadPage: `/v/${slug}`,
      maxBandwidth: 250 * 1024 * 1024 * 1024,
    };
  });
}
