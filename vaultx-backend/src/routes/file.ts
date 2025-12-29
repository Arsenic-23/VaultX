import { FastifyInstance } from "fastify";
import { MemoryStore } from "../services/memoryStore";

export async function fileRoutes(app: FastifyInstance) {
  app.get("/file/:slug", async (req, reply) => {
    const { slug } = req.params as { slug: string };

    const file = MemoryStore.getBySlug(slug);

    if (!file) {
      return reply.status(404).send({ error: "File not found" });
    }

    return {
      fileId: file.fileId,
      slug: file.slug,
      filename: file.filename,
      mime: file.mime,
      size: file.size,
      createdAt: file.createdAt,
      downloadUrl: `/download/${file.slug}`,
    };
  });
}
