/**
 * Generates data/search-index.json from page metadata.
 * Run: node scripts/build-search-index.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

const pages = [
  {
    path: 'index.html',
    title: 'Home',
    section: 'Home',
    summary:
      'Overview of this Digital Accessibility study site: core concepts, workflows, tools, practice, and reference.',
    keywords: [
      'home',
      'specialist',
      'overview',
      'accessibility',
      'study',
      'toc',
      'contents',
    ],
  },
  {
    path: 'core-concepts/index.html',
    title: 'Core Concepts',
    section: 'Core Concepts',
    summary: 'Section index for foundations: accessibility basics, WCAG, laws, ARIA, and the specialist role.',
    keywords: ['core concepts', 'foundations', 'basics', 'wcag', 'overview'],
  },
  {
    path: 'core-concepts/what-is-digital-accessibility.html',
    title: 'What Is Digital Accessibility',
    section: 'Core Concepts',
    summary: 'Introductory notes on what digital accessibility means in practice.',
    keywords: ['accessibility', 'definition', 'introduction', 'digital'],
  },
  {
    path: 'core-concepts/wcag-overview.html',
    title: 'WCAG Overview',
    section: 'Core Concepts',
    summary:
      'WCAG four principles (Perceivable, Operable, Understandable, Robust), success criteria, AA considerations, and WCAG 2.1.',
    keywords: ['wcag', 'pour', 'principles', 'perceivable', 'operable', 'understandable', 'robust', 'criteria', '2.1', 'aa'],
  },
  {
    path: 'core-concepts/pour-principles.html',
    title: 'POUR Principles',
    section: 'Core Concepts',
    summary: 'Notes on the POUR framework aligned with WCAG principles.',
    keywords: ['pour', 'wcag', 'principles', 'perceivable', 'operable'],
  },
  {
    path: 'core-concepts/laws.html',
    title: 'Laws (ADA, Section 508)',
    section: 'Core Concepts',
    summary: 'Legal context including ADA and Section 508 as noted on the site.',
    keywords: ['ada', 'section 508', 'law', 'legal', 'compliance', 'regulation'],
  },
  {
    path: 'core-concepts/conformance-levels.html',
    title: 'Conformance Levels',
    section: 'Core Concepts',
    summary: 'Conformance levels (such as A and AA) and what they imply for audits.',
    keywords: ['conformance', 'level', 'aa', 'a', 'aaa', 'wcag'],
  },
  {
    path: 'core-concepts/disability-categories.html',
    title: 'Disability Categories',
    section: 'Core Concepts',
    summary: 'Categories of disability relevant to inclusive design and testing.',
    keywords: ['disability', 'categories', 'users', 'inclusive'],
  },
  {
    path: 'core-concepts/content-types.html',
    title: 'Content Types',
    section: 'Core Concepts',
    summary: 'Types of content you may audit or remediate: web, apps, documents, video, and more.',
    keywords: ['content', 'types', 'web', 'apps', 'documents', 'video', 'audit'],
  },
  {
    path: 'core-concepts/aria-basics.html',
    title: 'ARIA Basics',
    section: 'Core Concepts',
    summary:
      'What ARIA is, W3C, roles, states, properties, and how ARIA supports WCAG (especially Robust).',
    keywords: ['aria', 'wai', 'w3c', 'roles', 'states', 'properties', 'screen reader', 'widgets'],
  },
  {
    path: 'core-concepts/native-html-vs-aria.html',
    title: 'Native HTML vs ARIA',
    section: 'Core Concepts',
    summary: 'When to prefer native HTML and when ARIA supplements behavior.',
    keywords: ['native', 'html', 'aria', 'semantics', 'comparison'],
  },
  {
    path: 'core-concepts/accessibility-specialist-role.html',
    title: 'Accessibility Specialist Role',
    section: 'Core Concepts',
    summary: 'Role expectations: audits, consultation, training, and cross-team communication.',
    keywords: ['specialist', 'role', 'job', 'consultation', 'audit', 'training'],
  },
  {
    path: 'workflows/index.html',
    title: 'Workflows',
    section: 'Workflows',
    summary: 'Section index for how accessibility work fits into audits, agile, documentation, and stakeholder work.',
    keywords: ['workflows', 'process', 'audit', 'agile'],
  },
  {
    path: 'workflows/audits-and-remediation.html',
    title: 'Audits & Remediation',
    section: 'Workflows',
    summary: 'Audit and remediation workflow notes from the site.',
    keywords: ['audit', 'remediation', 'findings', 'fix'],
  },
  {
    path: 'workflows/accessibility-testing-process.html',
    title: 'Accessibility Testing Process',
    section: 'Workflows',
    summary: 'Testing process steps and considerations.',
    keywords: ['testing', 'process', 'qa', 'verification'],
  },
  {
    path: 'workflows/agile-and-sprints.html',
    title: 'Agile & Sprints',
    section: 'Workflows',
    summary: 'Accessibility work within agile teams and sprint cadence.',
    keywords: ['agile', 'sprint', 'scrum', 'team'],
  },
  {
    path: 'workflows/stakeholders-and-meetings.html',
    title: 'Stakeholders & Meetings',
    section: 'Workflows',
    summary: 'Working with stakeholders, meetings, and communication.',
    keywords: ['stakeholders', 'meetings', 'communication'],
  },
  {
    path: 'workflows/documentation-and-reporting.html',
    title: 'Documentation & Reporting',
    section: 'Workflows',
    summary: 'Documentation, reports, and keeping teams informed.',
    keywords: ['documentation', 'reporting', 'reports', 'deliverables'],
  },
  {
    path: 'workflows/prioritization.html',
    title: 'Prioritization',
    section: 'Workflows',
    summary: 'Prioritizing accessibility issues and remediation order.',
    keywords: ['prioritization', 'priority', 'backlog', 'severity'],
  },
  {
    path: 'workflows/training-content-creators.html',
    title: 'Training Content Creators',
    section: 'Workflows',
    summary: 'Training editors, authors, and content teams on accessibility.',
    keywords: ['training', 'content creators', 'authors', 'editors'],
  },
  {
    path: 'workflows/large-scale-audits.html',
    title: 'Large-Scale Audits',
    section: 'Workflows',
    summary: 'Notes on scaling audits across many pages or properties.',
    keywords: ['large scale', 'audit', 'program', 'enterprise'],
  },
  {
    path: 'workflows/first-30-60-90-days.html',
    title: 'First 30 / 60 / 90 Days',
    section: 'Workflows',
    summary: 'Early priorities when starting an accessibility role.',
    keywords: ['onboarding', '30 60 90', 'first days', 'plan'],
  },
  {
    path: 'tools/index.html',
    title: 'Tools',
    section: 'Tools',
    summary: 'Section index for testing tools, screen readers, PDF, video, and related tooling.',
    keywords: ['tools', 'testing', 'software'],
  },
  {
    path: 'tools/screen-readers.html',
    title: 'Screen Readers & Desktop Testing',
    section: 'Tools',
    summary: 'Screen reader testing on desktop (e.g. JAWS, NVDA) as referenced on the site.',
    keywords: ['screen reader', 'jaws', 'nvda', 'desktop', 'testing', 'assistive'],
  },
  {
    path: 'tools/mobile-tools.html',
    title: 'Mobile Accessibility Tools',
    section: 'Tools',
    summary: 'Mobile accessibility testing tools and approaches.',
    keywords: ['mobile', 'ios', 'android', 'testing', 'tools'],
  },
  {
    path: 'tools/browser-testing-tools.html',
    title: 'Browser Testing Tools',
    section: 'Tools',
    summary: 'Browser extensions and tools such as Lighthouse, Axe, and WAVE mentioned in study notes.',
    keywords: ['browser', 'lighthouse', 'axe', 'wave', 'devtools', 'extension'],
  },
  {
    path: 'tools/pdf-tools.html',
    title: 'PDF Tools',
    section: 'Tools',
    summary: 'PDF accessibility tooling including Acrobat checker and remediation basics.',
    keywords: ['pdf', 'acrobat', 'document', 'remediation', 'checker'],
  },
  {
    path: 'tools/video-tools.html',
    title: 'Video & Captioning Tools',
    section: 'Tools',
    summary: 'Video accessibility and captioning tools.',
    keywords: ['video', 'captions', 'captioning', 'media'],
  },
  {
    path: 'tools/analytics-tools.html',
    title: 'Analytics (see Workflows)',
    section: 'Tools',
    summary: 'Pointer to analytics-related workflow notes on the site.',
    keywords: ['analytics', 'metrics', 'workflows'],
  },
  {
    path: 'tools/office-tools.html',
    title: 'Office / Document Tools',
    section: 'Tools',
    summary: 'Office and document accessibility tooling.',
    keywords: ['office', 'word', 'documents', 'productivity'],
  },
  {
    path: 'practice/index.html',
    title: 'Practice',
    section: 'Practice',
    summary: 'Practice section: quizzes, study questions, tutorials ideas, and tours.',
    keywords: ['practice', 'quizzes', 'study', 'learn'],
  },
  {
    path: 'practice/quizzes/index.html',
    title: 'Quizzes',
    section: 'Practice',
    summary: 'Interactive quizzes and links to topic-based checks.',
    keywords: ['quizzes', 'practice', 'test', 'questions'],
  },
  {
    path: 'practice/quizzes/wcag-basics.html',
    title: 'Quiz: WCAG Basics',
    section: 'Practice',
    summary: 'Interactive quiz on WCAG principles, criteria, and AA notes from the WCAG overview.',
    keywords: ['quiz', 'wcag', 'pour', 'practice', 'test'],
  },
  {
    path: 'practice/quizzes/aria-basics.html',
    title: 'Quiz: ARIA Basics',
    section: 'Practice',
    summary: 'Interactive quiz on ARIA roles, states, and properties from the ARIA basics page.',
    keywords: ['quiz', 'aria', 'roles', 'practice', 'test'],
  },
  {
    path: 'practice/quizzes/study-questions.html',
    title: 'Study Questions',
    section: 'Practice',
    summary: 'Open-ended study prompts from the former Learning page.',
    keywords: ['study', 'questions', 'prep', 'interview'],
  },
  {
    path: 'practice/video-tutorials-ideas.html',
    title: 'Video Tutorial Ideas',
    section: 'Practice',
    summary: 'Ideas for future video tutorials.',
    keywords: ['video', 'tutorials', 'ideas', 'training'],
  },
  {
    path: 'practice/tours/index.html',
    title: 'Tours',
    section: 'Practice',
    summary: 'Placeholder for guided tours.',
    keywords: ['tours', 'placeholder'],
  },
  {
    path: 'reference/index.html',
    title: 'Reference',
    section: 'Reference',
    summary: 'Reference section index: glossary, certifications, interview prep, templates, and notes.',
    keywords: ['reference', 'glossary', 'certifications', 'templates'],
  },
  {
    path: 'reference/glossary.html',
    title: 'Glossary',
    section: 'Reference',
    summary: 'Glossary-style examples including navigation consistency and message pop-ups.',
    keywords: ['glossary', 'definitions', 'terms', 'navigation', 'toast'],
  },
  {
    path: 'reference/certifications.html',
    title: 'Certifications',
    section: 'Reference',
    summary: 'Certifications such as IAAP CPACC / CPWA referenced in study notes.',
    keywords: ['certifications', 'iaap', 'cpacc', 'cpwa', 'credential', 'exam'],
  },
  {
    path: 'reference/interview-prep.html',
    title: 'Interview Prep',
    section: 'Reference',
    summary: 'Interview preparation topics for accessibility roles.',
    keywords: ['interview', 'prep', 'job', 'hiring'],
  },
  {
    path: 'reference/skills-for-specialists.html',
    title: 'Skills for Specialists',
    section: 'Reference',
    summary: 'Skills and competencies useful for accessibility specialists.',
    keywords: ['skills', 'specialist', 'competencies', 'career'],
  },
  {
    path: 'reference/templates.html',
    title: 'Templates & Frameworks',
    section: 'Reference',
    summary: 'Templates and frameworks referenced for accessibility work.',
    keywords: ['templates', 'frameworks', 'checklists'],
  },
  {
    path: 'reference/site-ideas.html',
    title: 'Site Ideas',
    section: 'Reference',
    summary: 'Ideas for improving this study site.',
    keywords: ['site', 'ideas', 'planning'],
  },
  {
    path: 'reference/open-questions.html',
    title: 'Open Questions',
    section: 'Reference',
    summary: 'Open questions and topics to revisit.',
    keywords: ['questions', 'notes', 'todo'],
  },
  {
    path: 'reference/miscellaneous-notes.html',
    title: 'Miscellaneous Notes',
    section: 'Reference',
    summary: 'Miscellaneous reference notes.',
    keywords: ['notes', 'miscellaneous'],
  },
];

const glossaryTerms = [
  {
    path: 'reference/glossary.html#glossary-content-navigation',
    title: 'Glossary: Content Navigation',
    section: 'Reference',
    summary:
      'Glossary entry: primary menus, links, and interactive elements should stay in a predictable order and location across pages.',
    keywords: ['glossary', 'navigation', 'menu', 'consistency', 'predictable'],
    contentExtra:
      'menu links interactive elements same order location across pages cognitive memory predictable labels',
  },
  {
    path: 'reference/glossary.html#glossary-message-popups',
    title: 'Glossary: Message Pop-Ups',
    section: 'Reference',
    summary:
      'Glossary entry: toast and pop-up messages should be perceivable, announced (e.g. live regions), readable in time, and not trap focus.',
    keywords: ['glossary', 'toast', 'pop-up', 'notifications', 'live region', 'focus'],
    contentExtra:
      'toast pop-up messages screen readers aria live regions dismiss focus trap time to read',
  },
];

function buildEntry(p) {
  const kw = (p.keywords || []).join(' ');
  const content = [p.summary, kw, p.title, p.section, p.contentExtra || ''].filter(Boolean).join(' ');
  return {
    title: p.title,
    url: p.path,
    section: p.section,
    summary: p.summary,
    keywords: p.keywords || [],
    content,
  };
}

const entries = [...pages.map(buildEntry), ...glossaryTerms.map(buildEntry)];

const out = {
  version: 1,
  generated: new Date().toISOString().slice(0, 10),
  entries,
};

fs.mkdirSync(path.join(root, 'data'), { recursive: true });
fs.writeFileSync(
  path.join(root, 'data/search-index.json'),
  `${JSON.stringify(out, null, 2)}\n`,
  'utf8'
);
console.log(`Wrote ${entries.length} entries to data/search-index.json`);
