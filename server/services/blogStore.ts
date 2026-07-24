import { Storage } from '@google-cloud/storage';
import fs from 'fs/promises';
import path from 'path';

export type StoredBlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  featuredImage: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
};

const bucketName = process.env.BLOG_STORAGE_BUCKET?.trim();
const objectName = process.env.BLOG_STORAGE_OBJECT?.trim() || 'content/blog-posts.json';
const localFile = process.env.BLOG_STORAGE_FILE?.trim()
  ? path.resolve(process.env.BLOG_STORAGE_FILE)
  : path.resolve(process.cwd(), 'data', 'blog-posts.json');

let storage: Storage | null = null;
let mutationQueue: Promise<unknown> = Promise.resolve();

const getStorage = () => {
  storage ??= new Storage();
  return storage;
};

const parsePosts = (value: string): StoredBlogPost[] => {
  const parsed = JSON.parse(value);
  if (!Array.isArray(parsed)) throw new Error('Blog storage must contain a JSON array');
  return parsed as StoredBlogPost[];
};

export async function readBlogPosts(): Promise<StoredBlogPost[]> {
  if (bucketName) {
    const file = getStorage().bucket(bucketName).file(objectName);
    const [exists] = await file.exists();
    if (!exists) return [];
    const [contents] = await file.download();
    return parsePosts(contents.toString('utf8'));
  }

  try {
    return parsePosts(await fs.readFile(localFile, 'utf8'));
  } catch (error: any) {
    if (error?.code === 'ENOENT') return [];
    throw error;
  }
}

export async function writeBlogPosts(posts: StoredBlogPost[]): Promise<void> {
  const payload = `${JSON.stringify(posts, null, 2)}\n`;

  if (bucketName) {
    await getStorage().bucket(bucketName).file(objectName).save(payload, {
      contentType: 'application/json; charset=utf-8',
      resumable: false,
    });
    return;
  }

  await fs.mkdir(path.dirname(localFile), { recursive: true });
  const temporaryFile = `${localFile}.tmp`;
  await fs.writeFile(temporaryFile, payload, 'utf8');
  await fs.rename(temporaryFile, localFile);
}

export function mutateBlogPosts<T>(
  mutation: (posts: StoredBlogPost[]) => Promise<{ posts: StoredBlogPost[]; result: T }> | { posts: StoredBlogPost[]; result: T },
): Promise<T> {
  const operation = mutationQueue.then(async () => {
    const currentPosts = await readBlogPosts();
    const { posts, result } = await mutation(currentPosts);
    await writeBlogPosts(posts);
    return result;
  });

  mutationQueue = operation.then(() => undefined, () => undefined);
  return operation;
}

export const blogStorageDescription = bucketName
  ? `gs://${bucketName}/${objectName}`
  : localFile;
