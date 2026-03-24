/**
 * Search results page logic for search.html.
 * Loads /data/search-index.json (relative to site root).
 */
(() => {
  function siteRootPrefix() {
    const raw = document.body?.dataset?.sitePath;
    if (!raw || raw === 'index.html') return '';
    const segments = raw.split('/').filter(Boolean);
    return '../'.repeat(Math.max(0, segments.length - 1));
  }

  function normalize(text) {
    return String(text || '')
      .toLowerCase()
      .replace(/[\u0300-\u036f]/g, '');
  }

  function parseQuery(q) {
    const full = normalize(String(q || '').trim());
    const words = full
      .split(/[^a-z0-9]+/i)
      .map((w) => w.trim())
      .filter((w) => w.length > 1);
    return { full, words };
  }

  function scoreEntry(entry, qFull, words) {
    let score = 0;
    const title = normalize(entry.title);
    const summary = normalize(entry.summary || '');
    const content = normalize(entry.content || '');
    const kwStr = (entry.keywords || []).map(normalize).join(' ');

    if (qFull.length >= 2) {
      if (title.includes(qFull)) score += 100;
      if (kwStr.includes(qFull)) score += 85;
      if (summary.includes(qFull)) score += 45;
      if (content.includes(qFull)) score += 20;
    }

    words.forEach((w) => {
      if (title.includes(w)) score += 45;
      if (kwStr.includes(w)) score += 35;
      if (summary.includes(w)) score += 18;
      if (content.includes(w)) score += 8;
    });

    return score;
  }

  function renderResults(listEl, items, prefix) {
    listEl.innerHTML = '';
    items.forEach((item) => {
      const li = document.createElement('li');
      li.className = 'search-results__item';

      const link = document.createElement('a');
      link.href = `${prefix}${item.entry.url}`;
      link.textContent = item.entry.title;

      const meta = document.createElement('p');
      meta.className = 'search-results__meta';
      meta.textContent = item.entry.section ? `Section: ${item.entry.section}` : '';

      const sum = document.createElement('p');
      sum.className = 'search-results__summary';
      sum.textContent = item.entry.summary || '';

      li.append(link, meta, sum);
      listEl.appendChild(li);
    });
  }

  async function initSearchResultsPage() {
    const listEl = document.getElementById('search-results-list');
    const statusEl = document.getElementById('search-status');
    const emptyEl = document.getElementById('search-empty');
    const headingEl = document.getElementById('search-results-heading');
    if (!listEl || !statusEl || !emptyEl) return;

    const prefix = siteRootPrefix();
    const params = new URLSearchParams(window.location.search);
    const rawQ = params.get('q') || '';
    const pageInput = document.getElementById('search-page-q');
    if (pageInput) pageInput.value = rawQ;

    const { full, words } = parseQuery(rawQ);

    if (!full) {
      statusEl.textContent = 'Enter a search term, then submit the form.';
      emptyEl.hidden = false;
      emptyEl.textContent =
        'No search yet. Use the form above, or open Search from the main navigation.';
      listEl.innerHTML = '';
      if (headingEl) headingEl.textContent = 'Results';
      return;
    }

    if (full.length < 2) {
      statusEl.textContent = 'Enter at least two characters to search.';
      emptyEl.hidden = false;
      emptyEl.textContent = 'Short queries are not run. Add another letter or try a full word.';
      listEl.innerHTML = '';
      if (headingEl) headingEl.textContent = 'Results';
      return;
    }

    statusEl.textContent = 'Loading search index…';

    let data;
    try {
      const res = await fetch(`${prefix}data/search-index.json`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      data = await res.json();
    } catch {
      statusEl.textContent = 'Could not load the search index. Try again later.';
      emptyEl.hidden = false;
      emptyEl.textContent =
        'The search data file failed to load. Check your connection or try reloading the page.';
      listEl.innerHTML = '';
      if (headingEl) headingEl.textContent = 'Results';
      return;
    }

    const entries = Array.isArray(data.entries) ? data.entries : [];
    const scored = entries
      .map((entry) => ({
        entry,
        score: scoreEntry(entry, full, words),
      }))
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score);

    const label = rawQ.length > 80 ? `${rawQ.slice(0, 77)}…` : rawQ;
    if (headingEl) {
      headingEl.textContent =
        scored.length === 0 ? 'No matching pages' : `Results (${scored.length})`;
    }

    if (scored.length === 0) {
      statusEl.textContent = `No results for “${label}”. Try broader or different words (for example WCAG, ARIA, PDF, or audit).`;
      emptyEl.hidden = false;
      emptyEl.textContent =
        'No pages matched that search. Check spelling, use fewer words, or try synonyms such as “screen reader” or “certifications”.';
      listEl.innerHTML = '';
      return;
    }

    statusEl.textContent = `${scored.length} result${scored.length === 1 ? '' : 's'} for “${label}”.`;
    emptyEl.hidden = true;
    emptyEl.textContent = '';
    renderResults(listEl, scored, prefix);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSearchResultsPage);
  } else {
    initSearchResultsPage();
  }
})();
