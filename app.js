const galleryEl = document.getElementById("gallery");
const emptyEl = document.getElementById("empty");

function drivePreviewUrl(fileId) {
  return `https://drive.google.com/file/d/${encodeURIComponent(fileId)}/preview`;
}

function driveViewUrl(fileId) {
  return `https://drive.google.com/file/d/${encodeURIComponent(fileId)}/view`;
}

function render(items) {
  galleryEl.innerHTML = "";
  if (!items.length) {
    emptyEl.hidden = false;
    emptyEl.classList.remove("hidden");
    return;
  }
  emptyEl.hidden = true;
  emptyEl.classList.add("hidden");

  const frag = document.createDocumentFragment();
  for (const item of items) {
    const fileId = item.fileId?.trim();
    if (!fileId) continue;

    const card = document.createElement("article");
    card.className = "card";

    const media = document.createElement("div");
    media.className = "card__media";
    const iframe = document.createElement("iframe");
    iframe.src = drivePreviewUrl(fileId);
    iframe.title = item.title || "Video preview";
    iframe.setAttribute("allow", "autoplay");
    iframe.loading = "lazy";
    media.appendChild(iframe);

    const body = document.createElement("div");
    body.className = "card__body";
    const title = document.createElement("h2");
    title.className = "card__title";
    title.textContent = item.title || "Untitled";
    body.appendChild(title);

    if (item.note) {
      const meta = document.createElement("p");
      meta.className = "card__meta";
      meta.textContent = item.note;
      body.appendChild(meta);
    }

    const link = document.createElement("a");
    link.className = "card__link";
    link.href = item.viewUrl || driveViewUrl(fileId);
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = "Open in Google Drive";
    body.appendChild(link);

    card.appendChild(media);
    card.appendChild(body);
    frag.appendChild(card);
  }
  galleryEl.appendChild(frag);
}

async function load() {
  const folderLink = document.getElementById("folder-link");
  try {
    const res = await fetch("./videos.json", { cache: "no-store" });
    if (!res.ok) throw new Error(String(res.status));
    const data = await res.json();
    const folderUrl = typeof data.driveFolderUrl === "string" ? data.driveFolderUrl.trim() : "";
    if (folderUrl && folderLink) {
      folderLink.href = folderUrl;
    }
    const items = Array.isArray(data.items) ? data.items : [];
    render(items);
  } catch {
    render([]);
  }
}

load();
