const galleryEl = document.getElementById("gallery");
const emptyEl = document.getElementById("empty");

function driveViewUrl(fileId) {
  return `https://drive.google.com/file/d/${encodeURIComponent(fileId)}/view`;
}

/** Google Drive thumbnail image for a file (works when the file is shared for viewing). */
function driveThumbnailUrl(fileId, width = 640) {
  return `https://drive.google.com/thumbnail?id=${encodeURIComponent(fileId)}&sz=w${width}`;
}

function playIconSvg() {
  const ns = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(ns, "svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("aria-hidden", "true");
  const path = document.createElementNS(ns, "path");
  path.setAttribute(
    "d",
    "M8 5v14l11-7L8 5zm2.5 3.47L15.03 12 10.5 15.53V8.47z"
  );
  svg.appendChild(path);
  return svg;
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

    const href = item.viewUrl || driveViewUrl(fileId);
    const card = document.createElement("a");
    card.className = "thumb-card";
    card.href = href;
    card.target = "_blank";
    card.rel = "noopener noreferrer";

    const frame = document.createElement("div");
    frame.className = "thumb-card__frame";

    const img = document.createElement("img");
    img.alt = "";
    img.loading = "lazy";
    img.decoding = "async";
    img.src = driveThumbnailUrl(fileId);
    img.addEventListener("error", () => {
      img.remove();
      frame.classList.add("is-fallback");
    });

    const play = document.createElement("div");
    play.className = "thumb-card__play";
    play.appendChild(playIconSvg());

    frame.appendChild(img);
    frame.appendChild(play);

    const body = document.createElement("div");
    body.className = "thumb-card__body";
    const title = document.createElement("h2");
    title.className = "thumb-card__title";
    title.textContent = item.title || "Untitled";
    body.appendChild(title);
    if (item.note) {
      const meta = document.createElement("p");
      meta.className = "thumb-card__meta";
      meta.textContent = item.note;
      body.appendChild(meta);
    }

    card.appendChild(frame);
    card.appendChild(body);
    frag.appendChild(card);
  }
  galleryEl.appendChild(frag);
}

async function load() {
  const folderLink = document.getElementById("folder-link");
  try {
    const res = await fetch("../videos.json", { cache: "no-store" });
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
