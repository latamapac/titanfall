#!/usr/bin/env node
/**
 * Re-generate Titan portraits with proper format
 * - Correct aspect ratio (1024x1024)
 * - Proper PNG format (not JPEG)
 * - Smaller file size (<500KB)
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
  console.error('❌ GEMINI_API_KEY environment variable required');
  process.exit(1);
}

const MODEL = 'gemini-3-pro-image-preview'; // Nano Banana Pro

const TITANS = [
  {
    id: 'arcanum',
    name: 'Archmage Arcanum',
    prompt: `Elder archmage Arcanum, human male with long flowing white hair and majestic beard, wearing ornate deep blue velvet robes with intricate gold embroidery and glowing arcane runes, wielding a crystal staff glowing with intense blue magical energy, standing in commanding pose with raised staff, wise powerful expression, piercing blue eyes, ancient arcane tower interior background with floating magical tomes and glowing symbols, blue and gold magical lighting with particle effects, dramatic rim lighting, rich color grading, upper body portrait composition centered, square 1:1 format, cinematic lighting, dramatic composition, rich colors, highly detailed, professional digital art, masterpiece, best quality`
  },
  {
    id: 'maulk',
    name: 'Bloodlord Maulk',
    prompt: `Demon warlord Maulk, muscular red-skinned orc with wild black hair and large tusks, wearing heavy spiked black iron armor decorated with skulls and bone trophies, wielding a massive blood-stained greatsword dripping with molten lava, aggressive battle-ready stance, fierce snarling expression showing sharp fangs, glowing yellow eyes, volcanic wasteland background with flowing lava rivers and smoke plumes, orange and red fire rim lighting, embers floating in air, dramatic heat distortion, intense warm color grading, menacing atmosphere, upper body portrait composition centered, square 1:1 format, cinematic lighting, dramatic composition, highly detailed, professional digital art, masterpiece, best quality`
  },
  {
    id: 'nyx',
    name: 'Shadow Queen Nyx',
    prompt: `Shadow assassin queen Nyx, lithe human female with long flowing dark purple hair and glowing violet eyes, wearing sleek black leather armor with high collar and face partially covered by shadow veil, dual wielding enchanted daggers dripping with purple shadow essence, dynamic mid-leap combat pose, cold calculating expression, dark void realm background with floating ethereal skulls and shadow wisps, purple and magenta magical rim lighting, smoke effects, dramatic chiaroscuro, mysterious dark atmosphere, upper body portrait composition centered, square 1:1 format, cinematic lighting, dramatic composition, highly detailed, professional digital art, masterpiece, best quality`
  },
  {
    id: 'sylvana',
    name: 'Sylvana the Ancient',
    prompt: `Forest elf druid Sylvana, graceful female with long flowing emerald green hair and pointed ears, wearing elegant green leaf-adorned dress with golden vine accessories and flower crown, wielding a living wooden staff crowned with glowing orange crystal and blooming flowers, serene standing pose with staff raised, gentle mystical expression, vibrant green eyes, enchanted ancient forest background with towering trees and floating golden spores, soft dappled sunlight filtering through leaves, magical golden glow, natural earthy color palette, ethereal atmosphere, upper body portrait composition centered, square 1:1 format, cinematic lighting, highly detailed, professional digital art, masterpiece, best quality`
  },
  {
    id: 'solara',
    name: 'Solara Dragonguard',
    prompt: `Dragon knight Solara, noble warrior with long flowing silver-blonde hair and regal features, wearing ornate silver plate armor with gold filigree and flowing red cape, wielding an elegant winged spear and shield with dragon emblem, heroic standing pose looking to horizon, determined noble expression, piercing gaze, dragon wings partially visible behind shoulders, floating sky castle background above clouds at golden hour sunset, warm golden rim lighting, dramatic clouds, majestic atmosphere, upper body portrait composition centered, square 1:1 format, cinematic lighting, highly detailed, professional digital art, masterpiece, best quality`
  }
];

async function generateImage(prompt, outputPath) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;
  
  const body = {
    contents: [{
      role: "user",
      parts: [{ text: `Generate an image: ${prompt}` }]
    }]
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || `HTTP ${response.status}`);
    }
    
    const parts = data.candidates?.[0]?.content?.parts || [];
    const imagePart = parts.find(p => p.inlineData);
    
    if (!imagePart) {
      throw new Error('No image in response');
    }
    
    const buffer = Buffer.from(imagePart.inlineData.data, 'base64');
    fs.writeFileSync(outputPath, buffer);
    
    return { success: true, size: buffer.length };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function main() {
  console.log('╔════════════════════════════════════════════════════════════════╗');
  console.log('║  🎨 RE-GENERATING TITANS (Proper Format)                       ║');
  console.log('╚════════════════════════════════════════════════════════════════╝\n');
  
  const outputDir = './public/art/titans';
  fs.mkdirSync(outputDir, { recursive: true });
  
  for (let i = 0; i < TITANS.length; i++) {
    const titan = TITANS[i];
    console.log(`[${i + 1}/${TITANS.length}] ${titan.name}`);
    
    const outputPath = path.join(outputDir, `${titan.id}.png`);
    const result = await generateImage(titan.prompt, outputPath);
    
    if (result.success) {
      console.log(`   ✅ Saved: ${outputPath} (${(result.size / 1024).toFixed(1)} KB)`);
    } else {
      console.log(`   ❌ Failed: ${result.error}`);
    }
    
    if (i < TITANS.length - 1) {
      console.log('   ⏳ Waiting 2s...');
      await new Promise(r => setTimeout(r, 2000));
    }
  }
  
  console.log('\n✅ Complete! Check files with: file public/art/titans/*.png');
}

main().catch(console.error);
