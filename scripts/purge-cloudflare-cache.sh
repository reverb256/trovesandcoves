#!/bin/bash
# Purge Cloudflare cache for trovesandcoves.ca

# You need to set these environment variables or replace with actual values
# CLOUDFLARE_ZONE_ID=""
# CLOUDFLARE_API_TOKEN=""

if [ -z "$CLOUDFLARE_ZONE_ID" ] || [ -z "$CLOUDFLARE_API_TOKEN" ]; then
  echo "Error: CLOUDFLARE_ZONE_ID and CLOUDFLARE_API_TOKEN must be set"
  echo "Get them from: https://dash.cloudflare.com/profile/api-tokens"
  exit 1
fi

echo "Purging Cloudflare cache for trovesandcoves.ca..."
curl -X POST "https://api.cloudflare.com/client/v4/zones/$CLOUDFLARE_ZONE_ID/purge_cache" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  -H "Content-Type: application/json" \
  --data '{"purge_everything":true}'

echo ""
echo "Done! The site should reflect changes within a few seconds."
echo "Visit: https://trovesandcoves.ca"
