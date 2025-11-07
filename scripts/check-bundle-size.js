import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BUDGET = {
  'index': 500 * 1024, // 500KB for main bundle
  'spline': 2100 * 1024, // 2.1MB allowed for Spline (gzipped it's ~575KB)
  'framer': 100 * 1024, // 100KB for Framer Motion
  'react-vendor': 200 * 1024, // 200KB for React
  'total': 3500 * 1024, // 3.5MB total (accounting for all assets)
};

console.log('🔍 Checking bundle sizes against budget...\n');

const distPath = path.join(__dirname, '../dist/assets');

if (!fs.existsSync(distPath)) {
  console.error('❌ dist/assets folder not found. Run "npm run build" first.');
  process.exit(1);
}

const files = fs.readdirSync(distPath);
let totalSize = 0;
const violations = [];
const results = [];

// Analyze each file
files.forEach((file) => {
  const filePath = path.join(distPath, file);
  const stats = fs.statSync(filePath);
  const sizeKB = (stats.size / 1024).toFixed(2);
  totalSize += stats.size;

  // Check against budgets
  Object.keys(BUDGET).forEach((key) => {
    if (key !== 'total' && file.includes(key)) {
      const budgetKB = (BUDGET[key] / 1024).toFixed(0);
      const status = stats.size > BUDGET[key] ? '❌' : '✅';

      results.push({
        file: file,
        size: sizeKB,
        budget: budgetKB,
        status: status,
        percentage: ((stats.size / BUDGET[key]) * 100).toFixed(1),
      });

      if (stats.size > BUDGET[key]) {
        const overBy = ((stats.size - BUDGET[key]) / 1024).toFixed(0);
        violations.push(
          `${file}: ${sizeKB}KB > ${budgetKB}KB budget (over by ${overBy}KB)`
        );
      }
    }
  });
});

// Display results table
console.log('📦 Bundle Analysis:');
console.log('─'.repeat(80));
results.forEach((r) => {
  console.log(
    `${r.status} ${r.file.padEnd(40)} ${r.size.padStart(10)}KB / ${r.budget.padStart(
      8
    )}KB (${r.percentage}%)`
  );
});
console.log('─'.repeat(80));

// Check total size
const totalMB = (totalSize / 1024 / 1024).toFixed(2);
const budgetMB = (BUDGET.total / 1024 / 1024).toFixed(2);
const totalPercentage = ((totalSize / BUDGET.total) * 100).toFixed(1);

console.log(`\n📊 Total Bundle Size: ${totalMB}MB / ${budgetMB}MB (${totalPercentage}%)`);

if (totalSize > BUDGET.total) {
  const overBy = ((totalSize - BUDGET.total) / 1024 / 1024).toFixed(2);
  violations.push(`Total bundle: ${totalMB}MB > ${budgetMB}MB (over by ${overBy}MB)`);
}

// Report results
if (violations.length > 0) {
  console.log('\n❌ Bundle size budget exceeded:\n');
  violations.forEach((v) => console.error(`  - ${v}`));
  console.log('\n💡 Recommendations:');
  console.log('  - Consider code splitting for large bundles');
  console.log('  - Remove unused dependencies');
  console.log('  - Enable tree shaking');
  console.log('  - Use dynamic imports for large libraries');
  process.exit(1);
} else {
  console.log('\n✅ All bundles within budget!');
  console.log(`📈 Total size: ${totalMB}MB (${totalPercentage}% of budget)`);

  // Show savings
  const savings = BUDGET.total - totalSize;
  const savingsMB = (savings / 1024 / 1024).toFixed(2);
  console.log(`💾 Room for growth: ${savingsMB}MB remaining`);

  process.exit(0);
}
