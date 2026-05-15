import fs from 'fs';
import path from 'path';

function replaceInFile(filePath: string) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace words boundary based.
  // "our " -> "my "
  content = content.replace(/\bour\b/gi, (match) => {
    return match === 'our' ? 'my' : match === 'Our' ? 'My' : 'OUR' ? 'MY' : match;
  });
  
  // "we " -> "I "
  content = content.replace(/\bwe\b/gi, (match) => {
    if (match === 'we') return 'I';
    if (match === 'We') return 'I';
    if (match === 'WE') return 'I';
    return match;
  });

  // "us " -> "me "
  content = content.replace(/\bus\b/gi, (match) => {
    if (match === 'us') return 'me';
    if (match === 'Us') return 'Me';
    return match;
  });

  fs.writeFileSync(filePath, content, 'utf8');
}

const files = [
  'src/data/services.ts',
  'src/data/cities.ts',
  'src/pages/TermsOfService.tsx',
  'src/pages/FAQ.tsx',
  'src/pages/Home.tsx',
  'src/pages/PrivacyPolicy.tsx',
  'src/pages/Booking.tsx',
  'src/pages/Quote.tsx',
  'src/components/DetailingQuiz.tsx',
  'src/data/seoBlogPosts.ts',
];

files.forEach(f => {
  const fullPath = path.join(process.cwd(), f);
  replaceInFile(fullPath);
});
console.log('Replacements done.');
