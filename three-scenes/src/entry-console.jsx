import { mountScene } from './lib/mountScene.jsx';
import ConsoleScene from './scenes/ConsoleScene.jsx';

// Exposed for dynamic import() from index.html:
//   const m = await import('/assets/3d/console.js');
//   const handle = m.mount(container); // { setProgress(p) } or undefined
export function mount(container) {
  const progressRef = { current: 0 };
  mountScene(container, <ConsoleScene progressRef={progressRef} />);
  return { setProgress: (p) => { progressRef.current = p; } };
}
