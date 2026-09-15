import { CITIES } from '../shared/data/cities.ts';
import { CATEGORIES, SERVICES } from '../shared/data/services.ts';
import { STATIC_PAGE_SEO } from '../shared/data/seo.ts';

const TITLE_MAX = 60;
const DESCRIPTION_MAX = 160;

const pages = [];

for (const [path, seo] of Object.entries(STATIC_PAGE_SEO)) {
  if (seo.robots?.includes('noindex')) continue;
  pages.push({ key: path, title: seo.title, description: seo.description });
}

for (const city of CITIES) {
  pages.push({ key: `/areas/${city.slug}`, title: city.seo.title, description: city.seo.description });
}

for (const category of CATEGORIES) {
  // This URL permanently redirects to the dedicated /ceramic-coating landing page.
  if (category.slug === 'ceramic-coating') continue;
  pages.push({ key: `/services/category/${category.slug}`, title: category.seo?.title || '', description: category.seo?.description || '' });
}

for (const service of SERVICES) {
  pages.push({ key: `/services/${service.id}`, title: service.seo.title, description: service.seo.description });
}

const errors = [];
const titleOwners = new Map();
const descriptionOwners = new Map();

for (const page of pages) {
  const title = page.title.trim();
  const description = page.description.trim();

  if (!title) errors.push(`${page.key}: missing title`);
  if (!description) errors.push(`${page.key}: missing meta description`);
  if (title.length > TITLE_MAX) errors.push(`${page.key}: title is ${title.length} characters (max ${TITLE_MAX}) -> ${title}`);
  if (description.length > DESCRIPTION_MAX) errors.push(`${page.key}: description is ${description.length} characters (max ${DESCRIPTION_MAX})`);

  if (title) {
    const owner = titleOwners.get(title);
    if (owner) errors.push(`${page.key}: duplicate title also used by ${owner} -> ${title}`);
    else titleOwners.set(title, page.key);
  }

  if (description) {
    const owner = descriptionOwners.get(description);
    if (owner) errors.push(`${page.key}: duplicate meta description also used by ${owner}`);
    else descriptionOwners.set(description, page.key);
  }
}

if (errors.length) {
  console.error(`SEO validation failed with ${errors.length} issue(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`SEO validation passed for ${pages.length} indexable pages.`);
