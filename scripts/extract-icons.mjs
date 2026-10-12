// Copia a shared/data/icons.json solo los iconos Carbon que usa el mapa (y las diapositivas).
// Así el sitio y la charla los empaquetan sin red y sin cargar el set completo (2776 iconos).
// Uso: node scripts/extract-icons.mjs   (lee @iconify-json/carbon de talks/openai-hf/node_modules)
import { readFileSync, writeFileSync } from 'node:fs';
import { nodes } from './mapa-layout.mjs';

// Iconos extra de las diapositivas (actos 5–8) y de la leyenda.
const extra = ['help', 'warning-alt', 'checkmark-filled', 'locked', 'time', 'document', 'rule', 'flag', 'chart-network', 'view-off', 'earth', 'security'];

const set = JSON.parse(readFileSync(new URL('../talks/openai-hf/node_modules/@iconify-json/carbon/icons.json', import.meta.url), 'utf8'));
const used = [...new Set([...Object.values(nodes).flatMap((n) => n.icon), ...extra])].sort();
const missing = used.filter((n) => !set.icons[n]);
if (missing.length) throw new Error('Iconos que no existen en Carbon: ' + missing.join(', '));

const out = { prefix: 'carbon', license: 'Apache-2.0', width: set.width, height: set.height, icons: Object.fromEntries(used.map((n) => [n, set.icons[n].body])) };
writeFileSync(new URL('../shared/data/icons.json', import.meta.url), JSON.stringify(out, null, '\t') + '\n');
console.log(`${used.length} iconos: ${used.join(', ')}`);
