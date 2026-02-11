#!/usr/bin/env tsx
/**
 * Hugging Face Inference API Client (FREE tier)
 * 
 * Rate limits: ~1000 requests/day on free tier
 * Speed: Slower than fal.ai but FREE
 */

import * as fs from 'fs';
import * as path from 'path';

const HF_TOKEN = process.env.HF_TOKEN; // Optional but recommended

interface HFGenerateOptions {
  prompt: string;
  negativePrompt?: string;
  width?: number;
  height?: number;
  seed?: number;
  outputDir?: string;
  filename?: string;
  model?: string;
}

const DEFAULT_MODEL = 'black-forest-labs/FLUX.1-dev'; // Requires Pro
// Free alternatives:
const FREE_MODELS = {
  fluxSchnell: 'black-forest-labs/FLUX.1-schnell', // Often busy
  sdxl: 'stabilityai/stable-diffusion-xl-base-1.0',
  playground: 'playgroundai/playground-v2.5-1024px-aesthetic',
};

/**
 * Generate image using Hugging Face Inference API
 */
export async function generateWithHF(options: HFGenerateOptions): Promise<{
  success: boolean;
  localPath?: string;
  error?: string;
}> {
  const {
    prompt,
    negativePrompt = 'anime, cartoon, blurry, low quality',
    width = 1024,
    height = 1024,
    seed,
    outputDir = './generated',
    filename = `hf_${Date.now()}.png`,
    model = FREE_MODELS.playground,
  } = options;

  try {
    console.log(`🎨 Generating with Hugging Face...`);
    console.log(`   Model: ${model}`);
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (HF_TOKEN) {
      headers['Authorization'] = `Bearer ${HF_TOKEN}`;
    }

    const response = await fetch(
      `https://api-inference.huggingface.co/models/${model}`,
      {
        method: 'POST',
        headers,
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            negative_prompt: negativePrompt,
            width,
            height,
            seed: seed || Math.floor(Math.random() * 999999),
            num_inference_steps: 28,
            guidance_scale: 7.5,
          },
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`HTTP ${response.status}: ${error}`);
    }

    const blob = await response.blob();
    const buffer = Buffer.from(await blob.arrayBuffer());
    
    fs.mkdirSync(outputDir, { recursive: true });
    const outputPath = path.join(outputDir, filename);
    fs.writeFileSync(outputPath, buffer);

    console.log(`✅ Saved: ${outputPath}`);
    return { success: true, localPath: outputPath };

  } catch (error: any) {
    console.error(`❌ Failed: ${error.message}`);
    return { success: false, error: error.message };
  }
}

// CLI usage
if (import.meta.url === `file://${process.argv[1]}`) {
  const prompt = process.argv[2] || 'Epic fantasy warrior portrait';
  generateWithHF({ prompt, filename: 'test.png' });
}
