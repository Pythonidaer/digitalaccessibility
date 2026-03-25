## Digital Accessibility

I created this project for a job I'm applying for.

The project includes two main accessibility-focused tools: `html-validate` and `@axe-core/cli`. They complement each other by checking HTML semantics and 20-50% of technical accessibility needs that relate to WCAG needs.

---

### `html-validate`

**What does it do?**

`html-validate` is a static HTML linter that parses your `.html` files and enforces correct, standards‑based markup (elements, attributes, ARIA usage, nesting, etc.).

**How it’s configured:**

- Configuration file: `.htmlvalidate.json`
- Current config:

```json
{
  "extends": ["html-validate:recommended"],
  "rules": {
    "element-permitted-content": "error"
  }
}
```

Key points:

- `html-validate:recommended` enables a solid baseline of HTML and accessibility‑related rules.
- `element-permitted-content` ensures elements (like `ul`, `ol`, etc.) only contain allowed children (e.g. `li`, not bare `ul`).

**How to do you run it?**

Enter this at the project root of your terminal:

```bash
npm run lint:html
```

What it does:

- Runs `html-validate "**/*.html"` over all HTML files in the repo.
- Fails if it finds invalid or non‑conforming HTML, with line/column information and links to rule docs.

Use this to keep your markup structurally valid and semantically sound before running higher‑level accessibility checks.

---

### `@axe-core/cli`

**What does it do?**

`@axe-core/cli` is the command‑line interface for Deque’s `axe-core` accessibility engine. It launches a headless browser, loads a page, and runs automated accessibility checks mapped to WCAG criteria.

Unlike `html-validate`, which only looks at static HTML files, `axe-core/cli` inspects the rendered page (DOM + CSS + JS) in a real browser environment.

**How do you configure it?**

It is nstalled as a dev dependency in `package.json`:

```json
{
  "devDependencies": {
    "@axe-core/cli": "^4.11.1"
  }
}
```

The following npm scripts are currently defined:

```json
{
  "scripts": {
    "lint:html": "html-validate \"**/*.html\"",
    "lint:axe": "axe \"http://127.0.0.1:5500/index.html\"",
    "lint:axe:wcag": "axe \"http://127.0.0.1:5500/index.html\" --tags wcag2a,wcag2aa,wcag21a,wcag21aa,wcag22aa",
    "lint:a11y": "npm run lint:html && npm run lint:axe:wcag"
  }
}
```

**Scripts explained:**

- **`npm run lint:axe`**
  - Runs axe against `http://127.0.0.1:5500/index.html`.
  - Uses axe’s default rule set.
  - Useful for a quick automated accessibility scan of the current page.

- **`npm run lint:axe:wcag`**
  - Runs axe against the same Live Server URL, but with specific WCAG tags:
    - `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`, `wcag22aa`
  - Focuses results on rules that map to WCAG 2.x Level A/AA success criteria.
  - This is the main command when you want to see WCAG‑related violations.

- **`npm run lint:a11y`**
  - Convenience script that runs:
    1. `npm run lint:html` (static HTML validation)
    2. `npm run lint:axe:wcag` (runtime accessibility checks)
  - Use this as a combined accessibility check before commits.

**How do you use it?**

1. Make sure your Live Server (or equivalent) is running at:

   ```text
   http://127.0.0.1:5500/index.html
   ```

2. In another terminal, from the project root, run one of the following:

   ```bash
   npm run lint:axe        # quick axe scan
   npm run lint:axe:wcag   # WCAG-focused scan
   npm run lint:a11y       # html-validate + axe in one command
   ```

The CLI will open a headless browser, audit the page, and print a report of violations, each with:

- A description of the problem
- Affected WCAG criteria (when applicable)
- CSS selectors / DOM locations for debugging

### Limitations

Both `html-validate` and `@axe-core/cli` cover the **technical, machine-detectable portion** of accessibility issues — roughly **20–50% of all potential problems**, depending on the site. They excel at:

- Structural HTML and ARIA correctness (roles, attributes, nesting).
- Detectable WCAG violations such as missing labels, missing `alt` attributes, color contrast issues in some contexts, focusable vs. non-focusable elements, etc.

However, **manual and content-focused testing is always required** for:

- Quality and clarity of copy (e.g. is link text meaningful out of context? is alt text useful and non-redundant?).
- Overall interaction flows, error handling, and user understanding.
- Real-world assistive technology behavior across platforms.

Examples of tools and practices used **outside of these linters** to extend coverage:

- **Grammarly** (and similar tools) to support WCAG’s **Understandable** principle by enforcing clearer, more readable, plain language.
- **Screen readers** such as **NVDA**, **JAWS**, and **VoiceOver** to verify reading order, announcements, and interaction are usable in practice.
- **Color contrast analysers / websites** to test contrast ratios for text, icons, and UI controls beyond what automated scanners may catch.
- **CMS restrictions and content governance**: templates, required fields, and validations enforced by developers and admins to keep authors from publishing inaccessible content (e.g. disallowing empty alt text where it’s required, enforcing heading hierarchies).
- **End-to-end tooling** like **Playwright**, **Storybook**, and CI pipelines which can integrate accessibility checks into:
  - Component stories (Storybook + a11y addons).
  - Automated browser tests (Playwright + axe-core).
  - Continuous integration so regressions are caught before deployment.

Together, the automated linters plus these additional tools and manual checks provide a much more complete picture of accessibility than any single tool alone.

---

### Beyond websites: broader digital accessibility needs

Accessibility work extends beyond just web pages. Many users rely on assistive technologies and accessible practices across **desktop applications, mobile apps, and documents**. Important tools and environments include:

- **Desktop screen readers**:
  - **NVDA** (Windows, free and widely used).
  - **JAWS** (Windows, commercial, common in enterprise).
  - **VoiceOver** (macOS, built-in).
- **Mobile screen readers**:
  - **VoiceOver** on iOS and iPadOS.
  - **TalkBack** on Android.
- **Document accessibility**:
  - **Adobe Acrobat Reader** and **Adobe Acrobat Pro** for creating, checking, and remediating accessible PDFs (tags, reading order, alt text, form fields, etc.).
- **Writing and language tools**:
  - **Grammarly** and similar tools to support clear, concise, and plain language across emails, documents, and UIs.

Real-world digital accessibility work typically spans all of these contexts: websites, native apps, and digital documents, plus the organizational processes (training, governance, and content workflows) that keep experiences accessible over time.

---

### Resources

- **axe-core default rules and tags**: see Deque’s axe-core documentation at  
  `https://dequeuniversity.com/rules/axe/`  
  (lists all rules, their severities, and associated WCAG success criteria).
- **`@axe-core/cli` usage docs**:  
  `https://github.com/dequelabs/axe-core-npm/tree/develop/packages/cli`
- **html-validate documentation and rules**:  
  `https://html-validate.org/`  
  (rule reference at `https://html-validate.org/rules/`).
- **differences between WCAG versions**:
  `https://www.audioeye.com/lp/wcag-web-compliance/`
- **W3C Accessibility Audit Repote Template**:
  `https://www.w3.org/WAI/test-evaluate/report-template/`
 - **W3C WAI – Designing for Web Accessibility**:  
   `https://www.w3.org/WAI/tips/designing/`  
   High-level W3C guidance on accessible UI and visual design (contrast, spacing, headings, navigation, feedback) with direct ties to WCAG requirements. \[[source](https://www.w3.org/WAI/tips/designing/)\]
 - **GOV.UK / DfE Design System – Typography**:  
   `https://design.education.gov.uk/design-system/styles/typography`  
   Opinionated, accessibility-friendly typography system (font sizes, line lengths, hierarchy) used across UK government services; a practical reference for readable, accessible text. \[[source](https://design.education.gov.uk/design-system/styles/typography)\]
 - **Material Design 3 – Accessibility overview**:  
   `https://m3.material.io/foundations/overview/principles`  
   Google’s high-level accessibility principles in Material Design 3, explaining how to bake accessibility into layout, color, components, and interactions across platforms. \[[source](https://m3.material.io/foundations/overview/principles)\]

---

## For Cursor Agents

This section summarizes how the static site is structured and how to extend it without fighting existing patterns.

### Content focus

Copy across the site has been shifted away from framing everything around a single job title (e.g. “specialist”) and toward **digital accessibility** as the primary subject. When adding or editing pages, keep that tone unless the page is explicitly about roles or careers.

### Priorities: accessibility, then UX

1. **Accessibility** — Semantic HTML first, native controls where possible, logical headings, landmarks, keyboard operability, visible focus, and restrained ARIA. Do not rely on color alone for meaning. Prefer patterns already used on quiz pages (`fieldset`/`legend`, real labels, live regions used sparingly).
2. **UX** — Clear hierarchy, readable spacing, and predictable behavior come after accessible structure. Avoid flashy or game-like UI; match existing typography and layout.

### Styles and consistency (including devices)

- **Global styles**: `styles.css`, `newer-styles.css` (layout, header, nav, breadcrumbs, section sidebar, focus tokens such as `--focus-color`), and `typography.apple.css`.
- **Section-specific or feature CSS**: Only when needed (e.g. `practice/quizzes/quizzes.css`, `search.css` for the search results page).
- **Responsive behavior**: Header uses a mobile toggle and collapsible primary nav; section navigation uses a viewport-aware toggle in `newer-styles.css`. New UI should respect these breakpoints and not assume hover-only interaction.
- **Consistency** — Reuse existing classes and variables; keep spacing, link styling, and button patterns aligned with pages in `core-concepts/`, `workflows/`, etc.

### Page navigation architecture

- **Primary navigation** — Repeated in each HTML file: logo, `#primary-navigation` with `.primary-nav__list`, and (via `navigation.js`) a **Search** link appended as the last item, pointing to root-relative `search.html` using the same depth rules as other root links.
- **`navigation.js`** — Mobile menu toggle for `#primary-navigation` only; also injects the Search nav item (no inline search field in the header).
- **`section-nav.js`** — Single source of truth for **section sidebars** and **breadcrumbs**:
  - Each page should set `data-site-path` (e.g. `core-concepts/aria-basics.html`) and `data-nav-section` (`core-concepts` | `workflows` | `tools` | `practice` | `reference` | empty for pages without a section menu).
  - Root `index.html` typically omits `data-site-path` or uses `index.html` where section-nav intentionally skips init.
  - The script mounts into `#breadcrumb-root` and `[data-section-nav-mount]` inside `#section-nav-panel`; empty `data-nav-section` hides the section sidebar and toggle.
- **Layout shell** — Inner pages use `.site-layout` > `.site-layout__grid` > sidebar + `.site-layout__primary` > `main#main-content` with `tabindex="-1"` for skip-link targeting.
- **Skip link** — Present on pages; targets `#main-content`.

When adding a new page: copy an existing page in the same folder depth, update `data-site-path` / `data-nav-section`, add the page to **`section-nav.js`** `SECTIONS[...].pages`, and add or regenerate the search index entry (see below).

### Search index and client-side search architecture

The site uses **static, client-side search** suitable for GitHub Pages (no backend).

| Piece | Role |
|--------|------|
| **`data/search-index.json`** | Built artifact: array of entries with `title`, `url` (root-relative, may include `#fragment`), `section`, `summary`, `keywords[]`, and `content` (flattened text for matching). |
| **`scripts/build-search-index.mjs`** | **Source of truth** for index *content*: edit page metadata here, then run `npm run build:search` to regenerate the JSON. |
| **`search.html`** | Dedicated results page: GET `search.html?q=…` (bookmarkable). Full accessible search form lives here only. |
| **`search.js`** | Loaded only on `search.html`: fetches `data/search-index.json` (path prefixed from `data-site-path` depth), normalizes the query, scores matches (title/keywords/summary/content), renders an ordered result list, updates a polite live region for status. |
| **`navigation.js`** | Does **not** implement search logic; only adds the **Search** link in the primary nav. |

Do **not** change the JSON schema casually: `search.js` expects `entries` and the fields above. After adding/removing indexed pages, update **`build-search-index.mjs`** and run **`npm run build:search`**.

