# Titanfall Chronicles - Asset Generation

Professional FLUX image generation pipeline using [fal.ai](https://fal.ai) API.

## 🚀 Quick Start

### 1. Get API Key

1. Sign up at [fal.ai](https://fal.ai)
2. Go to [Dashboard → Keys](https://fal.ai/dashboard/keys)
3. Create a new key
4. Copy your key

### 2. Set Up Environment

```bash
# Copy example file
cp .env.example .env

# Edit .env and add your key
FAL_KEY=your_key_here
```

Or set it inline:
```bash
export FAL_KEY="your_key_here"
```

### 3. Generate Assets

```bash
# Generate all assets (titans + terrain + cards + backgrounds)
npm run generate:all

# Generate only titans
npm run generate:titans

# Generate only terrain
npm run generate:terrain

# Quick generation (faster, lower quality)
npm run generate:quick
```

## 💰 Pricing

| Model | Quality | Speed | Price/Image |
|-------|---------|-------|-------------|
| `flux-schnell` | Good | ~1s | $0.003 |
| `flux-dev` | Excellent | ~5s | $0.025 |
| `flux-ultra` | Ultra | ~10s | $0.060 |

**Recommended:** `flux-dev` for production assets

## 📊 Cost Estimates

| Asset Type | Count | Cost (dev) | Cost (schnell) |
|------------|-------|------------|----------------|
| Titan Portraits | 5 | $0.13 | $0.02 |
| Terrain Tiles | 8 | $0.20 | $0.02 |
| Card Art (20) | 20 | $0.50 | $0.06 |
| Backgrounds | 5 | $0.13 | $0.02 |
| **Total** | **38** | **~$1.00** | **~$0.12** |

## 🎨 Asset Specifications

### Titan Portraits (1024x1024)
- Dramatic cinematic lighting
- Element-themed color palettes
- Upper body composition
- MK11-style character art

### Terrain Tiles (512x512)
- Seamless hand-painted style
- Top-down 3/4 view
- Rich readable details
- Color-coded by terrain type

### Card Art (512x768)
- Dynamic action poses
- Character-focused composition
- Element visual effects
- Professional illustration quality

### Backgrounds (1920x1080)
- Atmospheric wide shots
- Blur-friendly for UI overlay
- Cinematic color grading
- Matte painting style

## 📝 Customizing Prompts

All prompts are in `scripts/prompts.ts`:

```typescript
export const TITAN_PROMPTS = [
  {
    id: 'arcanum',
    name: 'Archmage Arcanum',
    element: 'arcane',
    prompt: 'Your custom prompt here...'
  },
  // ...
];
```

### Universal Style Modifiers

Every prompt automatically includes:
```
masterpiece, best quality, cinematic lighting, dramatic composition,
rich colors, highly detailed, fantasy art, professional illustration,
sharp focus, 8k uhd, artstation trending
```

### Negative Prompt (excluded)
```
anime, cartoon, 3d render, blurry, low quality, distorted, deformed
```

## 🔧 Advanced Usage

### Generate Single Asset

```bash
# Using tsx directly
npx tsx scripts/generate-titans.ts --model=ultra

# With custom output
npx tsx scripts/generate-titans.ts --output-dir=./my-art
```

### Batch with Custom Options

```typescript
import { generateBatch, FLUX_MODELS } from './fal-client';

const results = await generateBatch(
  [
    { name: 'hero', prompt: 'A hero...' },
    { name: 'villain', prompt: 'A villain...' },
  ],
  {
    model: FLUX_MODELS.fluxUltra,
    width: 1024,
    height: 1024,
    outputDir: './custom',
    onProgress: (c, t) => console.log(`${c}/${t}`),
  }
);
```

### Available Models

```typescript
FLUX_MODELS.fluxSchnell  // Fast, good quality
FLUX_MODELS.fluxDev      // Best quality
FLUX_MODELS.fluxUltra    // Ultra high quality
FLUX_MODELS.fluxRealism  // Photorealistic
```

## 📁 Output Structure

```
public/art/
├── titans/
│   ├── arcanum.png
│   ├── maulk.png
│   ├── nyx.png
│   ├── sylvana.png
│   └── solara.png
├── terrain/
│   ├── plain.png
│   ├── forest.png
│   ├── mountain.png
│   └── ...
├── cards/
│   └── (future)
└── bg/
    └── (future)
```

## 🐛 Troubleshooting

### "FAL_KEY environment variable required"
Make sure you've set the `FAL_KEY` environment variable.

### Rate Limiting
If you hit rate limits, the script automatically adds 500ms delays between requests.

### Failed Generations
Failed items are logged. Re-run the script to retry (seeds are random).

### Out of Credits
Check your fal.ai dashboard for credit balance.

## 📚 Resources

- [fal.ai Documentation](https://fal.ai/docs)
- [FLUX Model Info](https://fal.ai/models/fal-ai/flux/dev)
- [Style Guide](../STYLE_GUIDE.md)
