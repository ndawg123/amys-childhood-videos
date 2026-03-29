# Amy's Childhood Videos

Static gallery prototype. Video list lives in `videos.json` — add objects with `fileId` (from a Google Drive URL like `.../d/FILE_ID/...`), optional `title`, `note`, and optional `viewUrl`.

**GitHub Pages:** Repository → Settings → Pages → Build and deployment → Source: **Deploy from a branch**, branch **main**, folder **/ (root)**.

**Google Drive MCP:** Re-authenticate the Google Docs/Drive integration in Cursor if `searchDriveFiles` returns `invalid_grant`, then list the *Amy's Childhood Videos* folder and copy file IDs into `videos.json`.

Videos must be shared so anyone with the link can view (or signed-in viewers you choose), or embeds will not load for site visitors.
