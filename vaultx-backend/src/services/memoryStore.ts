export type FileRecord = {
  fileId: string;
  slug: string;
  filename: string;
  mime: string;
  size: number;
  objectKey: string;
  createdAt: number;
};

const filesBySlug = new Map<string, FileRecord>();
const filesById = new Map<string, FileRecord>();

export const MemoryStore = {
  save(file: FileRecord) {
    filesBySlug.set(file.slug, file);
    filesById.set(file.fileId, file);
  },

  getBySlug(slug: string): FileRecord | undefined {
    return filesBySlug.get(slug);
  },

  getById(fileId: string): FileRecord | undefined {
    return filesById.get(fileId);
  },
};
