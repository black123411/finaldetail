import fs from 'fs';
import path from 'path';

function run() {
  const files = [
    'src/pages/FAQ.tsx',
    'src/data/seoBlogPosts.ts',
  ];

  for (const file of files) {
    const filePath = path.join(process.cwd(), file);
    if (!fs.existsSync(filePath)) continue;
    let content = fs.readFileSync(filePath, 'utf8');

    content = content.replace(/I are/g, "I am");
    content = content.replace(/I're/g, "I'm");
    content = content.replace(/I all want my cars/g, "we all want our cars");
    content = content.replace(/I've all been there/g, "We've all been there");
    content = content.replace(/That road salt I talked about/g, "That road salt we talked about");
    
    fs.writeFileSync(filePath, content, 'utf8');
  }
}

run();
