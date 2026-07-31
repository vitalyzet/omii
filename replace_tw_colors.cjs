const fs = require('fs');
const path = require('path');

const replacements = [
  // Indigo / Blue mapping to Teal
  { regex: /\b(bg|text|border|ring)-indigo-50\b/g, replacement: '$1-[#eef7f5]' },
  { regex: /\b(bg|text|border|ring)-indigo-100\b/g, replacement: '$1-[#bce0da]' },
  { regex: /\b(bg|text|border|ring)-indigo-200\b/g, replacement: '$1-[#bce0da]' },
  { regex: /\b(bg|text|border|ring)-indigo-600\b/g, replacement: '$1-[#108474]' },
  { regex: /\b(bg|text|border|ring)-indigo-700\b/g, replacement: '$1-[#0e7063]' },
  { regex: /\b(bg|text|border|ring)-indigo-800\b/g, replacement: '$1-[#0a5248]' },
  { regex: /\b(bg|text|border|ring)-indigo-900\b/g, replacement: '$1-[#06332d]' },
  
  { regex: /\b(bg|text|border|ring)-blue-50\b/g, replacement: '$1-[#eef7f5]' },
  { regex: /\b(bg|text|border|ring)-blue-100\b/g, replacement: '$1-[#bce0da]' },
  { regex: /\b(bg|text|border|ring)-blue-200\b/g, replacement: '$1-[#bce0da]' },
  { regex: /\b(bg|text|border|ring)-blue-600\b/g, replacement: '$1-[#108474]' },
  { regex: /\b(bg|text|border|ring)-blue-700\b/g, replacement: '$1-[#0e7063]' },
  { regex: /\b(bg|text|border|ring)-blue-800\b/g, replacement: '$1-[#0a5248]' },
  { regex: /\b(bg|text|border|ring)-blue-900\b/g, replacement: '$1-[#06332d]' },

  // Orange mapping to PinPin Orange (#fea74f)
  { regex: /\b(bg|text|border|ring)-orange-50\b/g, replacement: '$1-[#fff6ef]' },
  { regex: /\b(bg|text|border|ring)-orange-100\b/g, replacement: '$1-[#fee9d4]' },
  { regex: /\b(bg|text|border|ring)-orange-500\b/g, replacement: '$1-[#fea74f]' },
  { regex: /\b(bg|text|border|ring)-orange-600\b/g, replacement: '$1-[#e39546]' },

  // Green mapping to PinPin Success Green (#008060)
  { regex: /\b(bg|text|border|ring)-emerald-50\b/g, replacement: '$1-[#e5f2ef]' },
  { regex: /\b(bg|text|border|ring)-emerald-100\b/g, replacement: '$1-[#b3d9cf]' },
  { regex: /\b(bg|text|border|ring)-emerald-500\b/g, replacement: '$1-[#008060]' },
  { regex: /\b(bg|text|border|ring)-emerald-600\b/g, replacement: '$1-[#00664d]' }
];

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let original = content;
      
      for (const { regex, replacement } of replacements) {
        content = content.replace(regex, replacement);
      }
      
      if (content !== original) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated Tailwind classes in ${fullPath}`);
      }
    }
  }
}

processDirectory('./src');
console.log('Done replacing Tailwind classes.');
