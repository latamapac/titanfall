#!/usr/bin/env tsx
/**
 * Check fal.ai connection and test generation
 * Supports both key formats:
 *   - FAL_KEY="id:secret" (split format)
 *   - FAL_KEY="full-key" (single format)
 */

import { fal } from '@fal-ai/client';

const FAL_KEY = process.env.FAL_KEY;
if (!FAL_KEY) {
  console.error('❌ FAL_KEY environment variable required');
  process.exit(1);
}

// Handle key_id:key_secret format
if (FAL_KEY.includes(':')) {
  const [keyId, keySecret] = FAL_KEY.split(':');
  fal.config({ 
    credentials: {
      keyId: keyId,
      keySecret: keySecret,
    }
  });
  console.log('🔑 Using key_id:key_secret format\n');
} else {
  fal.config({ credentials: FAL_KEY });
  console.log('🔑 Using single key format\n');
}

async function main() {
  console.log('='.repeat(70));
  console.log('AVAILABLE FLUX MODELS');
  console.log('='.repeat(70));
  
  const fluxModels = [
    { id: 'fal-ai/flux/schnell', name: 'FLUX Schnell', speed: '⚡ Fastest', cost: '~$0.003/img', quality: 'Good' },
    { id: 'fal-ai/flux/dev', name: 'FLUX Dev', speed: '✨ Best Quality', cost: '~$0.025/img', quality: 'Excellent' },
    { id: 'fal-ai/flux-pro/v1.1-ultra', name: 'FLUX Ultra', speed: '👑 Ultra', cost: '~$0.060/img', quality: 'Maximum' },
    { id: 'fal-ai/flux-realism', name: 'FLUX Realism', speed: '📷 Photorealistic', cost: '~$0.025/img', quality: 'Photo-real' },
  ];
  
  for (const model of fluxModels) {
    console.log(`\n${model.name}`);
    console.log(`   ID: ${model.id}`);
    console.log(`   Speed: ${model.speed}`);
    console.log(`   Quality: ${model.quality}`);
    console.log(`   Cost: ${model.cost}`);
  }
  
  // Test generation with schnell
  console.log('\n' + '='.repeat(70));
  console.log('TESTING API CONNECTION');
  console.log('='.repeat(70));
  
  try {
    console.log('\n🧪 Running test generation (FLUX Schnell)...');
    console.log('   Prompt: "Epic fantasy warrior portrait, cinematic lighting"');
    
    const startTime = Date.now();
    
    const result = await fal.subscribe('fal-ai/flux/schnell', {
      input: {
        prompt: 'Epic fantasy warrior portrait, cinematic lighting, masterpiece, highly detailed',
        image_size: { width: 512, height: 512 },
        num_inference_steps: 4,
        seed: 42,
      },
      logs: false,
    });
    
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    
    console.log(`\n✅ SUCCESS! Generation completed in ${duration}s`);
    console.log(`   Seed: ${result.data.seed}`);
    console.log(`   Image URL: ${result.data.images?.[0]?.url?.substring(0, 50)}...`);
    
    console.log('\n✨ Your API key is working perfectly!');
    console.log('   Run: npm run generate:all');
    
  } catch (error: any) {
    console.error('\n❌ Test generation failed!');
    console.error('   Status:', error.status || 'unknown');
    console.error('   Error:', error.message || error);
    
    if (error.status === 401 || error.message?.includes('Unauthorized')) {
      console.error('\n🔑 API key appears to be invalid or expired.');
      console.error('   1. Check your key at: https://fal.ai/dashboard/keys');
      console.error('   2. Generate a new key if needed');
      console.error('   3. Ensure you have credits in your account');
    }
    
    if (error.status === 403 || error.message?.includes('Forbidden')) {
      console.error('\n🚫 Access forbidden. Possible causes:');
      console.error('   - Key format incorrect (should be "key_id:key_secret")');
      console.error('   - Key permissions insufficient');
      console.error('   - Account needs verification');
    }
    
    process.exit(1);
  }
}

main();
