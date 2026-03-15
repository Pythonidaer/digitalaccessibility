(() => {
    const DEFAULT_CONFIG = {
      mobileBreakpoint: 767,
      mobile: {
        min: 35,
        max: 60,
      },
      desktop: {
        min: 45,
        max: 75,
      },
      selectors: [
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6',
        'p',
        'li',
        'dt',
        'dd',
        'blockquote',
        'figcaption'
      ].join(', ')
    };
  
    const BLOCK_TAGS = new Set([
      'ADDRESS','ARTICLE','ASIDE','BLOCKQUOTE','DD','DETAILS','DIV','DL','DT',
      'FIELDSET','FIGCAPTION','FIGURE','FOOTER','FORM','H1','H2','H3','H4','H5',
      'H6','HEADER','HR','LI','MAIN','NAV','OL','P','PRE','SECTION','TABLE',
      'TD','TH','UL'
    ]);
  
    function normalizeWhitespace(str) {
      return str.replace(/\s+/g, ' ').trim();
    }
  
    function isVisible(el) {
      const style = window.getComputedStyle(el);
      return (
        style.display !== 'none' &&
        style.visibility !== 'hidden' &&
        el.offsetParent !== null
      );
    }
  
    function getMode(config) {
      return window.innerWidth <= config.mobileBreakpoint ? 'mobile' : 'desktop';
    }
  
    function getTargetRange(config) {
      const mode = getMode(config);
      return {
        mode,
        ...(mode === 'mobile' ? config.mobile : config.desktop)
      };
    }
  
    function getClosestBlockAncestor(node, root) {
      let current = node.parentNode;
  
      while (current && current !== root) {
        if (
          current.nodeType === Node.ELEMENT_NODE &&
          BLOCK_TAGS.has(current.tagName)
        ) {
          return current;
        }
        current = current.parentNode;
      }
  
      return root;
    }
  
    function getRelevantTextNodes(root) {
      const walker = document.createTreeWalker(
        root,
        NodeFilter.SHOW_TEXT,
        {
          acceptNode(node) {
            if (!node.textContent || !node.textContent.trim()) {
              return NodeFilter.FILTER_REJECT;
            }
  
            const closestBlock = getClosestBlockAncestor(node, root);
  
            return closestBlock === root
              ? NodeFilter.FILTER_ACCEPT
              : NodeFilter.FILTER_REJECT;
          }
        }
      );
  
      const nodes = [];
      let current;
  
      while ((current = walker.nextNode())) {
        nodes.push(current);
      }
  
      return nodes;
    }
  
    function buildCharMap(textNodes) {
      const charMap = [];
      let rawText = '';
  
      for (const node of textNodes) {
        const text = node.textContent;
  
        for (let i = 0; i < text.length; i++) {
          charMap.push({
            node,
            offset: i
          });
          rawText += text[i];
        }
      }
  
      return { charMap, rawText };
    }
  
    function makeRangeFromGlobalIndexes(charMap, startIndex, endIndexInclusive) {
      if (
        !charMap.length ||
        startIndex < 0 ||
        endIndexInclusive < startIndex ||
        endIndexInclusive >= charMap.length
      ) {
        return null;
      }
  
      const start = charMap[startIndex];
      const end = charMap[endIndexInclusive];
  
      const range = document.createRange();
      range.setStart(start.node, start.offset);
      range.setEnd(end.node, end.offset + 1);
  
      return range;
    }
  
    function getLineCountForRange(charMap, startIndex, endIndexInclusive) {
      const range = makeRangeFromGlobalIndexes(charMap, startIndex, endIndexInclusive);
      if (!range) return 0;
  
      const rects = Array.from(range.getClientRects()).filter(
        rect => rect.width > 0 && rect.height > 0
      );
  
      return rects.length;
    }
  
    function findLineBreakIndex(charMap, startIndex) {
      const baselineLineCount = getLineCountForRange(charMap, startIndex, startIndex);
  
      let low = startIndex;
      let high = charMap.length - 1;
      let best = startIndex;
  
      while (low <= high) {
        const mid = Math.floor((low + high) / 2);
        const lineCount = getLineCountForRange(charMap, startIndex, mid);
  
        if (lineCount <= baselineLineCount) {
          best = mid;
          low = mid + 1;
        } else {
          high = mid - 1;
        }
      }
  
      return best;
    }
  
    function getRenderedLinesForElement(el) {
      const textNodes = getRelevantTextNodes(el);
      if (!textNodes.length) return [];
  
      const { charMap, rawText } = buildCharMap(textNodes);
      if (!charMap.length || !rawText.trim()) return [];
  
      const lines = [];
      let startIndex = 0;
  
      while (startIndex < charMap.length) {
  
        while (
          startIndex < charMap.length &&
          /\s/.test(rawText[startIndex])
        ) {
          startIndex++;
        }
  
        if (startIndex >= charMap.length) break;
  
        const endIndex = findLineBreakIndex(charMap, startIndex);
        const rawLineText = rawText.slice(startIndex, endIndex + 1);
        const normalizedLineText = normalizeWhitespace(rawLineText);
  
        if (normalizedLineText) {
          lines.push({
            text: normalizedLineText,
            length: normalizedLineText.length
          });
        }
  
        startIndex = endIndex + 1;
      }
  
      return lines;
    }
  
    function getElementLabel(el) {
      const idPart = el.id ? `#${el.id}` : '';
      const classPart =
        el.classList.length > 0
          ? `.${Array.from(el.classList).join('.')}`
          : '';
  
      return `${el.tagName.toLowerCase()}${idPart}${classPart}`;
    }
  
    function logStyled(message, color) {
      console.log(`%c${message}`, `color:${color}; font-weight:bold;`);
    }
  
    function testLineLengths(userConfig = {}) {
  
      const config = {
        ...DEFAULT_CONFIG,
        ...userConfig,
        mobile: {
          ...DEFAULT_CONFIG.mobile,
          ...(userConfig.mobile || {})
        },
        desktop: {
          ...DEFAULT_CONFIG.desktop,
          ...(userConfig.desktop || {})
        }
      };
  
      const range = getTargetRange(config);
      const elements = Array.from(document.querySelectorAll(config.selectors))
        .filter(isVisible);
  
      console.clear();
  
      logStyled(
        `Viewport ${window.innerWidth}px | Mode: ${range.mode} | Target: ${range.min}-${range.max}`,
        '#93c5fd'
      );
  
      elements.forEach(el => {
  
        const lines = getRenderedLinesForElement(el);
        if (!lines.length) return;
  
        lines.forEach((line, index) => {
  
          let color = '#ffffff';
          let status = 'OK';
  
          if (line.length > range.max) {
            color = '#facc15'; // yellow
            status = 'TOO LONG';
          }
  
          if (line.length < range.min) {
            color = '#9ca3af'; // light gray
            status = 'SHORT';
          }
  
          const label = getElementLabel(el);
  
          logStyled(
            `[${status}] ${label} | line ${index + 1} | ${line.length} chars | "${line.text}"`,
            color
          );
        });
      });
  
    }
  
    window.testLineLengths = testLineLengths;
  
  })();