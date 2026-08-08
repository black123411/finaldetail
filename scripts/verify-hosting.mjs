import assert from 'node:assert/strict';

const ORIGIN = process.env.HOSTING_ORIGIN || 'http://localhost:5000';

const cases = [
  { path: '/', status: 200, canonical: 'https://bryansdetailingomaha.com/', h1: 'Mobile Car Detailing in Omaha &amp; Bellevue, NE.' },
  { path: '/book', status: 200, canonical: 'https://bryansdetailingomaha.com/book', h1: 'Book Your Auto Detail' },
  { path: '/areas/omaha-ne', status: 200, canonical: 'https://bryansdetailingomaha.com/areas/omaha-ne', h1: 'Mobile Car Detailing in Omaha, Nebraska' },
  { path: '/services/interior-detail', status: 200, canonical: 'https://bryansdetailingomaha.com/services/interior-detail', h1: 'Signature Interior Detail' },
  { path: '/app/cms', status: 404, noindex: true, h1: 'Page Not Found' },
  { path: '/definitely-not-a-real-page', status: 404, noindex: true, h1: 'Page Not Found' },
];

const results = [];

for (const expected of cases) {
  const response = await fetch(`${ORIGIN}${expected.path}`, { redirect: 'manual' });
  const body = await response.text();
  const canonical = body.match(/<link[^>]+rel="canonical"[^>]+href="([^"]+)"/i)?.[1] || '';
  const h1 = body.match(/<h1>(.*?)<\/h1>/i)?.[1] || '';
  const location = response.headers.get('location') || '';
  const noindex = /<meta[^>]+name="robots"[^>]+content="noindex,follow"/i.test(body);

  assert.equal(response.status, expected.status, `${expected.path} returned ${response.status}`);
  if (expected.canonical) assert.equal(canonical, expected.canonical, `${expected.path} canonical mismatch`);
  if (expected.h1) assert.equal(h1, expected.h1, `${expected.path} H1 mismatch`);
  if (expected.location) assert.equal(location, expected.location, `${expected.path} redirect mismatch`);
  if (expected.noindex) assert.equal(noindex, true, `${expected.path} must be noindex`);

  results.push({
    path: expected.path,
    status: response.status,
    canonical,
    location,
    h1,
    noindex,
  });
}

console.table(results);
console.log('Firebase Hosting route verification passed.');
