const fs = require('fs');
const path = require('path');
const glob = require('glob');

const projectRoot = process.cwd();

const files = glob.sync('**/*.{ts,tsx}', {
  cwd: projectRoot,
  ignore: ['node_modules/**', '.expo/**'],
});

files.forEach(file => {
  const filePath = path.join(projectRoot, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Substituir imports relativos de config e components para alias @/
  // Exemplo: from '../config/...' => from '@/config/...'
  //          from '../../components/...' => from '@/components/...'
  content = content.replace(
    /from\s+['"](\.{1,2}\/(config|components)\/[^'"]*)['"]/g,
    (match, p1) => {
      // Pega só a parte após ../ ou ../../
      const newPath = p1.replace(/^(\.{1,2}\/)+/, '');
      return `from '@/${newPath}'`;
    }
  );

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✅ Corrigido: ${file}`);
});

console.log('✨ Todos os imports relativos de config e components foram convertidos para alias @/');
