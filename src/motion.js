import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CustomEase } from 'gsap/CustomEase';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

gsap.registerPlugin(ScrollTrigger, CustomEase);
CustomEase.create('basalic-reveal', '0.23,1,0.32,1');

const REVEAL_EASE = 'basalic-reveal';
const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';
let activeLenis = null;
let headerHasEntered = false;
const faqControllers = new WeakMap();

/** Close a sibling accordion with motion, or natively when motion is disabled. */
export function closeFaq(detail) {
  const controller = faqControllers.get(detail);
  if (controller) controller.close();
  else if (detail instanceof HTMLDetailsElement) detail.open = false;
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
  if (typeof destination === 'number' && !Number.isFinite(destination)) return false;
  if (typeof destination !== 'number' && !(destination instanceof Element)) return false;
  if (activeLenis) {
    activeLenis.scrollTo(destination, { offset: typeof destination === 'number' ? 0 : -100 });
  } else {
    const top = typeof destination === 'number'
      ? destination
      : destination.getBoundingClientRect().top + window.scrollY - 100;
    window.scrollTo({
      top: Math.max(0, top),
      behavior: window.matchMedia(REDUCED_MOTION).matches ? 'instant' : 'smooth',
    });
  }
  return true;
}

function splitWords(container) {
  const originalHTML = container.innerHTML;
  const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, {
    acceptNode: node => node.textContent.trim()
      && !node.parentElement.closest('script,style,textarea')
      ? NodeFilter.FILTER_ACCEPT
      : NodeFilter.FILTER_REJECT,
  });
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  const words = [];
  for (const node of nodes) {
    const fragment = document.createDocumentFragment();
    for (const part of node.textContent.split(/(\s+)/)) {
      if (!part) continue;
      if (/^\s+$/.test(part)) {
        fragment.append(document.createTextNode(part));
      } else {
        const word = document.createElement('span');
        word.className = 'word-reveal-token';
        word.style.display = 'inline-block';
        word.textContent = part;
        fragment.append(word);
        words.push(word);
      }
    }
    node.replaceWith(fragment);
  }
  return { words, restore: () => { container.innerHTML = originalHTML; } };
}

function startMotion({ isHome }) {
  let disposed = false;
  let frame = null;
  let refreshFrame = null;
  let lastTime = null;
  let lenis = null;
  let context = null;
  const listeners = [];
  const wordRestorers = [];
  const marquees = [];
  const listen = (target, type, callback, options) => {
    target.addEventListener(type, callback, options);
    listeners.push(() => target.removeEventListener(type, callback, options));
  };
  const cleanup = () => {
    if (disposed) return;
    disposed = true;
    if (frame !== null) cancelAnimationFrame(frame);
    if (refreshFrame !== null) cancelAnimationFrame(refreshFrame);
    listeners.reverse().forEach(remove => remove());
    context?.revert();
    wordRestorers.forEach(restore => restore());
    if (activeLenis === lenis) activeLenis = null;
    lenis?.destroy();
  };
  const refresh = () => {
    if (disposed || refreshFrame !== null) return;
    refreshFrame = requestAnimationFrame(() => {
      refreshFrame = null;
      if (disposed) return;
      lenis?.resize();
      marquees.forEach(marquee => marquee.measure());
      ScrollTrigger.refresh();
    });
  };

  try {
    lenis = new Lenis({
      duration: 1.6,
      easing: value => Math.min(1, 1.001 - 2 ** (-10 * value)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      autoRaf: false,
      anchors: false,
    });
    activeLenis = lenis;
    listeners.push(lenis.on('scroll', ScrollTrigger.update));

    // Establish the context before running setup so partial failures can revert it.
    context = gsap.context(() => {}, document.documentElement);
    context.add(() => {
      const header = document.querySelector('.site-header');
      if (header && !headerHasEntered) {
        headerHasEntered = true;
        gsap.from(header, { y: -100, duration: 0.5, ease: REVEAL_EASE });
      }

      const heroElements = gsap.utils.toArray('.hero-reveal');
      if (heroElements.length) {
        gsap.from(heroElements, {
          autoAlpha: 0,
          y: 20,
          filter: 'blur(8px)',
          duration: 0.8,
          delay: 0.2,
          stagger: 0.15,
          ease: REVEAL_EASE,
          clearProps: 'opacity,visibility,filter,transform',
        });
      }
      gsap.utils.toArray('.showcase').forEach(showcase => {
        gsap.from(showcase, {
          autoAlpha: 0,
          y: 40,
          duration: 1,
          delay: isHome ? 0.6 : 0.2,
          ease: REVEAL_EASE,
          clearProps: 'opacity,visibility,transform',
        });
      });
      gsap.utils.toArray('.reveal').forEach(element => {
        if (element.matches('.hero-reveal,.showcase,[data-word-reveal]')) return;
        gsap.from(element, {
          autoAlpha: 0,
          y: 40,
          duration: 0.8,
          ease: REVEAL_EASE,
          clearProps: 'opacity,visibility,transform',
          scrollTrigger: {
            trigger: element,
            start: 'top bottom-=100',
            once: true,
          },
        });
      });

      document.querySelectorAll('[data-word-reveal]').forEach(container => {
        const { words, restore } = splitWords(container);
        wordRestorers.push(restore);
        if (!words.length) return;
        gsap.set(words, { opacity: 0.15, filter: 'blur(8px)' });
        gsap.to(words, {
          opacity: 1,
          filter: 'blur(0px)',
          duration: 1,
          stagger: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: container,
            start: 'top 90%',
            end: 'top 25%',
            scrub: true,
            invalidateOnRefresh: true,
          },
        });
      });

      document.querySelectorAll('.timeline-section').forEach(section => {
        const fill = section.querySelector('.timeline-fill');
        if (!fill) return;
        gsap.fromTo(fill, { scaleY: 0, transformOrigin: '50% 0%' }, {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top 30%',
            end: 'bottom 70%',
            scrub: true,
            invalidateOnRefresh: true,
          },
        });
      });

      const finePointer = window.matchMedia('(min-width: 850px) and (hover: hover) and (pointer: fine)');
      document.querySelectorAll('.hero-background').forEach(background => {
        const hero = background.closest('.hero,[data-parallax-hero]') || background.parentElement;
        if (!hero) return;
        const xTo = gsap.quickTo(background, 'x', { duration: 0.6, ease: 'power3.out' });
        const yTo = gsap.quickTo(background, 'y', { duration: 0.6, ease: 'power3.out' });
        const reset = () => { xTo(0); yTo(0); };
        listen(hero, 'pointermove', event => {
          if (!finePointer.matches) return;
          const rect = hero.getBoundingClientRect();
          if (!rect.width || !rect.height) return;
          xTo(gsap.utils.clamp(-20, 20, ((event.clientX - rect.left) / rect.width - 0.5) * 40));
          yTo(gsap.utils.clamp(-20, 20, ((event.clientY - rect.top) / rect.height - 0.5) * 40));
        }, { passive: true });
        listen(hero, 'pointerleave', reset, { passive: true });
        listen(finePointer, 'change', () => { if (!finePointer.matches) reset(); });
      });

      document.querySelectorAll('.marquee-track').forEach(track => {
        const sets = track.querySelectorAll('.marquee-set');
        if (sets.length < 2) return;
        const speed = Number(track.dataset.speed) || 60;
        const direction = track.dataset.direction === 'right' ? -1 : 1;
        const setX = gsap.quickSetter(track, 'x', 'px');
        let distance = 0;
        let offset = 0;
        let velocity = 0;
        let hovered = false;
        let focused = false;
        // Let the GSAP context restore the original track transform on cleanup.
        gsap.set(track, { x: 0 });
        const measure = () => {
          distance = Math.abs(sets[1].getBoundingClientRect().left - sets[0].getBoundingClientRect().left)
            || sets[0].getBoundingClientRect().width;
          if (distance > 0) offset = (offset % distance + distance) % distance;
        };
        const viewport = track.closest('[data-marquee],.marquee') || track.parentElement || track;
        listen(viewport, 'pointerenter', () => { hovered = true; }, { passive: true });
        listen(viewport, 'pointerleave', () => { hovered = false; }, { passive: true });
        listen(viewport, 'focusin', () => { focused = true; });
        listen(viewport, 'focusout', event => { focused = viewport.contains(event.relatedTarget); });
        if ('ResizeObserver' in window) {
          const observer = new ResizeObserver(measure);
          observer.observe(sets[0]);
          observer.observe(sets[1]);
          observer.observe(viewport);
          listeners.push(() => observer.disconnect());
        }
        measure();
        marquees.push({
          measure,
          update: delta => {
            const target = hovered || focused ? 0 : Math.abs(speed) * direction;
            velocity += (target - velocity) * (1 - Math.exp(-delta / 0.25));
            if (distance > 0) {
              offset = ((offset + velocity * delta) % distance + distance) % distance;
              setX(-offset);
            }
          },
        });
      });
    });

    document.querySelectorAll('details.faq-item,.page-faq details').forEach(detail => {
      const summary = detail.querySelector(':scope > summary');
      const answer = [...detail.children].find(child => child !== summary);
      if (!summary || !answer) return;
      let desiredOpen = detail.open;
      let animation = null;
      const originalHeight = detail.style.height;
      const originalOverflow = detail.style.overflow;
      const originalOpacity = answer.style.opacity;
      const restoreStyles = () => {
        detail.style.height = originalHeight;
        detail.style.overflow = originalOverflow;
        answer.style.opacity = originalOpacity;
      };
      const setOpen = shouldOpen => {
        if (disposed || (!animation && detail.open === shouldOpen)) return;
        desiredOpen = shouldOpen;
        animation?.kill();
        const wasOpen = detail.open;
        const startHeight = detail.getBoundingClientRect().height;
        if (shouldOpen) detail.open = true;
        // Measure the natural answer without inserting wrappers that would
        // invalidate the page-specific details > p presentation.
        detail.style.height = 'auto';
        const style = getComputedStyle(detail);
        const verticalEdges = ['paddingTop', 'paddingBottom', 'borderTopWidth', 'borderBottomWidth']
          .reduce((sum, property) => sum + (parseFloat(style[property]) || 0), 0);
        const endHeight = shouldOpen
          ? detail.getBoundingClientRect().height
          : summary.getBoundingClientRect().height + verticalEdges;
        detail.style.height = `${startHeight}px`;
        detail.style.overflow = 'hidden';
        if (shouldOpen && !wasOpen) answer.style.opacity = '0';
        animation = gsap.timeline({
          defaults: { duration: 0.3, ease: REVEAL_EASE },
          onComplete: () => {
            animation = null;
            // Keep native open true until a closing answer has finished fading.
            detail.open = desiredOpen;
            restoreStyles();
            refresh();
          },
        })
          .to(detail, { height: endHeight }, 0)
          .to(answer, { opacity: shouldOpen ? 1 : 0 }, 0);
      };
      const controller = { close: () => setOpen(false) };
      faqControllers.set(detail, controller);
      listen(summary, 'click', event => {
        if (event.defaultPrevented || event.target.closest('a,button,input,select,textarea')) return;
        event.preventDefault();
        setOpen(!desiredOpen);
      });
      listen(detail, 'toggle', () => {
        // External code can still close details natively without leaving an
        // in-flight height tween or clipped content behind.
        if (animation && !detail.open) {
          animation.kill();
          animation = null;
          desiredOpen = false;
          restoreStyles();
        } else if (!animation) desiredOpen = detail.open;
        refresh();
      });
      listeners.push(() => {
        animation?.kill();
        animation = null;
        detail.open = desiredOpen;
        restoreStyles();
        if (faqControllers.get(detail) === controller) faqControllers.delete(detail);
      });
    });

    const tick = time => {
      if (disposed) return;
      const delta = lastTime === null ? 0 : Math.min(0.1, Math.max(0, (time - lastTime) / 1000));
      lastTime = time;
      lenis.raf(time);
      marquees.forEach(marquee => marquee.update(delta));
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    document.querySelectorAll('img').forEach(image => {
      if (image.complete) return;
      const loaded = () => {
        image.removeEventListener('load', loaded);
        image.removeEventListener('error', loaded);
        refresh();
      };
      listen(image, 'load', loaded, { once: true });
      listen(image, 'error', loaded, { once: true });
    });
    document.fonts?.ready.then(refresh);
    refresh();
  } catch (error) {
    cleanup();
    console.error('Die Bewegungsdarstellung konnte nicht gestartet werden.', error);
  }
  return cleanup;
}

/** Initialize after a route render; call the returned cleanup before replacing it. */
export function initMotion({ isHome = false } = {}) {
  const preference = window.matchMedia(REDUCED_MOTION);
  let stopped = false;
  let stopSession = () => {};
  const syncPreference = () => {
    if (stopped) return;
    stopSession();
    stopSession = preference.matches ? () => {} : startMotion({ isHome });
  };
  preference.addEventListener('change', syncPreference);
  syncPreference();
  return () => {
    if (stopped) return;
    stopped = true;
    preference.removeEventListener('change', syncPreference);
    stopSession();
  };
}
