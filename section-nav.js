/**
 * Section navigation, breadcrumbs, and mobile section menu.
 * Expects document.body.dataset.sitePath (e.g. core-concepts/aria-basics.html)
 * and optional document.body.dataset.navSection (empty = no section sidebar).
 */
(() => {
  const SECTIONS = {
    'core-concepts': {
      label: 'Core Concepts',
      navAriaLabel: 'Core Concepts pages',
      pages: [
        { path: 'core-concepts/index.html', title: 'Core Concepts' },
        { path: 'core-concepts/what-is-digital-accessibility.html', title: 'What Is Digital Accessibility' },
        { path: 'core-concepts/wcag-overview.html', title: 'WCAG Overview' },
        { path: 'core-concepts/pour-principles.html', title: 'POUR Principles' },
        { path: 'core-concepts/laws.html', title: 'Laws (ADA, Section 508)' },
        { path: 'core-concepts/conformance-levels.html', title: 'Conformance Levels' },
        { path: 'core-concepts/disability-categories.html', title: 'Disability Categories' },
        { path: 'core-concepts/content-types.html', title: 'Content Types' },
        { path: 'core-concepts/aria-basics.html', title: 'ARIA Basics' },
        { path: 'core-concepts/native-html-vs-aria.html', title: 'Native HTML vs ARIA' },
        { path: 'core-concepts/accessibility-specialist-role.html', title: 'Accessibility Specialist Role' },
      ],
    },
    workflows: {
      label: 'Workflows',
      navAriaLabel: 'Workflows pages',
      pages: [
        { path: 'workflows/index.html', title: 'Workflows' },
        { path: 'workflows/audits-and-remediation.html', title: 'Audits & Remediation' },
        { path: 'workflows/accessibility-testing-process.html', title: 'Accessibility Testing Process' },
        { path: 'workflows/agile-and-sprints.html', title: 'Agile & Sprints' },
        { path: 'workflows/stakeholders-and-meetings.html', title: 'Stakeholders & Meetings' },
        { path: 'workflows/documentation-and-reporting.html', title: 'Documentation & Reporting' },
        { path: 'workflows/prioritization.html', title: 'Prioritization' },
        { path: 'workflows/training-content-creators.html', title: 'Training Content Creators' },
        { path: 'workflows/large-scale-audits.html', title: 'Large-Scale Audits' },
        { path: 'workflows/first-30-60-90-days.html', title: 'First 30 / 60 / 90 Days' },
      ],
    },
    tools: {
      label: 'Tools',
      navAriaLabel: 'Tools pages',
      pages: [
        { path: 'tools/index.html', title: 'Tools' },
        { path: 'tools/screen-readers.html', title: 'Screen Readers & Desktop Testing' },
        { path: 'tools/mobile-tools.html', title: 'Mobile Accessibility Tools' },
        { path: 'tools/browser-testing-tools.html', title: 'Browser Testing Tools' },
        { path: 'tools/pdf-tools.html', title: 'PDF Tools' },
        { path: 'tools/video-tools.html', title: 'Video & Captioning Tools' },
        { path: 'tools/analytics-tools.html', title: 'Analytics (see Workflows)' },
        { path: 'tools/office-tools.html', title: 'Office / Document Tools' },
      ],
    },
    practice: {
      label: 'Practice',
      navAriaLabel: 'Practice pages',
      pages: [
        { path: 'practice/index.html', title: 'Practice' },
        { path: 'practice/quizzes/index.html', title: 'Quizzes' },
        { path: 'practice/quizzes/wcag-basics.html', title: 'Quiz: WCAG Basics' },
        { path: 'practice/quizzes/aria-basics.html', title: 'Quiz: ARIA Basics' },
        { path: 'practice/quizzes/study-questions.html', title: 'Study Questions' },
        { path: 'practice/video-tutorials-ideas.html', title: 'Video Tutorial Ideas' },
        { path: 'practice/tours/index.html', title: 'Tours' },
        { path: 'practice/exercises/index.html', title: 'Exercises' },
      ],
    },
    reference: {
      label: 'Reference',
      navAriaLabel: 'Reference pages',
      pages: [
        { path: 'reference/index.html', title: 'Reference' },
        { path: 'reference/glossary.html', title: 'Glossary' },
        { path: 'reference/certifications.html', title: 'Certifications' },
        { path: 'reference/interview-prep.html', title: 'Interview Prep' },
        { path: 'reference/skills-for-specialists.html', title: 'Skills for Specialists' },
        { path: 'reference/templates.html', title: 'Templates & Frameworks' },
        { path: 'reference/site-ideas.html', title: 'Site Ideas' },
        { path: 'reference/open-questions.html', title: 'Open Questions' },
        { path: 'reference/miscellaneous-notes.html', title: 'Miscellaneous Notes' },
      ],
    },
  };

  function relativePath(fromPath, toPath) {
    const fromSeg = fromPath.split('/');
    const toSeg = toPath.split('/');
    fromSeg.pop();
    const toFile = toSeg.pop();
    let i = 0;
    const max = Math.min(fromSeg.length, toSeg.length);
    while (i < max && fromSeg[i] === toSeg[i]) i += 1;
    const up = fromSeg.length - i;
    const down = toSeg.slice(i);
    return `${'../'.repeat(up)}${down.length ? `${down.join('/')}/` : ''}${toFile}`;
  }

  function normalizePath(p) {
    return p.replace(/^\.\//, '').replace(/\\/g, '/');
  }

  function buildBreadcrumb(sitePath, sectionKey, pageTitle) {
    const homeHref = relativePath(sitePath, 'index.html');
    const ol = document.createElement('ol');
    ol.className = 'breadcrumb__list';

    const li1 = document.createElement('li');
    li1.className = 'breadcrumb__item';
    const a1 = document.createElement('a');
    a1.href = homeHref;
    a1.textContent = 'Home';
    li1.appendChild(a1);
    ol.appendChild(li1);

    if (sectionKey && SECTIONS[sectionKey]) {
      const sec = SECTIONS[sectionKey];
      const idxPath = sec.pages[0].path;
      const li2 = document.createElement('li');
      li2.className = 'breadcrumb__item';
      const a2 = document.createElement('a');
      a2.href = relativePath(sitePath, idxPath);
      a2.textContent = sec.label;
      li2.appendChild(a2);
      ol.appendChild(li2);
    }

    const liLast = document.createElement('li');
    liLast.className = 'breadcrumb__item breadcrumb__item--current';
    liLast.setAttribute('aria-current', 'page');
    liLast.textContent = pageTitle;
    ol.appendChild(liLast);

    const nav = document.createElement('nav');
    nav.className = 'breadcrumb';
    nav.setAttribute('aria-label', 'Breadcrumb');
    nav.appendChild(ol);
    return nav;
  }

  function buildSectionNav(sitePath, sectionKey) {
    const sec = SECTIONS[sectionKey];
    const nav = document.createElement('nav');
    nav.className = 'section-nav';
    nav.setAttribute('aria-label', sec.navAriaLabel);

    const ul = document.createElement('ul');
    ul.className = 'section-nav__list';

    sec.pages.forEach((p) => {
      const li = document.createElement('li');
      li.className = 'section-nav__item';
      const a = document.createElement('a');
      a.className = 'section-nav__link';
      a.href = relativePath(sitePath, p.path);
      a.textContent = p.title;
      if (normalizePath(p.path) === normalizePath(sitePath)) {
        a.setAttribute('aria-current', 'page');
      }
      li.appendChild(a);
      ul.appendChild(li);
    });

    nav.appendChild(ul);
    return nav;
  }

  function initSectionToggle(sidebar, toggle) {
    const mq = window.matchMedia('(max-width: 768px)');

    function setState(expanded) {
      toggle.setAttribute('aria-expanded', expanded ? 'true' : 'false');
      sidebar.classList.toggle('site-layout__sidebar--open', expanded);
      toggle.classList.toggle('is-open', expanded);
    }

    function syncForViewport() {
      if (mq.matches) {
        toggle.hidden = false;
        const open = toggle.getAttribute('aria-expanded') === 'true';
        setState(open);
      } else {
        toggle.hidden = true;
        sidebar.classList.add('site-layout__sidebar--open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.classList.remove('is-open');
      }
    }

    toggle.addEventListener('click', () => {
      if (!mq.matches) return;
      const next = toggle.getAttribute('aria-expanded') !== 'true';
      setState(next);
    });

    mq.addEventListener('change', syncForViewport);
    syncForViewport();
  }

  function init() {
    const sitePathRaw = document.body.dataset.sitePath;
    if (!sitePathRaw || sitePathRaw === 'index.html') return;

    const sitePath = normalizePath(sitePathRaw);
    const sectionKey = document.body.dataset.navSection || '';
    const pageTitle =
      document.querySelector('main h1')?.textContent?.trim() || 'Page';

    const bcMount = document.getElementById('breadcrumb-root');
    if (bcMount) {
      bcMount.replaceWith(buildBreadcrumb(sitePath, sectionKey, pageTitle));
    }

    const navMount = document.querySelector('[data-section-nav-mount]');
    const sidebar = document.getElementById('section-nav-panel');
    const toggle = document.querySelector('.section-nav-toggle');

    if (sectionKey && SECTIONS[sectionKey] && navMount && sidebar && toggle) {
      sidebar.removeAttribute('aria-hidden');
      navMount.replaceWith(buildSectionNav(sitePath, sectionKey));
      const label = SECTIONS[sectionKey].navAriaLabel;
      toggle.setAttribute('aria-label', `Show or hide ${label}`);
      const toggleText = toggle.querySelector('.section-nav-toggle__text');
      if (toggleText) toggleText.textContent = `Section: ${SECTIONS[sectionKey].label}`;
      initSectionToggle(sidebar, toggle);
    } else {
      if (sidebar) {
        sidebar.hidden = true;
        sidebar.setAttribute('aria-hidden', 'true');
      }
      if (toggle) toggle.hidden = true;
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
