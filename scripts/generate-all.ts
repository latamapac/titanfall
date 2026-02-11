#!/usr/bin/env tsx
/**
 * Generate ALL Assets with fal.ai FLUX
 * 
 * Usage:
 *   FAL_KEY="your-key" npx tsx scripts/generate-all.ts [options]
 * 
 * Options:
 *   --titans-only      Generate only titan portraits
 *   --terrain-only     Generate only terrain tiles
 *   --cards-only       Generate only card art
 *   --backgrounds-only Generate only backgrounds
 *   --model dev        Use specific model
 *   --quick            Use flux-schnell for speed
 */

import { generateBatch, FLUX_MODELS, estimateCost } from './fal-client';
import { TITAN_PROMPTS, TERRAIN_PROMPTS, CARD_PROMPTS, BACKGROUND_PROMPTS } from './prompts';
import * as path from 'path';

interface GenerationJob {
  name: string;
  category: string;
  items: Array<{ name: string; prompt: string }>;
  size: { width: number; height: number };
}

async function main() {
  const args = process.argv.slice(2);
  
  // Parse flags
  const titansOnly = args.includes('--titans-only');
  const terrainOnly = args.includes('--terrain-only');
  const cardsOnly = args.includes('--cards-only');
  const bgOnly = args.includes('--backgrounds-only');
  const quick = args.includes('--quick');
  
  const modelArg = args.find(a => a.startsWith('--model='))?.split('=')[1];
  
  const model = quick ? FLUX_MODELS.fluxSchnell 
    : modelArg === 'ultra' ? FLUX_MODELS.fluxUltra
    : FLUX_MODELS.fluxDev;

  const baseDir = path.join(__dirname, '../public/art');

  // Build job list
  const jobs: GenerationJob[] = [];

  if (!terrainOnly && !cardsOnly && !bgOnly) {
    jobs.push({
      name: 'Titan Portraits',
      category: 'titans',
      items: TITAN_PROMPTS.map(t => ({ name: t.id, prompt: t.prompt })),
      size: { width: 1024, height: 1024 },
    });
  }

  if (!titansOnly && !cardsOnly && !bgOnly) {
    jobs.push({
      name: 'Terrain Tiles',
      category: 'terrain',
      items: TERRAIN_PROMPTS.map(t => ({ name: t.id, prompt: t.prompt })),
      size: { width: 512, height: 512 },
    });
  }

  if (!titansOnly && !terrainOnly && !bgOnly && CARD_PROMPTS.length > 0) {
    jobs.push({
      name: 'Card Art',
      category: 'cards',
      items: CARD_PROMPTS.map(c => ({ name: c.id, prompt: c.prompt })),
      size: { width: 512, height: 768 },
    });
  }

  if (!titansOnly && !terrainOnly && !cardsOnly) {
    jobs.push({
      name: 'Backgrounds',
      category: 'bg',
      items: Object.entries(BACKGROUND_PROMPTS).map(([id, prompt]) => ({ 
        name: id, 
        prompt 
      })),
      size: { width: 1920, height: 1080 },
    });
  }

  // Calculate totals
  const totalItems = jobs.reduce((sum, j) => sum + j.items.length, 0);
  const estCost = estimateCost(totalItems, model);

  console.log('╔══════════════════════════════════════════════════╗');
  console.log('║   TITANFALL CHRONICLES - ASSET GENERATION        ║');
  console.log('╚══════════════════════════════════════════════════╝');
  console.log(`\n🤖 Model: ${model}`);
  console.log(`📦 Jobs: ${jobs.length}`);
  console.log(`🎨 Total Images: ${totalItems}`);
  console.log(`💰 Est. Cost: ${estCost}`);
  console.log('\nJobs:');
  jobs.forEach(j => console.log(`  • ${j.name}: ${j.items.length} images (${j.size.width}x${j.size.height})`));
  
  console.log('\n⚡ Starting generation in 3 seconds...');
  console.log('Press Ctrl+C to cancel\n');
  await new Promise(r => setTimeout(r, 3000));

  const startTime = Date.now();
  let totalSuccess = 0;
  let totalFailed = 0;

  for (const job of jobs) {
    console.log(`\n${'='.repeat(50)}`);
    console.log(`📁 ${job.name}`);
    console.log('='.repeat(50));

    const outputDir = path.join(baseDir, job.category);

    const results = await generateBatch(job.items, {
      model,
      width: job.size.width,
      height: job.size.height,
      outputDir,
      numInferenceSteps: model === FLUX_MODELS.fluxSchnell ? 4 : 28,
      guidanceScale: model === FLUX_MODELS.fluxSchnell ? 1 : 3.5,
      onProgress: (current, total) => {
        const bar = '█'.repeat(Math.round((current / total) * 20)).padEnd(20, '░');
        process.stdout.write(`\r  ${bar} ${current}/${total}`);
      },
    });

    process.stdout.write('\n');

    const success = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;
    totalSuccess += success;
    totalFailed += failed;

    console.log(`  ✅ ${success} | ❌ ${failed}`);
  }

  const duration = ((Date.now() - startTime) / 1000 / 60).toFixed(1);

  console.log('\n' + '='.repeat(50));
  console.log('╔══════════════════════════════════════════════════╗');
  console.log('║   GENERATION COMPLETE                            ║');
  console.log('╚══════════════════════════════════════════════════╝');
  console.log(`\n✅ Total Successful: ${totalSuccess}`);
  console.log(`❌ Total Failed: ${totalFailed}`);
  console.log(`⏱️  Total Duration: ${duration} minutes`);
  console.log(`💰 Total Cost: ${estimateCost(totalSuccess, model)}`);
  console.log('\n📁 Assets saved to: public/art/');
}

main().catch(console.error);
