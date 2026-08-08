# Bryan's Detailing SEO Implementation

This package contains the first implementation pass from the local SEO audit.

## Changes made

- Sharpened homepage H1 to target **Mobile Car Detailing in Omaha & Bellevue, NE**.
- Improved homepage SEO description.
- Reworked city-page SEO titles for Omaha, Bellevue, Papillion, La Vista, Ralston, Gretna, Elkhorn, Council Bluffs, and Offutt AFB.
- Added city-specific featured service selections so prerendered city pages do not expose the same generic service list.
- Expanded prerendered city HTML with service links, local service areas, city-specific selling points, and a quote CTA.
- Removed the repeated Papillion customer quote from every city page. A testimonial should only appear where it is a genuine review for that location/service.
- Changed city-page structured data from `AutoBodyShop` to a `Service` provided by the site's canonical LocalBusiness entity.
- Added city `Service` JSON-LD to prerendered HTML so it is present before JavaScript executes.
- Added Offutt Air Force Base to the global service-area structured data.
- Refined an overstrong paint-correction claim to avoid promising permanent removal of every scratch/defect.
- Added `.env`/secret-file protection in `.gitignore`.

## Important deployment note

The uploaded archive contained a real `.env` file with credentials. That file has been removed from this package and is **not** included in the sanitized ZIP.

If those credentials were ever committed to Git, uploaded to a public repository, or shared anywhere outside the intended server environment, rotate the affected credentials before deployment. This includes payment, email, AI, Google API, and admin-password credentials.

## Build verification

The source changes were reviewed and the existing TypeScript project was typechecked far enough to identify pre-existing errors in `client/services/recommendationService.ts`. A full Vite build could not be completed in this environment because the uploaded `node_modules` was built for Windows and the package registry available here could not restore all dependencies.

For deployment, remove/recreate `node_modules` on the deployment machine and run:

```bash
npm ci
npm run typecheck
npm run build
```

Then inspect the generated `dist/` pages, especially:

- `/`
- `/areas/omaha-ne`
- `/areas/bellevue-ne`
- `/services/category/interior-detailing`
- `/services/category/paint-correction`
- `/services/category/ceramic-coating`

The next SEO pass should focus on Google Business Profile/review growth, real location-specific proof, service-page content depth, and local backlinks.
