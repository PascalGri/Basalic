import { initFinanceMarquee } from './finance-marquee.js';

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';
const REVEAL_TARGETS = '.reveal, .finance-facts > div, .faq-item, .footer-cta-copy';
const noop = () => {};

function prefersStaticMotion(preference) {
  return preference.matches || document.documentElement.dataset.motionUser === 'paused';
}

/** Preserve native disclosure semantics when closing an accordion sibling. */
export function closeFaq(detail) {
  if (detail instanceof HTMLDetailsElement) detail.open = false;
}

/** Scroll an internal target below the fixed header. Returns false if absent. */
export function scrollToTarget(target) {
  let destination = target;
  if (typeof target === 'string') {
    try {
      destination = target.startsWith('#')
        ? document.getElementById(decodeURIComponent(target.slice(1)))
        : document.querySelector(target);
    } catch {
      return false;
    }
  }
  if (typeof destination !== 'number' && !(destination instanceof Element)) return false;
  const top = typeof destination === 'number'
    ? destination
    : destination.getBoundingClientRect().top + window.scrollY - 110;
  if (!Number.isFinite(top)) return false;

  window.scrollTo({
    top: Math.max(0, top),
    behavior: prefersStaticMotion(matchMedia(REDUCED_MOTION)) ? 'instant' : 'smooth',
  });
  return true;
}

function initReveals() {
  if (typeof IntersectionObserver !== 'function' || !Element.prototype.animate) return noop;

  const belowFold = new WeakSet();
  const animations = new Set();
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const element = entry.target;
      if (!entry.isIntersecting) {
        // Skip elements above the viewport, including on restored scroll positions.
        if (entry.boundingClientRect.top >= (entry.rootBounds?.bottom ?? window.innerHeight)) {
          belowFold.add(element);
        } else {
          observer.unobserve(element);
        }
        return;
      }

      observer.unobserve(element);
      // Content already visible on the first observer pass never animates in.
      if (!belowFold.has(element) || document.hidden || element.contains(document.activeElement)) return;
      const animation = element.animate([
        { opacity: .85, translate: '0 8px' },
        { opacity: 1, translate: '0 0' },
      ], { duration: 360, easing: 'cubic-bezier(.22,1,.36,1)' });
      animations.add(animation);
      animation.onfinish = () => animations.delete(animation);
    });
  });
  document.querySelectorAll(REVEAL_TARGETS).forEach(element => observer.observe(element));

  return () => {
    observer.disconnect();
    observer.takeRecords();
    animations.forEach(animation => animation.cancel());
    animations.clear();
  };
}

function startMotion({ isHome }) {
  let stopReveals = noop;
  let stopMarquee = noop;
  const start = () => {
    stopReveals = initReveals();
    if (isHome && typeof IntersectionObserver === 'function'
      && typeof ResizeObserver === 'function' && Element.prototype.animate) {
      stopMarquee = initFinanceMarquee();
    }
  };

  // Route content and native controls work before optional animation starts.
  const supportsIdle = typeof window.requestIdleCallback === 'function';
  const handle = supportsIdle
    ? window.requestIdleCallback(start, { timeout: 400 })
    : window.setTimeout(start, 60);

  return () => {
    if (supportsIdle) window.cancelIdleCallback(handle);
    else window.clearTimeout(handle);
    stopReveals();
    stopMarquee();
  };
}

/** Initialize optional motion after a route render and clean it up on navigation. */
export function initMotion({ isHome = false } = {}) {
  const preference = matchMedia(REDUCED_MOTION);
  let stopped = false;
  let stopSession = noop;
  const syncPreference = () => {
    if (stopped) return;
    stopSession();
    const reduced = prefersStaticMotion(preference);
    document.documentElement.dataset.motion = reduced ? 'reduced' : 'active';
    stopSession = reduced ? noop : startMotion({ isHome });
  };

  const userPreference = new MutationObserver(syncPreference);
  userPreference.observe(document.documentElement, { attributes: true, attributeFilter: ['data-motion-user'] });
  preference.addEventListener('change', syncPreference);
  syncPreference();
  return () => {
    if (stopped) return;
    stopped = true;
    preference.removeEventListener('change', syncPreference);
    userPreference.disconnect();
    stopSession();
  };
}
