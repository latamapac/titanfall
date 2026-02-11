#!/usr/bin/env tsx
/**
 * Unified Asset Generator - Supports multiple backends
 * 
 * Usage:
 *   # fal.ai (fastest, best quality, ~$1 for full set)
 *   FAL_KEY="key" npx tsx scripts/generate-unified.ts --backend=fal
 *   
 *   # Banana.dev (pay-per-use, ~$0.50 for full set)
 *   BANANA_KEY="key" npx tsx scripts/generate-unified.ts --backend=banana
 *   
 *   # Hugging Face (free, slower, less reliable)
 *   HF_TOKEN="token" npx tsx scripts/generate-unified.ts --backend=hf
 */

import { TITAN_PROMPTS, TERRAIN_PROMPTS } from './prompts';
import { generateBatch as generateBatchFal, estimateCost as estimateCostFal } from './fal-client';
import { generateBatchBanana, BANANA_MODELS } from './banana-client';
import * as path from 'path';

const args = process.argv.slice(2);
const backend = args.find(a => a.startsWith('--backend='))?.split('=')[1] || 'fal';
const what = args.find(a => a.startsWith('--what='))?.split('=')[1] || 'all';

// Check credentials
const hasFal = !!process.env.FAL_KEY;
const hasBanana = !!process.env.BANANA_KEY;
const hasHF = !!process.env.HF_TOKEN;

async function main() {
  console.log('╔════════════════════════════════════════════════════════════════╗');
  console.log('║  🎨 UNIFIED ASSET GENERATOR                                    ║');
  console.log('╚════════════════════════════════════════════════════════════════╝\n');

  // Show available backends
  console.log('Available Backends:');
  console.log(`  ${hasFal ? '🟢' : '⚪'} fal.ai      - Fastest, best quality (~$1/set)`);
  console.log(`  ${hasBanana ? '🟢' : '⚪'} banana.dev  - Pay-per-use, good (~$0.50/set)`);
  console.log(`  ${hasHF ? '🟢' : '⚪'} huggingface - Free, slower, rate-limited`);
  console.log(`\nSelected: ${backend}\n`);

  // Select generator
  let generate: (items: any[], opts: any) => Promise<any[]>;
  let estimateCost: (count: number) => string;

  switch (backend) {
    case 'fal':
      if (!hasFal) {
        console.error('❌ FAL_KEY not set. Get one at https://fal.ai/dashboard/keys');
        process.exit(1);
      }
      const fal = await import('./fal-client');
      generate = (items, opts) => generateBatchFal(items, { ...opts, model: fal.FLUX_MODELS.fluxDev });
      estimateCost = (c) => estimateCostFal(c);
      break;

    case 'banana':
      if (!hasBanana) {
        console.error('❌ BANANA_KEY not set. Get one at https://app.banana.dev');
        console.error('   Minimum $5 credit (never expires)');
        process.exit(1);
      }
      generate = (items, opts) => generateBatchBanana(items, { ...opts, model: BANANA_MODELS.fluxSchnell });
      estimateCost = (c) => `~$${(c * 0.01).toFixed(2)}`;
      break;

    case 'hf':
      console.error('❌ Hugging Face backend not yet implemented');
      process.exit(1);

    default:
      console.error(`❌ Unknown backend: ${backend}`);
      console.error('   Use: --backend=fal | --backend=banana');
      process.exit(1);
  }

  // Prepare items
  const items = [];
  if (what === 'all' || what === 'titans') {
    items.push(...TITAN_PROMPTS.map(t => ({
      name: `titans/${t.id}`,
      prompt: t.prompt,
      size: { width: 1024, height: 1024 },
    })));
  }
  if (what === 'all' || what === 'terrain') {
    items.push(...TERRAIN_PROMPTS.map(t => ({
      name: `terrain/${t.id}`,
      prompt: t.prompt,
      size: { width: 512, height: 512 },
    })));
  }

  console.log('Generation Plan:');
  console.log(`  Items: ${items.length}`);
  console.log(`  Est. Cost: ${estimateCost(items.length)}`);
  console.log(`  Output: public/art/\n`);

  const startTime = Date.now();
  const results = [];

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    console.log(`\n[${i + 1}/${items.length}] ${item.name}`);

    const result = await generate([item], {
      width: item.size.width,
      height: item.size.height,
      outputDir: path.join(__dirname, '../public/art'),
    });

    results.push(...result);
  }

  const duration = ((Date.now() - startTime) / 1000).toFixed(1);
  const success = results.filter(r => r.success).length;

  console.log('\n' + '='.repeat(64));
  console.log('✅ COMPLETE');
  console.log('='.repeat(64));
  console.log(`  Success: ${success}/${results.length}`);
  console.log(`  Duration: ${duration}s`);
  console.log(`  Output: public/art/`);
}

main().catch(console.error);
