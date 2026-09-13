import { mountScene } from './lib/mountScene.jsx';
import MonitorScene from './scenes/MonitorScene.jsx';

export function mount(container) {
  mountScene(container, <MonitorScene />);
}
