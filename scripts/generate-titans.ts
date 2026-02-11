#!/usr/bin/env tsx
/**
 * Generate Titan Portraits with fal.ai FLUX
 * 
 * Usage:
 *   FAL_KEY="your-key" npx tsx scripts/generate-titans.ts
 * 
 * Options:
 *   --model schnell|dev|ultra|realism  (default: dev)
 *   --output-dir ./path               (default: ../public/art/titans)
 */

import { generateBatch, FLUX_MODELS, estimateCost } from './fal-client';
import { TITAN_PROMPTS } from './prompts';
import * as path from 'path';

async function main() {
  const args = process.argv.slice(2);
  const modelArg = args.find(a => a.startsWith('--model='))?.split('=')[1] || 'dev';
  const outputDir = args.find(a => a.startsWith('--output-dir='))?.split('=')[1] 
    || path.join(__dirname, '../public/art/titans');

  const modelMap: Record<string, string> = {
    schnell: FLUX_MODELS.fluxSchnell,
    dev: FLUX_MODELS.fluxDev,
    ultra: FLUX_MODELS.fluxUltra,
    realism: FLUX_MODELS.fluxRealism,
  };

  const model = modelMap[modelArg] || FLUX_MODELS.fluxDev;

  console.log('╔════════════════════════════════════════╗');
  console.log('║   TITAN PORTRAIT GENERATION            ║');
  console.log('╚════════════════════════════════════════╝');
  console.log(`\n📊 Batch Size: ${TITAN_PROMPTS.length} titans`);
  console.log(`🤖 Model: ${model}`);
  console.log(`💰 Est. Cost: ${estimateCost(TITAN_PROMPTS.length, model)}`);
  console.log(`📁 Output: ${outputDir}\n`);

  const items = TITAN_PROMPTS.map(t => ({
    name: t.id,
    prompt: t.prompt,
  }));

  const startTime = Date.now();
  
  const results = await generateBatch(items, {
    model: model as any,
    width: 1024,
    height: 1024,
    outputDir,
    numInferenceSteps: model === FLUX_MODELS.fluxSchnell ? 4 : 28,
    onProgress: (current, total) => {
      const pct = Math.round((current / total) * 100);
      console.log(`\n📈 Progress: ${current}/${total} (${pct}%)`);
    },
  });

  const duration = ((Date.now() - startTime) / 1000).toFixed(1);
  
  // Summary
  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;

  console.log('\n╔════════════════════════════════════════╗');
  console.log('║   GENERATION COMPLETE                  ║');
  console.log('╚════════════════════════════════════════╝');
  console.log(`\n✅ Successful: ${successful}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`⏱️  Duration: ${duration}s`);
  console.log(`💰 Cost: ${estimateCost(successful, model as any)}`);
  
  if (failed > 0) {
    console.log('\n⚠️  Failed items:');
    results.filter(r => !r.success).forEach(r => {
      console.log(`   - ${r.error}`);
    });
  }
}

main().catch(console.error);
