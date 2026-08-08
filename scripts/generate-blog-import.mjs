import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';

const sourceDir = join(process.cwd(), 'content', 'blog-seo-20260808');
const outputFile = join(process.cwd(), 'content', 'blog-seo-20260808.sql');

const posts = JSON.parse(await readFile(join(sourceDir, 'manifest.json'), 'utf8'));
const sqlString = (value) => `'${String(value ?? '').replaceAll("'", "''")}'`;

const statements = [];
for (const post of posts) {
  const content = (await readFile(join(sourceDir, post.source), 'utf8')).trim();
  const words = content.split(/\s+/).filter(Boolean).length;
  if (words < 1_100) throw new Error(`${post.slug} is too short (${words} words)`);
  if (post.excerpt.length > 600) throw new Error(`${post.slug} excerpt is too long`);

  const values = [
    post.id,
    post.title,
    post.slug,
    post.excerpt,
    content,
    post.author,
    post.category,
    post.featuredImage,
    post.published ? 1 : 0,
    post.createdAt,
    post.updatedAt,
  ].map(sqlString).join(',');

  statements.push(
    `INSERT INTO blog_posts (id,title,slug,excerpt,content,author,category,featured_image,published,created_at,updated_at) VALUES (${values}) ` +
    'ON CONFLICT(id) DO UPDATE SET title=excluded.title,slug=excluded.slug,excerpt=excluded.excerpt,content=excluded.content,author=excluded.author,category=excluded.category,featured_image=excluded.featured_image,published=excluded.published,updated_at=excluded.updated_at;'
  );
  console.log(`${post.slug}: ${words} words`);
}

await mkdir(dirname(outputFile), { recursive: true });
await writeFile(outputFile, `${statements.join('\n')}\n`, 'utf8');
console.log(`Wrote ${outputFile}`);
