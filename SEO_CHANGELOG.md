# SEO Full Optimization Pass

- Created a single source of truth for business identity, service areas, and SEO metadata.
- Centralized LocalBusiness schema and clarified that the business serves areas rather than presenting each service area as a separate storefront.
- Changed city pages to emphasize relevant services instead of treating every service as equally important, and added local service-intent internal links.
- Cleaned up unsupported/overly broad location claims and strengthened Omaha/Bellevue primary-page positioning.
- Tightened core category title targeting for interior detailing, paint correction, and ceramic coating.
- Added a concrete implementation plan for location pages, internal linking, content, proof, GBP, measurement, and security.
- Added a reusable, locally focused homepage SEO summary for the next content pass.
- Hardened .gitignore against accidental environment-secret commits.

## Still required before deployment

- Run the project's normal `npm install` / `npm run build` in the deployment environment.
- Inspect the generated production HTML for the homepage, Omaha, Bellevue, and primary service pages.
- Validate structured data in Google's Rich Results Test after deployment.
- Connect/inspect Google Search Console and Google Business Profile.
- Rotate any credentials that were exposed outside the private environment.

## Second implementation pass

- Rewrote Omaha and Bellevue local SEO positioning.
- Added a homepage Omaha/Bellevue service-area section with direct internal links.
- Added a city-page detailing process and local FAQ.
- Added FAQ structured data to city pages.
- Reworked service-category hero headings and local service-guide content.
- Expanded prerendered location HTML with process, local questions, service links, and booking paths.
- Improved core category metadata for interior, exterior, full-detail, paint-correction, ceramic-coating, and maintenance intent.
- Removed the Ralston same-day/next-day availability promise.
- Added a clearer content and local-authority roadmap.
