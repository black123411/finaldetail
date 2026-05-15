const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;
  
  // Replace imports from data
  content = content.replace(/from\s+['"].*?\/data\/([a-zA-Z0-9_-]+)(?:\.ts)?['"]/g, 'from \'@/shared/data/$1\'');
  
  // Replace imports from types
  content = content.replace(/from\s+['"].*?\/types(?:\.ts)?['"]/g, 'from \'@/shared/types\'');

  if (content !== original) {
    fs.writeFileSync(filePath, content);
    console.log('Updated: ' + filePath);
  }
}

function walkDir(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
      replaceInFile(fullPath);
    }
  }
}

walkDir('./src');
walkDir('./server');
replaceInFile('./server.ts');
