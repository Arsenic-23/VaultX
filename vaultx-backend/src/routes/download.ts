import { FastifyInstance } from "fastify";
import { b2, authorizeB2 } from "../services/b2";
import { MemoryStore } from "../services/memoryStore";

export async function downloadRoutes(app: FastifyInstance) {
  app.get("/download/:slug", async (req, reply) => {
    const { slug } = req.params as { slug: string };

    const record = MemoryStore.getBySlug(slug);
    if (!record) {
      return reply.status(404).send({ error: "File not found" });
    }

    await authorizeB2();

    const res = await b2.downloadFileByName({
      bucketName: process.env.B2_BUCKET_NAME!,
      fileName: record.objectKey,
      responseType: "arraybuffer",
    });

    const buffer = Buffer.from(res.data);

    reply.header("Content-Type", record.mime);
    reply.header(
      "Content-Disposition",
      `attachment; filename="${record.filename}"`
    );
    reply.header("Content-Length", buffer.length);

    return reply.send(buffer);
  });
}
