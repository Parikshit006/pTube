import { execSync } from 'child_process';
import fs from 'fs';
try {
  const out = execSync('npm run build', { stdio: 'pipe' });
  fs.writeFileSync('build_errors.txt', out.toString(), 'utf8');
} catch (e) {
  fs.writeFileSync('build_errors.txt', (e.stdout ? e.stdout.toString() : '') + '\n' + (e.stderr ? e.stderr.toString() : ''), 'utf8');
}
