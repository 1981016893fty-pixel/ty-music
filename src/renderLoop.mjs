// Shared by local effects: one pending frame, no work offscreen or in hidden tabs.
// Return true from draw to continue; input/resize can request a single frame.
export function createRenderLoop(element, draw, { observe = true } = {}) {
  let frame = 0;
  let disposed = false;
  let inView = true;
  const stop = () => {
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
  };
  const request = () => {
    if (!disposed && !frame && inView && !document.hidden) frame = requestAnimationFrame(tick);
  };
  function tick(now) {
    frame = 0;
    if (disposed || !inView || document.hidden) return;
    if (draw(now) === true) request();
  }
  const onVisibility = () => document.hidden ? stop() : request();
  document.addEventListener('visibilitychange', onVisibility);
  const observer = observe && typeof IntersectionObserver !== 'undefined'
    ? new IntersectionObserver(entries => {
      if (disposed) return;
      const visible = entries.some(entry => entry.isIntersecting);
      if (visible === inView) return;
      inView = visible;
      if (visible) request();
      else stop();
    }) : null;
  observer?.observe(element);
  return {
    request,
    dispose() {
      disposed = true;
      stop();
      observer?.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
    },
  };
}
