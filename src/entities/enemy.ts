import Entity from "./types/Entity";
import createBullet from "./enemyBullet";

const fireRate = 0.01;
let framesToNextFire = 0;

export default function createEnemy() {
    const newEnemyX = Math.random() * document.body.clientWidth - 100;
    const enemy = new Entity({
        element: document.createElement('div'), position: { x: newEnemyX < 0 ? 0 : newEnemyX, y: document.body.clientHeight * 0.15 }, id: 'Enemy', onUpdate: () => {
            framesToNextFire--;
            if (framesToNextFire <= 0) {
                createBullet({x: enemy.position.x + 50, y: enemy.position.y});
                framesToNextFire = 1/fireRate;
            }
        }
    });
    enemy.element.classList.add('enemy');
}