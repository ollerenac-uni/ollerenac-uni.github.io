// Genera data/icons.json con los iconos Carbon que usa el mapa de esta charla (sin red).
// Uso: node scripts/gen-icons.mjs   (necesita node_modules/@iconify-json/carbon)
import { readFileSync, writeFileSync } from 'node:fs';
const mapa = JSON.parse(readFileSync(new URL('../data/mapa.json', import.meta.url), 'utf8'));
const extra = ['earth', 'time', 'security', 'locked', 'warning-alt', 'checkmark-filled', 'network-3', 'chart-network'];
const set = JSON.parse(readFileSync(new URL('../node_modules/@iconify-json/carbon/icons.json', import.meta.url), 'utf8'));
const used = [...new Set([...Object.values(mapa.nodes).map((n) => n.icon), ...extra])].sort();
const missing = used.filter((n) => !set.icons[n]);
if (missing.length) throw new Error('Iconos inexistentes en Carbon: ' + missing.join(', '));
const out = { prefix: 'carbon', license: 'Apache-2.0', width: set.width, height: set.height, icons: Object.fromEntries(used.map((n) => [n, set.icons[n].body])) };
writeFileSync(new URL('../data/icons.json', import.meta.url), JSON.stringify(out, null, '\t') + '\n');
console.log(`${used.length} iconos: ${used.join(', ')}`);
