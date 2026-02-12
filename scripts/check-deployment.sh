#!/bin/bash
# ============================================
# Titanfall Chronicles Deployment Checker
# ============================================

set -e

RAILWAY_URL="https://intuitive-creativity-production-8688.up.railway.app"
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo ""
echo "╔══════════════════════════════════════════════════════════╗"
echo "║     🚀 TITANFALL CHRONICLES DEPLOYMENT CHECK             ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""

# 1. Git Status
echo "📦 LOCAL GIT STATUS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
LOCAL_COMMIT=$(git rev-parse --short HEAD)
LOCAL_MSG=$(git log -1 --pretty=%s)
echo -e "  Commit: ${GREEN}$LOCAL_COMMIT${NC}"
echo "  Message: $LOCAL_MSG"
echo ""

# 2. GitHub Status
echo "🌐 GITHUB STATUS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
git fetch origin --quiet 2>/dev/null || true
REMOTE_COMMIT=$(git rev-parse --short origin/main 2>/dev/null || echo "unknown")
echo "  Origin HEAD: $REMOTE_COMMIT"

if [ "$LOCAL_COMMIT" = "$REMOTE_COMMIT" ]; then
    echo -e "  ${GREEN}✅ Synced with GitHub${NC}"
else
    AHEAD=$(git rev-list --count origin/main..HEAD 2>/dev/null || echo "0")
    echo -e "  ${YELLOW}⚠️  Local is $AHEAD commit(s) ahead${NC}"
    echo "     Run: git push"
fi
echo ""

# 3. Live Site Check
echo "🌐 LIVE SITE STATUS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$RAILWAY_URL/" 2>/dev/null || echo "000")
RESPONSE_TIME=$(curl -s -o /dev/null -w "%{time_total}s" "$RAILWAY_URL/" 2>/dev/null || echo "N/A")

echo "  URL: $RAILWAY_URL"
echo "  HTTP Status: $HTTP_CODE"
echo "  Response Time: $RESPONSE_TIME"

if [ "$HTTP_CODE" = "200" ]; then
    echo -e "  ${GREEN}✅ Site is UP${NC}"
elif [ "$HTTP_CODE" = "000" ]; then
    echo -e "  ${RED}❌ Site unreachable${NC}"
else
    echo -e "  ${YELLOW}⚠️  HTTP $HTTP_CODE${NC}"
fi
echo ""

# 4. Asset Deployment Check
echo "🎨 ASSET DEPLOYMENT"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check card frame
ASSET1=$(curl -s -I "$RAILWAY_URL/assets/ui/card_frame_legendary_kargath.png" 2>/dev/null | grep -i content-length | awk '{print $2}' | tr -d '\r')
if [ "$ASSET1" = "892554" ]; then
    echo -e "  ${GREEN}✅ Card Frames${NC} (legendary_kargath: $ASSET1 bytes)"
elif [ "$ASSET1" = "" ]; then
    echo -e "  ${RED}❌ Card Frames not found${NC}"
else
    echo -e "  ${YELLOW}⏳ Card Frames loading${NC} (size: $ASSET1 bytes)"
fi

# Check status icon
ASSET2=$(curl -s -I "$RAILWAY_URL/assets/ui/status_burn.png" 2>/dev/null | grep -i content-length | awk '{print $2}' | tr -d '\r')
if [ -n "$ASSET2" ] && [ "$ASSET2" -gt 1000 ] 2>/dev/null; then
    echo -e "  ${GREEN}✅ Status Icons${NC} (burn: $ASSET2 bytes)"
else
    echo -e "  ${YELLOW}⏳ Status Icons${NC} (size: $ASSET2 bytes)"
fi

# Check HUD
ASSET3=$(curl -s -I "$RAILWAY_URL/assets/ui/hud_healthbar_kargath.png" 2>/dev/null | grep -i content-length | awk '{print $2}' | tr -d '\r')
if [ -n "$ASSET3" ] && [ "$ASSET3" -gt 1000 ] 2>/dev/null; then
    echo -e "  ${GREEN}✅ HUD Elements${NC} (healthbar: $ASSET3 bytes)"
else
    echo -e "  ${YELLOW}⏳ HUD Elements${NC} (size: $ASSET3 bytes)"
fi

echo ""

# 5. Build Info
echo "🔧 BUILD INFORMATION"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
BUILD_FILE=".build-version"
if [ -f "$BUILD_FILE" ]; then
    BUILD_TIME=$(cat "$BUILD_FILE")
    echo "  Last Build: $BUILD_TIME"
else
    echo "  No build timestamp file"
fi

# Count assets locally
LOCAL_ASSETS=$(find public/assets/ui -name "*.png" 2>/dev/null | wc -l | tr -d ' ')
echo "  Local Assets: $LOCAL_ASSETS files"

# Summary
echo ""
echo "═══════════════════════════════════════════════════════════"
if [ "$HTTP_CODE" = "200" ] && [ "$LOCAL_COMMIT" = "$REMOTE_COMMIT" ] && [ "$ASSET1" = "892554" ]; then
    echo -e "${GREEN}✅ ALL CHECKS PASSED - DEPLOYMENT COMPLETE${NC}"
elif [ "$HTTP_CODE" = "200" ] && [ "$LOCAL_COMMIT" = "$REMOTE_COMMIT" ]; then
    echo -e "${YELLOW}⏳ BUILD IN PROGRESS - Assets still deploying${NC}"
else
    echo -e "${RED}❌ ISSUES DETECTED - Check details above${NC}"
fi
echo "═══════════════════════════════════════════════════════════"
echo ""
