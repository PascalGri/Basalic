const noop = () => {};

/** A small, pausable loop of the existing service links. */
export function initFinanceMarquee() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches
    || matchMedia('(pointer: coarse)').matches
    || document.documentElement.dataset.motion === 'reduced') return noop;

  const nav = document.querySelector('nav.finance-disciplines');
  if (!nav || nav.classList.contains('is-animated')) return noop;
  const narrow = matchMedia('(max-width: 700px)');
  const originalNodes = [...nav.childNodes];
  if (originalNodes.filter(node => node instanceof HTMLAnchorElement).length < 2) return noop;

  const previousState = nav.getAttribute('data-marquee-state');
  const track = document.createElement('div');
  track.className = 'finance-discipline-track';
  const originalSet = document.createElement('div');
  originalSet.className = 'finance-discipline-set';
  originalSet.append(...originalNodes);
  track.append(originalSet);
  for (let index = 0; index < 2; index++) {
    const clone = originalSet.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    clone.querySelectorAll('a').forEach(link => link.setAttribute('tabindex', '-1'));
    clone.querySelectorAll('[id]').forEach(node => node.removeAttribute('id'));
    track.append(clone);
  }
  nav.replaceChildren(track);
  nav.classList.add('is-animated');

  let disposed = false;
  let animation = null;
  let duration = 0;
  let measuredWidth = 0;
  let hovering = nav.matches(':hover');
  let focused = nav.contains(document.activeElement);
  let onScreen = false;
  const listeners = [];
  const listen = (target, type, callback) => {
    target.addEventListener(type, callback);
    listeners.push(() => target.removeEventListener(type, callback));
  };
  const sync = () => {
    if (disposed) return;
    const paused = !animation || narrow.matches || hovering || focused || document.hidden || !onScreen;
    nav.dataset.marqueeState = paused ? 'paused' : 'running';
    if (!animation) return;
    if (paused) animation.pause();
    else animation.play();
  };
  const measure = () => {
    if (disposed) return;
    const width = originalSet.getBoundingClientRect().width;
    if (width <= 0 || Math.abs(width - measuredWidth) < .1) return;
    const phase = animation && duration
      ? ((Number(animation.currentTime) || 0) % duration) / duration : 0;
    animation?.cancel();
    measuredWidth = width;
    duration = width / 50 * 1000;
    animation = track.animate([
      { transform: 'translateX(0)' },
      { transform: `translateX(${-width}px)` },
    ], { duration, iterations: Infinity, easing: 'linear' });
    animation.pause();
    animation.currentTime = phase * duration;
    sync();
  };

  listen(nav, 'mouseenter', () => { hovering = true; sync(); });
  listen(nav, 'mouseleave', () => { hovering = false; sync(); });
  listen(nav, 'focusin', () => {
    focused = true;
    // Keyboard users always find the four original links inside the viewport.
    if (animation && originalSet.contains(document.activeElement)) animation.currentTime = 0;
    sync();
  });
  listen(nav, 'focusout', event => {
    focused = event.relatedTarget instanceof Node && nav.contains(event.relatedTarget);
    sync();
  });
  listen(document, 'visibilitychange', sync);
  listen(narrow, 'change', () => {
    if (narrow.matches && animation) animation.currentTime = 0;
    measure();
    sync();
  });
  const visibility = new IntersectionObserver(entries => {
    if (disposed) return;
    onScreen = entries.some(entry => entry.isIntersecting);
    sync();
  });
  const resize = new ResizeObserver(measure);
  visibility.observe(nav);
  resize.observe(originalSet);
  measure();
  sync();

  return () => {
    if (disposed) return;
    disposed = true;
    animation?.cancel();
    visibility.disconnect();
    resize.disconnect();
    listeners.forEach(remove => remove());
    nav.replaceChildren(...originalNodes);
    nav.classList.remove('is-animated');
    if (previousState === null) nav.removeAttribute('data-marquee-state');
    else nav.setAttribute('data-marquee-state', previousState);
  };
}
