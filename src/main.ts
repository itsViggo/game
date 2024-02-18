import Entity from "./entities/types/Entity";
import createEnemy from "./entities/enemy";
import { onEnter, setSelectedOption } from "./ui/gameOver";
import createPlayer from "./entities/player";


createPlayer();
createEnemy();

const pressed = {} as Record<string, boolean>;

document.addEventListener("keydown", (e) => {
  pressed[e.code] = true;
  if (e.code === 'KeyF') {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      document.documentElement.requestPointerLock();
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
      document.exitPointerLock();
    }
  }
  if (e.code === 'ArrowLeft') {
    setSelectedOption('Yes');
  }
  if (e.code === 'ArrowRight') {
    setSelectedOption('No');
  }
  if (e.code === 'Enter') {
    onEnter();
  }
});

document.addEventListener("keyup", (e) => {
  pressed[e.code] = false;
});

window.requestAnimationFrame(gameLoop);

function gameLoop() {
  for (const entityId in Entity.entities) {
    for (const entity of Entity.entities[entityId]) {
      entity.update(pressed);
    }
  }
  for (const entityId in Entity.entities) {
    for (const entity of Entity.entities[entityId]) {
      entity.draw();
    }
  }
  window.requestAnimationFrame(gameLoop);
}
