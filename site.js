(function () {
  'use strict';

  const data = window.PORTFOLIO_DATA;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const caseGalleries = window.PORTFOLIO_CASE_GALLERIES || {};
  const visibleCaseIds = [
    'feelmore-wellness',
    'feelmore-confidence',
    'citi-guidance',
    'citi-platform',
    'weight-watchers'
  ];
  const galleryAssetVersions = {
    'feelmore-confidence': '20260830-1',
    'citi-platform': '20260830-3',
    'citi-guidance': '20260831-1',
    'weight-watchers': '20260831-1'
  };
  let citiTheme = 'Blue';
  const markerPaths = [
    'M4 6C30 4 52 7 77 5C104 3 133 5 162 7L164 31C137 30 111 33 83 31C55 29 29 33 3 31C1 23 2 14 4 6Z',
    'M10 4C6 4 3 9 2 16L1 25C1 31 6 34 13 34L157 32L165 27L162 8C126 5 89 7 53 5C36 4 22 4 10 4Z',
    'M8 3L164 6L158 34L2 31L5 13L8 3Z',
    'M2 9C25 4 47 8 68 6C91 3 112 8 134 5C145 4 155 5 164 8L163 29C143 34 123 29 103 32C81 35 61 30 40 33C24 35 11 32 2 30C4 23 0 16 2 9Z',
    'M6 5C30 6 55 3 79 6C103 9 128 3 161 6L165 12L161 30L154 35C126 31 103 34 78 32C52 30 30 34 4 31L1 25L6 5Z',
    'M6 4L160 6L165 13L160 29L154 34L11 32L2 27L5 22L1 17L7 13L3 9L6 4Z',
    'M3 8C30 3 56 8 82 5C109 2 135 7 163 5L165 28L157 34L143 30L129 35L114 31L99 34L83 30L68 35L52 31L38 34L23 30L9 34L1 28C3 21 0 15 3 8Z',
    'M5 5C35 7 60 2 88 6C112 9 138 3 163 7L161 28C137 31 115 29 93 32C67 35 42 29 5 33L1 27L5 5ZM10 11L158 10L160 25C132 23 106 29 80 26C55 23 34 29 7 27L10 11Z',
    'M13 5C7 5 3 10 2 18C1 27 6 33 15 34C42 31 68 34 94 31C119 28 141 33 158 31L165 25L161 9C139 6 116 8 92 6C65 4 38 6 13 5Z',
    'M3 7L153 4L165 10L162 30L154 34L2 31L5 23L1 16L3 7Z'
  ];

  function randomizeMarkerOnHover(target, marker) {
    let previousShape = Math.floor(Math.random() * markerPaths.length);
    marker.setAttribute('d', markerPaths[previousShape]);
    const chooseNewShape = () => {
      let nextShape;
      do nextShape = Math.floor(Math.random() * markerPaths.length);
      while (nextShape === previousShape);
      previousShape = nextShape;
      marker.setAttribute('d', markerPaths[nextShape]);
    };
    target.addEventListener('pointerenter', chooseNewShape);
    target.addEventListener('focus', () => {
      if (!target.matches(':hover')) chooseNewShape();
    });
  }

  function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, (character) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
    })[character]);
  }

  function initEnvironmentBanner() {
    if (location.hostname !== 'staging.rosslauda.com') return;
    const banner = document.createElement('aside');
    banner.className = 'environment-banner';
    banner.setAttribute('role', 'status');
    banner.textContent = 'this is a staging environment';
    document.body.prepend(banner);
  }

  function noteArrow(direction) {
    const directionClass = direction === 'forward' ? ' is-forward' : ' is-back';
    return `<svg class="detail-nav-arrow${directionClass}" aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M10.3358 16.75L7.04289 13.4571C6.65237 13.0666 6.65237 12.4334 7.04289 12.0429L10.3358 8.75M7.33579 12.75H17.3358" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`;
  }

  async function copyEmail() {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(data.email);
      } else {
        const field = document.createElement('textarea');
        field.value = data.email;
        field.setAttribute('readonly', '');
        field.style.cssText = 'position:fixed;opacity:0;pointer-events:none';
        document.body.appendChild(field);
        field.select();
        document.execCommand('copy');
        field.remove();
      }
      return true;
    } catch (_) {
      window.prompt('Copy email address:', data.email);
      return false;
    }
  }

  function showCopiedBurst(trigger, event) {
    const bounds = trigger.getBoundingClientRect();
    const hasPointerPosition = event.detail > 0 && event.clientX > 0 && event.clientY > 0;
    const x = hasPointerPosition ? event.clientX : bounds.left + bounds.width / 2;
    const y = hasPointerPosition ? event.clientY : bounds.top + bounds.height / 2;
    const burst = document.createElement('span');
    burst.className = 'copied-burst';
    burst.textContent = 'copied!';
    burst.setAttribute('aria-hidden', 'true');
    burst.style.left = `${x}px`;
    burst.style.top = `${y}px`;
    burst.style.setProperty('--copied-rotation', `${-12 + Math.random() * 7}deg`);
    burst.style.setProperty('--copied-x', `${-8 + Math.random() * 16}px`);
    document.body.appendChild(burst);
    burst.addEventListener('animationend', () => burst.remove(), { once: true });
  }

  document.addEventListener('click', async (event) => {
    const trigger = event.target.closest('.js-copy-email');
    if (!trigger) return;
    const copied = await copyEmail();
    if (copied) showCopiedBurst(trigger, event);
  });

  function initEmailHighlights() {
    document.querySelectorAll('.email-highlight').forEach((highlight) => {
      if (!highlight.querySelector('.email-highlight-text')) {
        const text = document.createElement('span');
        text.className = 'email-highlight-text';
        text.textContent = data.email;
        highlight.appendChild(text);
      }
      const link = highlight.closest('.email-link');
      const marker = highlight.querySelector('path');
      if (link && marker) randomizeMarkerOnHover(link, marker);
    });
  }

  function initStickyHeader() {
    const headers = [...document.querySelectorAll('.site-header')];
    if (!headers.length) return;

    let ticking = false;
    const update = () => {
      const isScrolled = window.scrollY > 16;
      headers.forEach((header) => header.classList.toggle('is-scrolled', isScrolled));
      ticking = false;
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('pageshow', update);
    window.addEventListener('load', update, { once: true });
  }

  function initCaseHeader() {
    const hero = document.querySelector('.case-hero');
    const header = hero?.querySelector('.case-header-overlay');
    if (!hero || !header) return;

    let ticking = false;
    const update = () => {
      const heroBottom = hero.getBoundingClientRect().bottom;
      header.classList.toggle('has-background', heroBottom <= header.offsetHeight);
      ticking = false;
    };
    const requestUpdate = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate, { passive: true });
    window.addEventListener('pageshow', requestUpdate);
    window.addEventListener('load', requestUpdate, { once: true });
  }

  function initMobileCaseGalleryHeader() {
    const header = document.querySelector('.case-header-overlay');
    const gallery = document.querySelector('.case-gallery');
    const firstPanel = gallery?.querySelector('[data-case-id="feelmore-wellness"] .case-gallery-item');
    if (!header || !firstPanel) return;

    const root = document.documentElement;
    let ticking = false;
    let bottomSnapTimer = 0;
    let lastScrollY = window.scrollY;
    let scrollDirection = 0;
    let wasBeforeGallery = firstPanel.getBoundingClientRect().top > 0;
    const deviceScreenBottom = () => Math.max(window.innerHeight, firstPanel.getBoundingClientRect().height);
    const pinFirstPanel = () => {
      const firstPanelBottom = firstPanel.getBoundingClientRect().bottom;
      const targetY = window.scrollY + firstPanelBottom - deviceScreenBottom();
      root.style.scrollBehavior = 'auto';
      window.scrollTo(0, targetY);
      root.style.removeProperty('scroll-behavior');
      root.classList.add('feelmore-gallery-snap-active');
      root.classList.add('feelmore-gallery-snap-at-start');
      wasBeforeGallery = false;
    };
    const snapNearestPanelBottom = () => {
      if (window.innerWidth > 700 || !root.classList.contains('feelmore-gallery-snap-active')) return;
      const cardPanel = gallery.querySelector('[data-case-id="feelmore-wellness"][data-gallery-group="1"]');
      const panels = [
        ...gallery.querySelectorAll('[data-case-id="feelmore-wellness"] .case-gallery-item:not(.onboard-card)'),
        ...(cardPanel ? [cardPanel] : [])
      ].filter((panel) => {
        const rect = panel.getBoundingClientRect();
        return rect.height > 0 && rect.bottom > 0 && rect.top < window.innerHeight;
      });
      if (!panels.length) return;
      const screenBottom = deviceScreenBottom();
      const target = panels.reduce((nearest, panel) => {
        const distance = Math.abs(panel.getBoundingClientRect().bottom - screenBottom);
        const nearestDistance = Math.abs(nearest.getBoundingClientRect().bottom - screenBottom);
        return distance < nearestDistance ? panel : nearest;
      });
      const delta = target.getBoundingClientRect().bottom - screenBottom;
      if (target === firstPanel && delta > 1 && scrollDirection < 0) return;
      if (Math.abs(delta) <= 1) return;
      root.style.scrollSnapType = 'none';
      window.scrollTo(0, window.scrollY + delta);
      requestAnimationFrame(() => root.style.removeProperty('scroll-snap-type'));
    };
    const update = () => {
      const rect = gallery.getBoundingClientRect();
      const firstPanelTop = firstPanel.getBoundingClientRect().top;
      const firstPanelBottomOffset = firstPanel.getBoundingClientRect().bottom - deviceScreenBottom();
      const isMobile = window.innerWidth <= 700;
      const isImmersive = isMobile && rect.top <= 72 && rect.bottom > 0;

      if (!isMobile || firstPanelTop > 1) {
        root.classList.remove('feelmore-gallery-snap-active');
        root.classList.remove('feelmore-gallery-snap-at-start');
        wasBeforeGallery = true;
      } else {
        if (wasBeforeGallery) pinFirstPanel();
        else {
          root.classList.add('feelmore-gallery-snap-active');
          root.classList.toggle('feelmore-gallery-snap-at-start', firstPanelBottomOffset >= -1);
        }
      }

      header.classList.toggle('is-gallery-immersive', isImmersive);
      ticking = false;
    };
    const requestUpdate = () => {
      const currentScrollY = window.scrollY;
      const nextDirection = Math.sign(currentScrollY - lastScrollY);
      if (nextDirection) scrollDirection = nextDirection;
      lastScrollY = currentScrollY;
      window.clearTimeout(bottomSnapTimer);
      bottomSnapTimer = window.setTimeout(snapNearestPanelBottom, 120);
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate, { passive: true });
  }

  function initNoteHighlights() {
    document.querySelectorAll('.text-list a, .detail-nav a').forEach((link) => {
      const existingWrapper = link.querySelector('.note-link-label');
      if (existingWrapper) {
        const existingMarker = existingWrapper.querySelector('path');
        if (existingMarker) randomizeMarkerOnHover(link, existingMarker);
        return;
      }
      const textNodes = Array.from(link.childNodes).filter((node) => node.nodeType === Node.TEXT_NODE);
      const label = textNodes.map((node) => node.textContent).join('').trim();
      if (!label) return;
      const insertionPoint = textNodes[textNodes.length - 1].nextSibling;
      textNodes.forEach((node) => node.remove());

      const wrapper = document.createElement('span');
      wrapper.className = 'note-link-label';
      wrapper.innerHTML = `<span class="note-link-base">${escapeHTML(label)}</span><span class="note-link-reveal" aria-hidden="true"><svg viewBox="0 0 166 38" preserveAspectRatio="none"><path/></svg><span class="note-link-highlight-text">${escapeHTML(label)}</span></span>`;
      link.insertBefore(wrapper, insertionPoint);
      randomizeMarkerOnHover(link, wrapper.querySelector('path'));
    });
  }

  function initPrinciples() {
    const section = document.querySelector('.principles');
    if (!section) return;

    const number = section.querySelector('.principle-number');
    const currentNumber = section.querySelector('.number-current');
    const nextNumber = section.querySelector('.number-next');
    const copy = section.querySelector('.principle-copy');
    const animatedCopy = copy.querySelector('.principle-text');
    const title = animatedCopy.querySelector('h3');
    const body = animatedCopy.querySelector('p');
    const dots = section.querySelector('.principle-dots');
    const previousButton = section.querySelector('.previous');
    const nextButton = section.querySelector('.next');
    let current = 0;
    let timer;
    let locked = false;
    const autoplayDuration = 7000;
    const copyOutDuration = 320;
    const incomingStart = 240;
    const transitionDuration = 1040;

    data.principles.forEach((principle, index) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = `principle-dot${index === 0 ? ' active' : ''}`;
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-label', `Show principle ${index + 1}: ${principle.title}`);
      dot.setAttribute('aria-selected', index === 0 ? 'true' : 'false');
      dot.addEventListener('click', () => goTo(index));
      dots.appendChild(dot);
    });

    function updateDots(index) {
      const activeDot = dots.querySelector('.principle-dot.active');
      const nextActiveDot = dots.children[index];
      if (activeDot && activeDot !== nextActiveDot) {
        activeDot.classList.add('leaving');
        window.setTimeout(() => activeDot.classList.remove('leaving'), 440);
      }
      dots.querySelectorAll('.principle-dot').forEach((dot, dotIndex) => {
        dot.classList.toggle('active', dotIndex === index);
        dot.setAttribute('aria-selected', dotIndex === index ? 'true' : 'false');
      });
    }

    function render(index) {
      title.textContent = data.principles[index].title;
      body.textContent = data.principles[index].body;
      updateDots(index);
      updateControls(index);
    }

    function updateControls() {
      previousButton.disabled = false;
      nextButton.disabled = false;
    }

    function goTo(index) {
      if (locked) return;
      if (index === current) {
        restart(current);
        return;
      }
      const target = (index + data.principles.length) % data.principles.length;
      if (reducedMotion) {
        current = target;
        currentNumber.textContent = String(current + 1);
        currentNumber.dataset.number = String(current + 1);
        render(current);
        restart(current);
        return;
      }

      locked = true;
      updateControls(target);
      nextNumber.textContent = String(target + 1);
      nextNumber.dataset.number = String(target + 1);
      animatedCopy.classList.remove('copy-in');
      const outgoingCopy = animatedCopy.cloneNode(true);
      outgoingCopy.classList.add('principle-text-outgoing', 'copy-out');
      outgoingCopy.setAttribute('aria-hidden', 'true');
      copy.appendChild(outgoingCopy);
      animatedCopy.classList.add('is-waiting');
      number.classList.add('changing');
      updateDots(target);
      restart(target);

      window.setTimeout(() => {
        current = target;
        render(current);
        animatedCopy.classList.remove('is-waiting');
        void animatedCopy.offsetWidth;
        animatedCopy.classList.add('copy-in');
      }, incomingStart);

      window.setTimeout(() => outgoingCopy.remove(), copyOutDuration);

      window.setTimeout(() => {
        currentNumber.textContent = String(current + 1);
        currentNumber.dataset.number = String(current + 1);
        number.classList.remove('changing');
        animatedCopy.classList.remove('copy-in');
        locked = false;
        updateControls(current);
      }, transitionDuration);
    }

    function restart(index = current) {
      window.clearTimeout(timer);
      section.classList.remove('is-timing');
      updateDots(index);
      void section.offsetWidth;
      section.classList.add('is-timing');
      timer = window.setTimeout(() => goTo(current + 1), autoplayDuration);
    }

    previousButton.addEventListener('click', () => goTo(current - 1));
    nextButton.addEventListener('click', () => goTo(current + 1));

    const mobileSwipe = window.matchMedia('(max-width: 700px)');
    let swipeStart = null;

    section.addEventListener('pointerdown', (event) => {
      if (!mobileSwipe.matches || event.pointerType === 'mouse') return;
      swipeStart = {
        pointerId: event.pointerId,
        x: event.clientX,
        y: event.clientY,
        time: performance.now()
      };
    });

    section.addEventListener('pointerup', (event) => {
      if (!swipeStart || event.pointerId !== swipeStart.pointerId) return;

      const deltaX = event.clientX - swipeStart.x;
      const deltaY = event.clientY - swipeStart.y;
      const elapsed = performance.now() - swipeStart.time;
      const minimumDistance = Math.max(44, Math.min(72, section.clientWidth * .12));
      const isHorizontalSwipe = Math.abs(deltaX) >= minimumDistance
        && Math.abs(deltaX) > Math.abs(deltaY) * 1.2
        && elapsed <= 800;

      swipeStart = null;
      if (!isHorizontalSwipe) return;
      goTo(deltaX < 0 ? current + 1 : current - 1);
    });

    section.addEventListener('pointercancel', () => {
      swipeStart = null;
    });

    updateControls(current);
    restart();
  }

  function markedParagraph(text, highlight) {
    const safeText = escapeHTML(text);
    if (!highlight) return safeText;
    const phrases = Array.isArray(highlight) ? highlight : [highlight];
    return phrases.reduce((result, phrase) => {
      const safePhrase = escapeHTML(phrase);
      return result.includes(safePhrase) ? result.replace(safePhrase, `<mark>${safePhrase}</mark>`) : result;
    }, safeText);
  }

  const editorialQuotes = {
    'first-metric': ['“Why should anyone care?”'],
    'documentation': ['“What should I do?”', '“How should I think about this?”'],
    'work-between-work': ['“Should I use this pattern?”', '“How should this state behave?”', '“Is there already something that solves this?”']
  };

  function styledParagraph(text, highlight, noteId) {
    let html = markedParagraph(text, highlight);
    (editorialQuotes[noteId] || []).forEach((quote) => {
      if (noteId === 'first-metric' && text.trim() !== quote) return;
      const safeQuote = escapeHTML(quote);
      html = html.replace(safeQuote, `<span class="note-editorial-quote">${safeQuote}</span>`);
    });
    return html;
  }

  function initArticleHighlights() {
    const body = document.querySelector('.note-body');
    if (!body) return;
    const svgNamespace = 'http://www.w3.org/2000/svg';
    let resizeFrame;

    const profiles = [
      { y: .58, bend: -1.2, tilt: 1.1, width: .84, left: 1, right: 8, opacity: .46 },
      { y: .62, bend: 1.5, tilt: -.8, width: .9, left: 1.4, right: 5, opacity: .42 },
      { y: .56, bend: -.7, tilt: 1.6, width: .8, left: .8, right: 9, opacity: .45 }
    ];

    const draw = () => {
      body.querySelectorAll('.note-marker-art').forEach((art) => art.remove());

      body.querySelectorAll('mark').forEach((mark) => {
        const paragraph = mark.closest('p');
        if (!paragraph) return;
        const paragraphRect = paragraph.getBoundingClientRect();
        const fragments = Array.from(mark.getClientRects()).filter((rect) => rect.width > 1 && rect.height > 1);
        if (!fragments.length) return;

        const svg = document.createElementNS(svgNamespace, 'svg');
        svg.classList.add('note-marker-art', `note-marker-lines-${Math.min(fragments.length, 3)}`);
        svg.setAttribute('aria-hidden', 'true');
        svg.setAttribute('viewBox', `0 0 ${paragraphRect.width} ${paragraphRect.height}`);
        svg.setAttribute('preserveAspectRatio', 'none');

        fragments.forEach((rect, index) => {
          const profile = profiles[(index + fragments.length - 1) % profiles.length];
          const x1 = rect.left - paragraphRect.left - profile.left + 8;
          const x2 = rect.right - paragraphRect.left + profile.right - 8;
          const width = x2 - x1;
          const centerY = rect.top - paragraphRect.top + rect.height * profile.y;
          const startY = centerY - profile.tilt;
          const endY = centerY + profile.tilt;
          const path = document.createElementNS(svgNamespace, 'path');
          path.classList.add('note-marker-stroke');
          path.setAttribute('d', `M ${x1} ${startY} C ${x1 + width * .28} ${centerY + profile.bend}, ${x1 + width * .72} ${centerY - profile.bend}, ${x2} ${endY}`);
          path.setAttribute('stroke-width', String(Math.min(29, rect.height * profile.width * 1.3)));
          path.style.opacity = profile.opacity;
          svg.appendChild(path);
        });

        paragraph.appendChild(svg);
      });
    };

    requestAnimationFrame(draw);
    if (document.fonts?.ready) document.fonts.ready.then(draw);
    window.addEventListener('resize', () => {
      cancelAnimationFrame(resizeFrame);
      resizeFrame = requestAnimationFrame(draw);
    }, { passive: true });
  }

  function renderNote() {
    const root = document.querySelector('#note-root');
    if (!root) return;
    const ids = Object.keys(data.notes);
    const requested = new URLSearchParams(location.search).get('id');
    const id = data.notes[requested] ? requested : ids[0];
    const note = data.notes[id];
    const nextId = ids[(ids.indexOf(id) + 1) % ids.length];
    document.title = `${note.title} — Ross Lauda`;

    const numberedSteps = ['Understand the user', 'Explore solutions', 'Build alignment', 'Ship', 'Measure', 'Repeat'];
    const numberedStepsBlock = numberedSteps.join('\n');
    const paragraphs = note.body.split(/\n\n+/).map((paragraph, index) => {
      if (id === 'most-important' && paragraph.trim() === numberedStepsBlock) {
        return `<ol class="note-steps">${numberedSteps.map((step) => `<li>${escapeHTML(step)}</li>`).join('')}</ol>`;
      }
      if (index === 0) {
        return `<p><span class="note-dropcap">${escapeHTML(paragraph.charAt(0))}</span>${styledParagraph(paragraph.slice(1), note.highlight, id)}</p>`;
      }
      return `<p>${styledParagraph(paragraph, note.highlight, id)}</p>`;
    }).join('');

    root.innerHTML = `
      <article class="note-article${/^W/.test(note.body.trim()) ? ' dropcap-w dropcap-shift-left' : /^M/.test(note.body.trim()) ? ' dropcap-m' : /^O/.test(note.body.trim()) ? ' dropcap-o dropcap-shift-left' : ''}">
        <header class="note-heading">
          <h1>${escapeHTML(note.title)}</h1>
          <p>${escapeHTML(note.dek)}</p>
        </header>
        <div class="note-body">${paragraphs}</div>
      </article>
      <nav class="detail-nav footer-nav" aria-label="Article navigation">
        <a class="home-back" href="home.html">${noteArrow('back')}Home</a>
        <span class="nav-copyright">© 2026&nbsp; · &nbsp;Ross Lauda, All rights reserved</span>
        <a href="note.html?id=${nextId}">Next${noteArrow('forward')}</a>
      </nav>`;
  }

  function galleryItemsMarkup(group, caseId) {
    return group.items.map((item, itemIndex) => {
      const left = (item.x / group.width) * 100;
      const top = (item.y / group.height) * 100;
      const width = (item.width / group.width) * 100;
      const height = item.preserveAspectRatio ? 'auto' : `${(item.height / group.height) * 100}%`;
      const layer = Number.isFinite(item.layer) ? item.layer : itemIndex + 1;
      const maxWidth = item.maxWidth || 'none';
      const extraClass = item.className ? ` ${item.className}` : '';
      const onboardingPosition = item.className?.includes('onboard-card')
        ? `--onboard-final-left:${left}%;--onboard-final-top:${top}%;--onboard-start-translate:${((group.width / 2 - (item.x + item.width / 2)) / item.width) * 100}%;`
        : '';
      const style = `--item-left:${left}%;--item-top:${top}%;--item-width:${width}%;--item-height:${height};--item-layer:${layer};${onboardingPosition}max-width:${maxWidth}`;
      if (item.kind === 'label') {
        return `<span class="case-gallery-item case-gallery-label" style="${style}">${escapeHTML(item.text)}</span>`;
      }
      if (item.kind === 'typography-specimen') {
        return `<span class="case-gallery-item case-typography-specimen" style="${style}"><span class="case-type-family">Interstate</span><span class="case-type-sizes"><span>64pt</span><span>40pt</span><span>20pt</span><span>16pt</span><span>14pt</span><span>10pt</span></span><span class="case-type-weights"><span>Light</span><span>Regular</span><span>Bold</span></span></span>`;
      }
      if (item.kind === 'device-frame') {
        return `<span class="case-gallery-item case-device-frame has-box-shadow is-ready" aria-hidden="true" style="${style}"></span>`;
      }
      if (item.kind === 'device-shadow') {
        return `<span class="case-gallery-item case-device-shadow" aria-hidden="true" style="${style}"></span>`;
      }
      if (item.kind === 'layered-device-video') {
        return `<span class="case-gallery-item case-device-frame case-layered-device has-box-shadow" style="${style}"><img class="case-layered-device-background" src="${item.background}" alt="" decoding="async"><video class="case-layered-device-video" src="${item.video}" poster="${item.background}" muted playsinline preload="metadata" data-play-on-view aria-hidden="true"></video><img class="case-layered-device-overlay" src="${item.overlay}" alt="" decoding="async"></span>`;
      }
      const version = galleryAssetVersions[caseId];
      const fileName = item.src.split('/').pop();
      const assetPath = caseId === 'citi-platform'
        ? `assets/cases/citi-platform/${citiTheme}/${fileName}`
        : item.src;
      const source = version ? `${assetPath}?v=${version}` : assetPath;
      const themeAttributes = caseId === 'citi-platform'
        ? ` data-citi-theme-asset data-citi-file="${escapeHTML(fileName)}"`
        : '';
      const shouldFrame = item.frame === false ? false : Boolean(item.frame || group.frame);
      if (shouldFrame) {
        const orientationClass = item.width > item.height ? ' is-landscape' : '';
        const borderClass = item.border === false ? ' no-device-border' : '';
        return `<span class="case-gallery-item case-device-frame${orientationClass}${borderClass}${item.shadow ? ' has-box-shadow' : ''}${extraClass}" style="${style}"><img src="${source}" alt="" decoding="async"${themeAttributes}></span>`;
      }
      return `<img class="case-gallery-item case-gallery-image${extraClass}" src="${source}" alt="" decoding="async"${themeAttributes}${item.shadow ? ' data-shadow="true"' : ''} style="${style}">`;
    }).join('');
  }

  function citiThemeSwitcherMarkup() {
    return `<div class="citi-theme-switcher-anchor">
      <div class="citi-theme-switcher" data-theme="Blue" role="group" aria-label="Citi visual theme">
        <span class="citi-theme-indicator" aria-hidden="true"></span>
        ${['Blue', 'Priority', 'Gold'].map((theme) => `<button type="button" data-citi-theme="${theme}" aria-pressed="${theme === 'Blue'}">${theme}</button>`).join('')}
      </div>
    </div>`;
  }

  function galleryMarkup(caseStudy, id) {
    return (caseGalleries[id] || []).map((group, groupIndex) => {
      const innerLeft = (group.x / 1180) * 100;
      const innerWidth = (group.width / 1180) * 100;
      return `
        <figure class="case-gallery-figure case-composition" role="img" aria-label="${escapeHTML(caseStudy.company)} — ${escapeHTML(caseStudy.title)}, visual ${groupIndex + 1}" data-case-id="${id}" data-gallery-group="${groupIndex}" data-onboarding-threshold="${group.onboardingThreshold || ''}" style="aspect-ratio:1180/${group.height}">
          <div class="case-composition-inner" style="left:${innerLeft}%;width:${innerWidth}%"></div>
        </figure>`;
    }).join('');
  }

  function initCaseGalleryImages(scope = document) {
    scope.querySelectorAll('.case-device-frame img, .case-gallery-image').forEach((image) => {
      if (image.dataset.galleryImageReady === 'pending') return;
      image.dataset.galleryImageReady = 'pending';
      const frame = image.closest('.case-device-frame');
      const revealTarget = frame || image;

      const reveal = () => {
        const decoded = typeof image.decode === 'function' ? image.decode() : Promise.resolve();
        decoded.catch(() => {}).then(() => {
          requestAnimationFrame(() => {
            if (image.dataset.shadow === 'true') image.classList.add('has-shadow');
            revealTarget.classList.add('is-ready');
            image.dataset.galleryImageReady = 'complete';
          });
        });
      };

      if (image.complete && image.naturalWidth) reveal();
      else {
        image.addEventListener('load', reveal, { once: true });
        image.addEventListener('error', () => revealTarget.classList.add('is-ready'), { once: true });
      }
    });
  }

  function initCaseGalleryHydration() {
    const figures = [...document.querySelectorAll('.case-gallery-figure[data-case-id]')];
    if (!figures.length) return;

    const hydrate = (figure) => {
      if (figure.dataset.hydrated === 'true') return;
      const groups = caseGalleries[figure.dataset.caseId];
      const group = groups?.[Number(figure.dataset.galleryGroup)];
      const inner = figure.querySelector('.case-composition-inner');
      if (!group || !inner) return;
      figure.dataset.hydrated = 'true';
      inner.innerHTML = galleryItemsMarkup(group, figure.dataset.caseId);
      initCaseGalleryImages(inner);
      initViewportVideos();
      initOnboardingCardReveal();
    };

    const shouldHydrateFeelmoreMobile = window.matchMedia('(max-width:700px)').matches
      && figures.some((figure) => figure.dataset.caseId === 'feelmore-wellness');
    if (shouldHydrateFeelmoreMobile) {
      figures.forEach((figure) => {
        figure.classList.add('is-render-active');
        hydrate(figure);
      });
      return;
    }

    if (!('IntersectionObserver' in window)) {
      figures.forEach((figure) => {
        figure.classList.add('is-render-active');
        hydrate(figure);
      });
      return;
    }

    const hydrationObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        hydrate(entry.target);
        hydrationObserver.unobserve(entry.target);
      });
    }, { rootMargin: '800px 0px' });

    const renderingObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => entry.target.classList.toggle('is-render-active', entry.isIntersecting));
    }, { rootMargin: '320px 0px' });

    figures.forEach((figure) => {
      hydrationObserver.observe(figure);
      renderingObserver.observe(figure);
    });
  }

  function initOnboardingCardReveal() {
    const figures = [...document.querySelectorAll('.case-gallery-figure:has(.onboard-card)')]
      .filter((figure) => figure.dataset.onboardingRevealBound !== 'true');
    if (!figures.length) return;
    const reveal = (figure) => figure.classList.add('is-onboarding-revealed');
    if (!('IntersectionObserver' in window)) {
      figures.forEach(reveal);
      return;
    }
    figures.forEach((figure) => {
      figure.dataset.onboardingRevealBound = 'true';
      const threshold = Number(figure.dataset.onboardingThreshold) || 0.18;
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          reveal(entry.target);
          observer.unobserve(entry.target);
        });
      }, { threshold });
      observer.observe(figure);
    });
  }

  function initViewportVideos() {
    const videos = [...document.querySelectorAll('video[data-play-on-view]')]
      .filter((video) => video.dataset.viewportPlaybackBound !== 'true');
    if (!videos.length) return;

    const playOnce = (video) => {
      if (video.dataset.hasPlayed === 'true') return;
      video.dataset.hasPlayed = 'true';
      video.play().catch(() => {
        video.dataset.hasPlayed = 'false';
      });
    };

    if (!('IntersectionObserver' in window)) {
      videos.forEach(playOnce);
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        playOnce(entry.target);
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.5 });

    videos.forEach((video) => {
      video.dataset.viewportPlaybackBound = 'true';
      observer.observe(video);
    });
  }

  function initCitiThemeSwitcher() {
    const switcher = document.querySelector('.citi-theme-switcher');
    const anchor = switcher?.closest('.citi-theme-switcher-anchor');
    const gallery = switcher?.closest('.case-gallery');
    if (!switcher || !anchor || !gallery) return;

    const buttons = [...switcher.querySelectorAll('[data-citi-theme]')];
    const indicator = switcher.querySelector('.citi-theme-indicator');
    let switchToken = 0;
    let ticking = false;

    const positionIndicator = (button, animate = true) => {
      if (!button || !indicator) return;
      if (!animate) indicator.style.transition = 'none';
      indicator.style.width = `${button.offsetWidth}px`;
      indicator.style.transform = `translateX(${button.offsetLeft}px)`;
      if (!animate) requestAnimationFrame(() => { indicator.style.transition = ''; });
    };

    const themedSource = (fileName, theme) => {
      const version = galleryAssetVersions['citi-platform'];
      return `assets/cases/citi-platform/${theme}/${fileName}${version ? `?v=${version}` : ''}`;
    };

    const revealOrigins = [
      { name: 'top-left', x: '-12px', y: '-12px' },
      { name: 'top-right', x: 'calc(100% + 12px)', y: '-12px' },
      { name: 'bottom-left', x: '-12px', y: 'calc(100% + 12px)' },
      { name: 'bottom-right', x: 'calc(100% + 12px)', y: 'calc(100% + 12px)' }
    ];
    const revealBorderColors = {
      Blue: '#056dae',
      Priority: '#0e2a48',
      Gold: '#b4975a'
    };
    const waitForImage = (image) => new Promise((resolve, reject) => {
      const decode = () => {
        if (typeof image.decode !== 'function') return resolve();
        image.decode().then(resolve).catch(() => image.naturalWidth ? resolve() : reject(new Error('Image decode failed')));
      };
      if (image.complete) {
        if (image.naturalWidth) decode();
        else reject(new Error('Image load failed'));
        return;
      }
      image.addEventListener('load', decode, { once: true });
      image.addEventListener('error', () => reject(new Error('Image load failed')), { once: true });
    });

    const createRevealRing = (image, overlay, origin, color) => {
      const host = document.createElement('span');
      host.className = 'case-theme-reveal-ring-host';
      host.dataset.for = image.dataset.citiFile;
      if (image.classList.contains('case-gallery-image')) {
        host.classList.add('case-gallery-item');
        host.style.cssText = image.style.cssText;
      }

      const ring = document.createElement('span');
      ring.className = 'case-theme-reveal-ring';
      ring.style.borderColor = color;
      ring.style.left = origin.x;
      ring.style.top = origin.y;
      host.appendChild(ring);
      image.parentElement?.appendChild(host);

      const rect = overlay.getBoundingClientRect();
      const x = origin.name.includes('right') ? rect.width + 12 : -12;
      const y = origin.name.includes('bottom') ? rect.height + 12 : -12;
      const radius = Math.hypot(Math.max(x, rect.width - x), Math.max(y, rect.height - y));
      return { host, ring, radius };
    };

    const prepareReveal = (image, nextSource, token, borderColor) => {
      const loader = new Image();
      loader.decoding = 'async';
      loader.src = nextSource;

      return waitForImage(loader).then(() => {
        if (token !== switchToken) return null;
        const existing = image.parentElement?.querySelector(`.case-theme-reveal[data-for="${image.dataset.citiFile}"]`);
        const existingRing = image.parentElement?.querySelector(`.case-theme-reveal-ring-host[data-for="${image.dataset.citiFile}"]`);
        existing?.remove();
        existingRing?.remove();
        const origin = revealOrigins[Math.floor(Math.random() * revealOrigins.length)];
        const overlay = image.cloneNode(false);
        overlay.src = nextSource;
        overlay.loading = 'eager';
        overlay.decoding = 'async';
        overlay.removeAttribute('data-shadow');
        overlay.removeAttribute('data-citi-theme-asset');
        overlay.classList.add('case-theme-reveal');
        overlay.classList.remove('is-ready', 'has-shadow');
        overlay.dataset.for = image.dataset.citiFile;
        const originPoint = `${origin.x} ${origin.y}`;
        overlay.dataset.revealOrigin = origin.name;
        overlay.style.clipPath = `circle(0px at ${originPoint})`;
        image.parentElement?.appendChild(overlay);
        let committed = false;

        return waitForImage(overlay).then(() => {
          const { host: ringHost, ring, radius } = createRevealRing(image, overlay, origin, borderColor);
          const finish = async () => {
            if (committed) return;
            committed = true;
            if (token !== switchToken) {
              overlay.remove();
              ringHost.remove();
              return;
            }
            image.src = nextSource;
            image.dataset.galleryImageReady = 'complete';
            try {
              await waitForImage(image);
            } catch (_) {
              overlay.remove();
              ringHost.remove();
              return;
            }
            overlay.remove();
            ringHost.remove();
          };
          return { overlay, originPoint, ringHost, ring, radius, finish };
        }).catch(() => {
          overlay.remove();
          return null;
        });
      }).catch(() => null);
    };

    const runRevealBatch = (images, theme, token) => {
      const preparations = images.map((image) => {
        const nextSource = themedSource(image.dataset.citiFile, theme);
        return prepareReveal(image, nextSource, token, revealBorderColors[theme]);
      });

      Promise.all(preparations).then((prepared) => {
        const transitions = prepared.filter(Boolean);
        if (token !== switchToken) {
          transitions.forEach(({ overlay, ringHost }) => {
            overlay.remove();
            ringHost.remove();
          });
          return;
        }
        requestAnimationFrame(() => requestAnimationFrame(() => {
          if (token !== switchToken) {
            transitions.forEach(({ overlay, ringHost }) => {
              overlay.remove();
              ringHost.remove();
            });
            return;
          }
          transitions.forEach(({ overlay, originPoint, ringHost, ring, radius, finish }) => {
            const finalDiameter = `${radius * 2}px`;
            if (reducedMotion) {
              finish();
              return;
            }
            if (typeof overlay.animate !== 'function') {
              overlay.style.transition = 'clip-path 750ms cubic-bezier(.5,0,1,.6)';
              ring.style.transition = 'width 750ms cubic-bezier(.5,0,1,.6),height 750ms cubic-bezier(.5,0,1,.6)';
              overlay.style.clipPath = `circle(${radius}px at ${originPoint})`;
              ring.style.width = finalDiameter;
              ring.style.height = finalDiameter;
              overlay.addEventListener('transitionend', finish, { once: true });
              window.setTimeout(() => overlay.isConnected && finish(), 800);
              return;
            }
            const animation = overlay.animate(
              [{ clipPath: `circle(0px at ${originPoint})` }, { clipPath: `circle(${radius}px at ${originPoint})` }],
              { duration: 750, easing: 'cubic-bezier(.5,0,1,.6)', fill: 'forwards' }
            );
            ring.animate(
              [{ width: '0px', height: '0px' }, { width: finalDiameter, height: finalDiameter }],
              { duration: 750, easing: 'cubic-bezier(.5,0,1,.6)', fill: 'forwards' }
            );
            animation.addEventListener('finish', finish, { once: true });
            animation.addEventListener('cancel', () => {
              overlay.remove();
              ringHost.remove();
            }, { once: true });
          });
        }));
      });
    };

    const selectTheme = (theme, button) => {
      if (theme === citiTheme) return;
      citiTheme = theme;
      switchToken += 1;
      const token = switchToken;
      switcher.dataset.theme = theme;
      buttons.forEach((option) => option.setAttribute('aria-pressed', String(option === button)));
      positionIndicator(button);
      runRevealBatch([...document.querySelectorAll('img[data-citi-theme-asset]')], theme, token);
    };

    const updateStickyPosition = () => {
      const galleryRect = gallery.getBoundingClientRect();
      const anchorTop = galleryRect.top + (window.innerWidth <= 700 ? 0 : 32);
      const stickyTop = 152;
      const galleryBottom = galleryRect.bottom - (window.innerWidth <= 700 ? 48 : 80);
      const isSticky = anchorTop <= stickyTop && galleryBottom > stickyTop + switcher.offsetHeight;
      const isAtEnd = galleryBottom <= stickyTop + switcher.offsetHeight;
      anchor.classList.toggle('is-sticky', isSticky);
      anchor.classList.toggle('is-at-end', isAtEnd);
      if (isSticky) {
        anchor.style.right = `${Math.max(0, document.documentElement.clientWidth - galleryRect.right)}px`;
      } else {
        anchor.style.removeProperty('right');
      }
      ticking = false;
    };

    const requestStickyUpdate = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(updateStickyPosition);
    };

    buttons.forEach((button) => button.addEventListener('click', () => selectTheme(button.dataset.citiTheme, button)));
    positionIndicator(buttons[0], false);
    updateStickyPosition();
    window.addEventListener('scroll', requestStickyUpdate, { passive: true });
    window.addEventListener('resize', () => {
      positionIndicator(buttons.find((button) => button.getAttribute('aria-pressed') === 'true'), false);
      requestStickyUpdate();
    }, { passive: true });
  }

  function renderCase() {
    const root = document.querySelector('#case-root');
    if (!root) return;
    const ids = visibleCaseIds.filter((caseId) => data.cases[caseId]);
    const requested = new URLSearchParams(location.search).get('id');
    const id = ids.includes(requested) ? requested : ids[0];
    if (requested && requested !== id) {
      history.replaceState(null, '', `case-study.html?id=${id}`);
    }
    const caseStudy = data.cases[id];
    document.documentElement.classList.toggle('feelmore-mobile-snap', id === 'feelmore-wellness');
    const nextId = ids[(ids.indexOf(id) + 1) % ids.length];
    const darkHero = ['feelmore-confidence', 'citi-platform', 'citi-guidance', 'meta-consistency', 'meta-inevitable', 'meta-clutter'].includes(id);
    document.title = `${caseStudy.title} — ${caseStudy.company}`;

    root.innerHTML = `
      <section class="case-hero${id.startsWith('meta-') ? ' meta' : ''}">
        <header class="case-header-overlay${darkHero ? ' on-dark' : ''}">
          <a class="brand" href="home.html"><svg class="brand-mark" aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M22.6436 20.25H1.36523L12.0723 3.40332L22.6436 20.25ZM6.27344 17.6328H17.7529L12.084 8.50098L6.27344 17.6328Z" fill="currentColor"/></svg><span>Ross Lauda</span></a>
          <button class="email-link js-copy-email" type="button"><span class="email-highlight" aria-hidden="true"><svg viewBox="0 0 166 38" preserveAspectRatio="none"><path d="M31.3395 36.0282C27.2552 32.5186 3.5453 38.8592 1.45078 37.8999C-0.161991 36.6833 -0.41332 12.327 0.612991 8.60686C0.990004 7.29663 1.51362 7.03926 2.896 7.4838C4.55067 8.16232 24.9931 5.05051 31.7374 4.11463C32.1563 4.83994 33.036 2.24287 33.2873 3.15535C33.79 4.48898 79.9321 0.956035 81.2307 0.909241C83.4928 0.815653 81.7334 2.28967 84.3725 1.72814C90.0067 0.558286 102.364 1.9855 106.616 0.815653C110.051 -0.120228 110.784 -0.143624 114.073 0.862448C116.942 1.72814 135.269 1.72814 137.406 0.230727C137.929 -0.190419 138.306 -0.00324255 138.285 0.534889C138.285 0.581683 144.527 1.37718 144.569 1.37718C147.711 1.79833 150.852 2.31306 150.873 2.52364C150.936 3.06177 151.313 3.34253 151.69 3.01497C152.36 2.45344 165.87 1.84512 165.975 3.43612C166.31 7.99854 163.231 26.8799 161.451 31.3722C159.587 36.1451 151.585 29.6876 144.506 32.0975C108.774 29.5238 113.486 30.1321 105.946 31.8869C105.171 30.2257 102.197 34.1564 100.354 31.2786C99.5996 30.1087 94.1749 29.8279 92.981 30.9978C92.4783 31.4891 85.2732 30.9978 77.8795 30.9276C70.465 30.8574 62.82 31.2552 61.4795 32.893C55.7615 30.0853 34.1461 35.49 31.2976 36.0282H31.3395Z"/></svg></span><span class="email-text">hello@rosslauda.com</span></button>
        </header>
        <img src="${id === 'citi-platform' ? `assets/cases/citi-platform/Blue/citi-platform-hero.png?v=${galleryAssetVersions[id]}` : `assets/cases/${id}/${id}-hero.png`}"${id === 'citi-platform' ? ' data-citi-theme-asset data-citi-file="citi-platform-hero.png"' : ''} alt="${escapeHTML(caseStudy.company)} — ${escapeHTML(caseStudy.title)}">
      </section>
      <div class="case-content" style="--case-color:${caseStudy.color}">
        <section class="case-intro">
          <p class="case-company">${escapeHTML(caseStudy.company)}</p>
          <h1>${escapeHTML(caseStudy.title)}</h1>
          <p>${escapeHTML(caseStudy.dek)}</p>
        </section>
        <section class="case-facts">
          <div><h2>Challenge</h2><p>${escapeHTML(caseStudy.challenge)}</p></div>
          <div><h2>Approach</h2><p>${escapeHTML(caseStudy.approach)}</p></div>
          <div><h2>Impact</h2><p>${escapeHTML(caseStudy.impact)}</p></div>
        </section>
        <div class="case-gallery${id === 'citi-platform' ? ' has-citi-theme-switcher' : ''}">${id === 'citi-platform' ? citiThemeSwitcherMarkup() : ''}${galleryMarkup(caseStudy, id)}</div>
        <nav class="case-bottom-nav detail-nav footer-nav" aria-label="Project navigation">
          <a class="home-back" href="home.html">${noteArrow('back')}Home</a>
          <span class="nav-copyright">© 2026&nbsp; · &nbsp;Ross Lauda, All rights reserved</span>
          <a href="case-study.html?id=${nextId}">Next${noteArrow('forward')}</a>
        </nav>
      </div>`;
  }

  initEnvironmentBanner();
  initPrinciples();
  renderNote();
  initArticleHighlights();
  renderCase();
  initCitiThemeSwitcher();
  initCaseGalleryHydration();
  initOnboardingCardReveal();
  initViewportVideos();
  initStickyHeader();
  initCaseHeader();
  initMobileCaseGalleryHeader();
  initEmailHighlights();
  initNoteHighlights();
})();
