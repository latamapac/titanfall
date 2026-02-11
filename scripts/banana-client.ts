#!/usr/bin/env tsx
/**
 * Banana.dev Serverless GPU Client
 * 
 * Pricing: Pay-per-second of GPU time (~$0.001-0.005/sec)
 * Minimum: $5 one-time credit (never expires)
 * Models: FLUX Schnell, FLUX Dev, FLUX Pro
 * 
 * Sign up: https://www.banana.dev
 * Get API Key: https://app.banana.dev
 * 
 * Usage:
 *   BANANA_KEY="your-key" npx tsx scripts/generate-banana.ts
 */

import Banana from '@banana-dev/banana-dev';
import * as fs from 'fs';
import * as path from 'path';

const BANANA_KEY = process.env.BANANA_KEY;

interface BananaGenerateOptions {
  prompt: string;
  negativePrompt?: string;
  width?: number;
  height?: number;
  numSteps?: number;
  guidanceScale?: number;
  seed?: number;
  outputDir?: string;
  filename?: string;
}

// Banana model IDs
export const BANANA_MODELS = {
  // Fastest, cheapest
  fluxSchnell: 'flux-schnell-bf16',
  // Best quality  
  fluxDev: 'flux-dev-bf16',
  // Inpainting/outpainting
  fluxFill: 'flux-fill-pro',
} as const;

type BananaModel = typeof BANANA_MODELS[keyof typeof BANANA_MODELS];

/**
 * Generate image with Banana.dev
 */
export async function generateWithBanana(
  options: BananaGenerateOptions & { model?: BananaModel }
): Promise<{
  success: boolean;
  localPath?: string;
  inferenceTimeMs?: number;
  costEstimate?: string;
  error?: string;
}> {
  if (!BANANA_KEY) {
    return {
      success: false,
      error: 'BANANA_KEY environment variable required. Get one at https://app.banana.dev',
    };
  }

  const {
    prompt,
    negativePrompt = '',
    width = 1024,
    height = 1024,
    numSteps = 4,
    guidanceScale = 3.5,
    seed = Math.floor(Math.random() * 999999),
    outputDir = './generated',
    filename = `banana_${Date.now()}.png`,
    model = BANANA_MODELS.fluxSchnell,
  } = options;

  try {
    console.log(`🍌 Banana.dev - ${model}`);
    console.log(`   Generating: ${filename}`);
    console.log(`   Size: ${width}x${height}`);

    const startTime = Date.now();

    const result = await Banana.run(
      BANANA_KEY,
      model,
      {
        prompt,
        negative_prompt: negativePrompt,
        width,
        height,
        num_inference_steps: numSteps,
        guidance_scale: guidanceScale,
        seed,
      }
    );

    const inferenceTime = Date.now() - startTime;
    
    // Estimate cost (~$0.003/sec for A100)
    const costUsd = (inferenceTime / 1000) * 0.003;

    if (!result.image) {
      throw new Error('No image in response');
    }

    // Decode base64 image
    const base64Data = result.image.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    fs.mkdirSync(outputDir, { recursive: true });
    const outputPath = path.join(outputDir, filename);
    fs.writeFileSync(outputPath, buffer);

    console.log(`✅ Saved: ${outputPath}`);
    console.log(`   Time: ${(inferenceTime / 1000).toFixed(2)}s`);
    console.log(`   Cost: ~$${costUsd.toFixed(4)}`);

    return {
      success: true,
      localPath: outputPath,
      inferenceTimeMs: inferenceTime,
      costEstimate: `~$${costUsd.toFixed(4)}`,
    };

  } catch (error: any) {
    console.error(`❌ Failed: ${error.message}`);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Batch generation with progress
 */
export async function generateBatchBanana(
  items: Array<{ name: string; prompt: string }>,
  options: Omit<BananaGenerateOptions & { model?: BananaModel }, 'prompt' | 'filename'>
): Promise<Array<{ name: string; success: boolean; path?: string; error?: string }>> {
  const results = [];
  let totalCost = 0;

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    console.log(`\n[${i + 1}/${items.length}] ${item.name}`);

    const result = await generateWithBanana({
      ...options,
      prompt: item.prompt,
      filename: `${item.name}.png`,
    });

    results.push({
      name: item.name,
      success: result.success,
      path: result.localPath,
      error: result.error,
    });

    if (result.costEstimate) {
      totalCost += parseFloat(result.costEstimate.replace('~$', ''));
    }

    // Small delay between requests
    if (i < items.length - 1) {
      await new Promise(r => setTimeout(r, 200));
    }
  }

  console.log(`\n💰 Total estimated cost: ~$${totalCost.toFixed(3)}`);
  return results;
}

// CLI usage
if (import.meta.url === `file://${process.argv[1]}`) {
  console.log('╔════════════════════════════════════════════════════════════════╗');
  console.log('║  🍌 BANANA.DEV TEST                                          ║');
  console.log('╚════════════════════════════════════════════════════════════════╝\n');

  if (!BANANA_KEY) {
    console.error('❌ Set BANANA_KEY environment variable');
    console.error('   Get one at: https://app.banana.dev');
    console.error('\nUsage: BANANA_KEY="your-key" npx tsx scripts/banana-client.ts\n');
    process.exit(1);
  }

  console.log('🧪 Testing with FLUX Schnell...');
  console.log('   Prompt: "Epic fantasy warrior portrait, cinematic lighting"\n');

  generateWithBanana({
    prompt: 'Epic fantasy warrior portrait, cinematic lighting, masterpiece, highly detailed',
    width: 1024,
    height: 1024,
    model: BANANA_MODELS.fluxSchnell,
    filename: 'banana-test.png',
    outputDir: './generated',
  }).then(result => {
    if (result.success) {
      console.log('\n✅ Banana.dev is working!');
      console.log('   Ready to generate assets.');
    } else {
      console.log('\n❌ Test failed.');
    }
  });
}
