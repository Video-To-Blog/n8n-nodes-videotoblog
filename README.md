# n8n-nodes-videotoblog

Community node(s) to integrate Video To Blog with n8n.

- Nodes
  - VideoToBlog (Trigger): Emits an item when a post is exported in Video To Blog

## Quick Start

1. Install and link locally:

```sh
npm run build
npm link
# In your n8n custom dir (~/.n8n/custom)
npm link n8n-nodes-videotoblog
n8n start
```

2. Open n8n and add "VideoToBlog" as the first node.
   - Destination: a friendly label (e.g., "Docs")
   - Credentials: VideoToBlog API (enter your n8n API key from Video To Blog Integrations)
3. Click "Listen for test event" to register the Test URL, or Activate the workflow to register the Production URL automatically.
4. Export a blog post from Video To Blog. The trigger will output one item with:
   - html, markdown, emailHtml, title, metaDescription, metaTitle, slug, tags

Optional: None - the trigger auto-registers/unregisters its webhook.

## Node parameters

- Destination (string): Friendly identifier for your publishing target in n8n
- Trigger Event (fixed): Post Exported
  

## Credentials

- VideoToBlog API: Generic header auth, adds `x-api-key: <your_key>`.

## Docs & references

- VideoToBlog n8n integration guide: https://docs.videotoblog.ai/en/help/articles/2997507-n8n
- n8n submission checklist: https://docs.n8n.io/integrations/creating-nodes/deploy/submit-community-nodes/

## HTTPS and modes

- No Base URL field is required in the node UI.
- Test mode (Execute Node) uses the local Test webhook URL; activation registers the Production webhook URL.

## Development

- Lint/build/test with the n8n node CLI scripts already included:
  - `npm run lint`
  - `npm run dev`
  - `npm run build`

## Compatibility

- n8n: 1.x
- License: MIT

