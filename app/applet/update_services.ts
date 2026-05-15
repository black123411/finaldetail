import fs from 'fs';
const file = 'src/data/services.ts';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/duration:\s*string;/, 'duration: string | Record<string, string>;');

function durationToRecord(durationStr: string, isSpecialty: boolean) {
  if (isSpecialty) return `{ rv: '${durationStr}' }`;

  const match = durationStr.match(/(\d+(?:\.\d+)?)-(\d+(?:\.\d+)?)\s*hours?/);
  if (match) {
    const min = parseFloat(match[1]);
    const max = parseFloat(match[2]);
    const diff = max - min;
    const s1 = `${min}-${Math.round((min+diff*0.5)*10)/10} hours`;
    const s2 = `${Math.round((min+diff*0.5)*10)/10}-${max} hours`;
    const s3 = `${max}-${Math.round((max+diff*0.5)*10)/10} hours`;
    const s4 = `${Math.round((max+diff*0.5)*10)/10}-${max+diff} hours`;
    return `{ car: '${s1}', suv: '${s2}', truck: '${s3}', largeSuv: '${s4}' }`;
  }
  
  if (durationStr.includes('1 Day')) {
     return `{ car: '1 Day', suv: '1 Day', truck: '1.5 Days', largeSuv: '1.5 Days' }`;
  }
  if (durationStr.includes('1-2 Days')) {
     return `{ car: '1 Day', suv: '1.5 Days', truck: '1.5 Days', largeSuv: '2 Days' }`;
  }
  if (durationStr.includes('2-3 Days')) {
     return `{ car: '2 Days', suv: '2.5 Days', truck: '2.5 Days', largeSuv: '3 Days' }`;
  }
  if (durationStr === '1-1.5 hours') {
    return `{ car: '1 hr', suv: '1.25 hrs', truck: '1.5 hrs', largeSuv: '1.75 hrs' }`;
  }
  
  if (durationStr.includes('8-12 hours')) {
     return `{ car: '8-10 hours', suv: '9-11 hours', truck: '10-12 hours', largeSuv: '11-13 hours' }`;
  }
  if (durationStr.includes('12-16 hours')) {
     return `{ car: '12-14 hours', suv: '13-15 hours', truck: '14-16 hours', largeSuv: '15-18 hours' }`;
  }
  if (durationStr.includes('1.5-2.5 hours')) {
     return `{ car: '1.5-2 hours', suv: '1.75-2.25 hours', truck: '2-2.5 hours', largeSuv: '2.25-2.75 hours' }`;
  }

  return `'${durationStr}'`; // Fallback
}

const blocks = content.split('// ');
for (let i = 1; i < blocks.length; i++) {
  if (blocks[i].startsWith('ADD_ONS')) continue;
  blocks[i] = blocks[i].replace(/duration:\s*'([^']+)'/g, (match, p1) => {
    return `duration: ${durationToRecord(p1, blocks[i].includes('isSpecialty: true'))}`;
  });
}

content = blocks.join('// ');
fs.writeFileSync(file, content);
console.log('Updated services.ts');
