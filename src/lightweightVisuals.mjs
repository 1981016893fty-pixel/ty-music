const headingSelector = [
  '#heroTitle', '#page-discover .section-title', '.browse-heading h1', '#browseQuickTitle',
  '.library-heading h1', '#playlistDetailTitle', '#albumDetailTitle', '#artistDetailName',
].join(', ');
const shuffleSelector = '#page-discover .section-title';

export function initLightweightVisuals() {
  const welcome = document.getElementById('welcomeScreen');
  const fullscreen = document.getElementById('ampFullscreenPlayer');
  const wrapper = document.getElementById('ampArtworkWrapper');
  const artwork = document.getElementById('ampArtwork');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const headings = document.querySelectorAll(headingSelector);
  const animating = new Set();
  const shuffles = new Map();
  let observing = false;
  let tiltHost;
  let tiltImage;
  let rect;
  let frame = 0;
  let x;
  let y;

  const showingFullscreen = () => fullscreen?.classList.contains('show');
  const motionAllowed = () => !document.hidden && !reduced.matches;
  const welcomeVisible = () => welcome && !welcome.classList.contains('is-dismissed');
  const tiltAllowed = () => tiltHost?.isConnected && motionAllowed() && !welcomeVisible() && (
    tiltHost === wrapper ? showingFullscreen() && !wrapper.classList.contains('hidden')
      : !showingFullscreen() && !tiltHost.closest('.page:not(.active)')
  );
  function clearHeading(heading) {
    const shuffle = shuffles.get(heading);
    if (shuffle) {
      shuffles.delete(heading);
      shuffle.remove();
      heading.classList.remove('ty-shuffle-active');
    }
    animating.delete(heading);
    heading.classList.remove('ty-heading-sheen');
  }
  function animateHeading(heading) {
    const text = heading.firstChild;
    if (heading.matches(shuffleSelector) && text?.nodeType === Node.TEXT_NODE && text.textContent.trim() && Element.prototype.animate) {
      clearHeading(heading);
      const overlay = document.createElement('span');
      overlay.className = 'ty-shuffle-letters';
      overlay.setAttribute('aria-hidden', 'true');
      heading.append(overlay);
      shuffles.set(heading, overlay);
      heading.classList.add('ty-shuffle-active');
      animating.add(heading);
      const animations = Array.from(text.textContent.trim(), (character, index) => {
        const span = document.createElement('span');
        span.textContent = character === ' ' ? '\u00a0' : character;
        overlay.append(span);
        return span.animate([
          { transform: `translateX(${12 + index % 2 * 9}px)`, opacity: 0, color: '#ddafff' },
          { transform: 'none', opacity: 1, color: '#8ee7ff' },
        ], { duration: 350, delay: index * 45, easing: 'cubic-bezier(.22,.61,.36,1)', fill: 'both' });
      });
      void Promise.allSettled(animations.map(animation => animation.finished)).then(() => {
        if (shuffles.get(heading) === overlay) clearHeading(heading);
      });
    } else {
      animating.add(heading);
      heading.classList.add('ty-heading-sheen');
    }
  }
  const observer = typeof IntersectionObserver === 'function' ? new IntersectionObserver(entries => {
    if (!observing) return;
    for (const { target, intersectionRatio } of entries) {
      if (intersectionRatio >= 0.25 && target.textContent.trim()) {
        animateHeading(target);
      } else {
        clearHeading(target);
      }
    }
  }, { threshold: 0.25 }) : null;

  function resetTilt() {
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    rect = undefined;
    tiltImage?.style.removeProperty('transform');
    tiltHost?.removeEventListener('pointermove', tilt);
    tiltHost?.removeEventListener('pointerleave', resetTilt);
    tiltHost?.removeEventListener('pointercancel', resetTilt);
    tiltHost = undefined;
    tiltImage = undefined;
  }

  function sync() {
    const showHeadings = motionAllowed() && !showingFullscreen() && !welcomeVisible();
    if (observer && observing !== showHeadings) {
      observing = showHeadings;
      if (observing) headings.forEach(heading => observer.observe(heading));
      else {
        observer.disconnect();
        observer.takeRecords();
        animating.forEach(clearHeading);
      }
    }
    if (!tiltAllowed()) resetTilt();
    document.documentElement.classList.toggle('ty-motion-paused', !motionAllowed());
  }

  function tilt(event) {
    if (event.pointerType !== 'mouse' || !tiltAllowed()) return;
    x = event.clientX;
    y = event.clientY;
    if (frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      if (!tiltAllowed()) return;
      // Use the untransformed wrapper and reuse its bounds until layout changes.
      rect ??= tiltHost.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const clamp = value => Math.max(-1, Math.min(1, value));
      const rx = -12 * clamp((y - rect.top) * 2 / rect.height - 1);
      const ry = 12 * clamp((x - rect.left) * 2 / rect.width - 1);
      const scale = tiltHost === wrapper ? 1.045 : 1.08;
      tiltImage.style.transform = `rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) scale(${scale})`;
    });
  }

  document.addEventListener('pointerover', event => {
    if (event.pointerType !== 'mouse' || !motionAllowed() || !(event.target instanceof Element)) return;
    const heading = event.target.closest(shuffleSelector);
    if (heading && !welcomeVisible() && !showingFullscreen() && !heading.contains(event.relatedTarget)) animateHeading(heading);
    const host = event.target.closest('#ampArtworkWrapper, .am-artwork');
    if (!host || host === tiltHost) return;
    resetTilt();
    tiltHost = host;
    tiltImage = host === wrapper ? artwork : host.querySelector(':scope > img');
    if (!tiltImage || !tiltAllowed()) return resetTilt();
    host.addEventListener('pointermove', tilt, { passive: true });
    host.addEventListener('pointerleave', resetTilt);
    host.addEventListener('pointercancel', resetTilt);
    tilt(event);
  }, { passive: true });
  const invalidateBounds = () => { rect = undefined; };
  window.addEventListener('resize', invalidateBounds, { passive: true });
  document.addEventListener('scroll', invalidateBounds, { capture: true, passive: true });
  document.addEventListener('transitionend', event => {
    if (event.target === fullscreen || event.target === tiltHost?.closest('.am-card')) invalidateBounds();
  });
  document.addEventListener('animationend', event => {
    if (event.animationName === 'ty-heading-sheen' && animating.has(event.target)) clearHeading(event.target);
  });
  const sceneObserver = new MutationObserver(sync);
  for (const element of [welcome, fullscreen, wrapper, ...document.querySelectorAll('.page')]) {
    if (element) sceneObserver.observe(element, { attributes: true, attributeFilter: ['class'] });
  }
  document.addEventListener('visibilitychange', sync);
  reduced.addEventListener('change', sync);
  sync();
}
