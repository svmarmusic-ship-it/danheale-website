import { mountScene } from './lib/mountScene.jsx';
import TurntableScene from './scenes/TurntableScene.jsx';

export function mount(container) {
  mountScene(container, <TurntableScene />);
}
