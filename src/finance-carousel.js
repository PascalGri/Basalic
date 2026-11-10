// Reference cards loop only when moved by the visitor.
export function initFinanceReferences() {
  const section = document.querySelector('.finance-references');
  const track = section?.querySelector('.finance-reference-track');
  if (!track) return () => {};
  const originals = [...track.children];
  const count = originals.length;
  const prev = section.querySelector('.finance-slide-prev');
  const next = section.querySelector('.finance-slide-next');
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  const isReduced = () => preference.matches || document.documentElement.dataset.motionUser === 'paused';
  const listeners = [];
  const listen = (node, name, handler, options) => {
    node.addEventListener(name, handler, options);
    listeners.push(() => node.removeEventListener(name, handler, options));
  };
  const clone = card => {
    const copy = card.cloneNode(true);
    copy.dataset.clone = 'true';
    copy.setAttribute('aria-hidden', 'true');
    copy.tabIndex = -1;
    copy.querySelectorAll('a,button,[tabindex]').forEach(node => node.tabIndex = -1);
    return copy;
  };
  track.prepend(...originals.map(clone));
  track.append(...originals.map(clone));
  let settleTimer = null;
  let tween = null;
  let index = 0;
  let step = 1;
  const gap = () => parseFloat(getComputedStyle(track).gap) || 0;
  const interrupt = () => {
    cancelAnimationFrame(tween);
    tween = null;
    track.style.scrollSnapType = '';
  };
  const normalize = () => {
    // Recenter equivalent cards without a visible transition at a loop boundary.
    const physical = Math.round(track.scrollLeft / step);
    index = ((physical - count) % count + count) % count;
    if (physical < count || physical >= count * 2) {
      const oldSnap = track.style.scrollSnapType;
      track.style.scrollSnapType = 'none';
      track.scrollLeft += (count + index - physical) * step;
      track.style.scrollSnapType = oldSnap;
    }
  };
  const move = direction => {
    if (tween !== null) return;
    clearTimeout(settleTimer);
    const physical = Math.round(track.scrollLeft / step);
    const target = (physical + direction) * step;
    track.style.scrollSnapType = 'none';
    const complete = () => {
      tween = null;
      normalize();
      track.style.scrollSnapType = '';
    };
    if (isReduced()) {
      track.scrollLeft = target;
      complete();
      return;
    }
    const start = track.scrollLeft;
    const startedAt = performance.now();
    const advance = time => {
      const progress = Math.min(1, (time - startedAt) / 360);
      track.scrollLeft = start + (target - start) * (1 - (1 - progress) ** 3);
      if (progress < 1) tween = requestAnimationFrame(advance);
      else complete();
    };
    tween = requestAnimationFrame(advance);
  };
  const resize = () => {
    interrupt();
    step = originals[0].getBoundingClientRect().width + gap();
    track.style.scrollSnapType = 'none';
    track.scrollLeft = (count + index) * step;
    track.style.scrollSnapType = '';
  };
  listen(prev, 'click', () => move(-1));
  listen(next, 'click', () => move(1));
  listen(track, 'keydown', event => {
    if (event.target !== track || !['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
    event.preventDefault(); move(event.key === 'ArrowRight' ? 1 : -1);
  });
  listen(track, 'scroll', () => {
    if (tween !== null) return;
    clearTimeout(settleTimer);
    settleTimer = setTimeout(normalize, 150);
  }, {passive:true});
  listen(track, 'focusin', interrupt);
  listen(track, 'pointerdown', interrupt);
  listen(document, 'visibilitychange', () => { if (document.hidden) interrupt(); });
  const changePreference = () => { interrupt(); normalize(); };
  listen(preference, 'change', changePreference);
  const userPreference = new MutationObserver(changePreference);
  userPreference.observe(document.documentElement,{attributes:true,attributeFilter:['data-motion-user']});
  const observer = new ResizeObserver(resize);
  resize();
  observer.observe(track);
  return () => {
    clearTimeout(settleTimer);
    interrupt();
    observer.disconnect();
    userPreference.disconnect();
    listeners.forEach(remove => remove());
    track.querySelectorAll('[data-clone]').forEach(card => card.remove());
  };
}
