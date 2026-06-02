import { apiFetch, escapeHtml, formatDate } from "./config.js";

export async function initBlogList() {
  const container = document.getElementById("blog-list");
  if (!container) return;

  try {
    const { posts } = await apiFetch("/api/public/blog");
    if (!posts?.length) {
      container.innerHTML = '<p class="col-span-full text-center text-[var(--ib-gray)]">No posts yet.</p>';
      return;
    }
    container.innerHTML = posts
      .map(
        (post) => `
      <a href="/blog/${encodeURIComponent(post.slug)}" class="ib-card ib-blog-card ib-stagger-child">
        ${post.coverImage ? `<img src="${escapeHtml(post.coverImage)}" alt="" loading="lazy" />` : `<div style="aspect-ratio:16/10;background:var(--ib-lavender);border-bottom:3px solid var(--ib-ink)"></div>`}
        <div class="ib-blog-card-body">
          ${post.category ? `<span class="ib-blog-tag">${escapeHtml(post.category)}</span>` : ""}
          <h2 class="mt-2 font-bold text-lg">${escapeHtml(post.title)}</h2>
          <p class="mt-2 line-clamp-2 text-sm text-[var(--ib-gray)]">${escapeHtml(post.excerpt || "")}</p>
          <p class="mt-4 text-xs text-[var(--ib-gray)]">${formatDate(post.publishedAt)}</p>
        </div>
      </a>
    `
      )
      .join("");
    container.classList.add("is-visible");
  } catch {
    container.innerHTML = '<p class="col-span-full text-center text-[var(--ib-gray)]">Unable to load posts.</p>';
  }
}

export async function initBlogPost() {
  const container = document.getElementById("blog-post");
  if (!container) return;

  const params = new URLSearchParams(window.location.search);
  const slug = params.get("slug");
  if (!slug) {
    container.innerHTML = "<p>Post not found.</p>";
    return;
  }

  try {
    const post = await apiFetch(`/api/public/blog/${encodeURIComponent(slug)}`);
    document.title = `${post.title} — Intasia Branding`;

    let bodyHtml = "";
    const content = post.content;
    if (typeof content === "string") bodyHtml = content;
    else if (content && typeof content === "object") {
      if (Array.isArray(content)) {
        bodyHtml = content
          .map((block) => {
            if (block.type === "paragraph" && block.content) {
              return `<p class="mb-4">${block.content.map((c) => c.text || "").join("")}</p>`;
            }
            return "";
          })
          .join("");
      } else if (content.html) bodyHtml = content.html;
    }

    container.innerHTML = `
      <article class="ib-article ib-reveal">
        <div class="ib-article-header">
          ${post.category ? `<span class="ib-blog-tag">${escapeHtml(post.category)}</span>` : ""}
          <h1 class="ib-display text-3xl md:text-4xl mt-4">${escapeHtml(post.title)}</h1>
          <p class="mt-3 text-sm opacity-80">${formatDate(post.publishedAt)} · ${escapeHtml(post.authorName)}</p>
        </div>
        <div class="prose prose-lg max-w-none leading-relaxed">${bodyHtml || `<p>${escapeHtml(post.excerpt || "")}</p>`}</div>
        <a href="/blog/" class="ib-btn ib-btn--outline mt-8 inline-flex">← Back to blog</a>
      </article>
    `;
  } catch {
    container.innerHTML = '<p class="text-[var(--ib-gray)]">Post not found.</p>';
  }
}

const listEl = document.getElementById("blog-list");
const postEl = document.getElementById("blog-post");
if (listEl) initBlogList();
if (postEl) initBlogPost();
