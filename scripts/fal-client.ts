/**
 * fal.ai FLUX Image Generation Client
 * 
 * Usage:
 *   FAL_KEY="your-key" npx tsx scripts/generate-titans.ts
 */

import { fal } from '@fal-ai/client';
import * as fs from 'fs';
import * as path from 'path';

// Configure fal.ai client
const FAL_KEY = process.env.FAL_KEY;
if (!FAL_KEY) {
  console.error('❌ FAL_KEY environment variable required');
  process.exit(1);
}

fal.config({ credentials: FAL_KEY });

// FLUX models on fal.ai
export const FLUX_MODELS = {
  // Fastest, good quality
  fluxSchnell: 'fal-ai/flux/schnell',
  // Best quality, slower
  fluxDev: 'fal-ai/flux/dev',
  // Ultra high quality
  fluxUltra: 'fal-ai/flux-pro/v1.1-ultra',
  // Realistic photos
  fluxRealism: 'fal-ai/flux-realism',
} as const;

type FluxModel = typeof FLUX_MODELS[keyof typeof FLUX_MODELS];

export interface GenerateOptions {
  prompt: string;
  negativePrompt?: string;
  width?: number;
  height?: number;
  seed?: number;
  numInferenceSteps?: number;
  guidanceScale?: number;
  model?: FluxModel;
  outputDir?: string;
  filename?: string;
}

export interface GenerateResult {
  success: boolean;
  url?: string;
  localPath?: string;
  seed: number;
  error?: string;
}

/**
 * Generate a single image with FLUX
 */
export async function generateImage(options: GenerateOptions): Promise<GenerateResult> {
  const {
    prompt,
    negativePrompt = 'anime, cartoon, blurry, low quality, distorted, deformed',
    width = 1024,
    height = 1024,
    seed,
    numInferenceSteps = 28,
    guidanceScale = 3.5,
    model = FLUX_MODELS.fluxDev,
    outputDir = './generated',
    filename,
  } = options;

  try {
    console.log(`🎨 Generating: ${filename || 'image'}...`);
    console.log(`   Model: ${model}`);
    console.log(`   Size: ${width}x${height}`);

    const result = await fal.subscribe(model, {
      input: {
        prompt,
        negative_prompt: negativePrompt,
        image_size: { width, height },
        num_inference_steps: numInferenceSteps,
        guidance_scale: guidanceScale,
        seed: seed || Math.floor(Math.random() * 999999),
        enable_safety_checker: false,
      },
      logs: true,
      onQueueUpdate: (update) => {
        if (update.status === 'IN_PROGRESS') {
          update.logs?.map((log) => log.message).forEach(console.log);
        }
      },
    });

    const imageUrl = result.data.images?.[0]?.url;
    if (!imageUrl) {
      throw new Error('No image URL in response');
    }

    // Download and save locally
    const finalFilename = filename || `flux_${Date.now()}.png`;
    const localPath = await downloadImage(imageUrl, outputDir, finalFilename);

    console.log(`✅ Saved: ${localPath}`);
    console.log(`   Seed: ${result.data.seed}`);

    return {
      success: true,
      url: imageUrl,
      localPath,
      seed: result.data.seed as number,
    };

  } catch (error) {
    console.error(`❌ Generation failed: ${error}`);
    return {
      success: false,
      error: String(error),
      seed: 0,
    };
  }
}

/**
 * Download image from URL to local file
 */
async function downloadImage(url: string, outputDir: string, filename: string): Promise<string> {
  fs.mkdirSync(outputDir, { recursive: true });
  
  const outputPath = path.join(outputDir, filename);
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download: ${response.status} ${response.statusText}`);
  }
  
  const buffer = Buffer.from(await response.arrayBuffer());
  fs.writeFileSync(outputPath, buffer);
  
  return outputPath;
}

/**
 * Generate multiple images in batch
 */
export async function generateBatch(
  items: Array<{ name: string; prompt: string }>,
  options: Omit<GenerateOptions, 'prompt' | 'filename'> & { onProgress?: (current: number, total: number) => void }
): Promise<GenerateResult[]> {
  const results: GenerateResult[] = [];
  
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    console.log(`\n[${i + 1}/${items.length}] Processing: ${item.name}`);
    
    options.onProgress?.(i + 1, items.length);
    
    const result = await generateImage({
      ...options,
      prompt: item.prompt,
      filename: `${item.name}.png`,
    });
    
    results.push(result);
    
    if (i < items.length - 1) {
      await new Promise(r => setTimeout(r, 500));
    }
  }
  
  return results;
}

/**
 * Calculate generation cost estimate
 */
export function estimateCost(count: number, model: FluxModel = FLUX_MODELS.fluxDev): string {
  const costs: Record<string, number> = {
    [FLUX_MODELS.fluxSchnell]: 0.003,
    [FLUX_MODELS.fluxDev]: 0.025,
    [FLUX_MODELS.fluxUltra]: 0.06,
    [FLUX_MODELS.fluxRealism]: 0.025,
  };
  
  const cost = (costs[model] || 0.025) * count;
  return `$${cost.toFixed(2)} USD`;
}
