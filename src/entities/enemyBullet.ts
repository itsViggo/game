import Entity from "./types/Entity";
import { Position } from "./types/Position";
import { showGameOver } from "../ui/gameOver";

const bulletSpeed = -10;

export default function createBullet(position: Position) {
    const bullet = new Entity({
        element: document.createElement('div'), id: 'Bullet', position, onUpdate: () => {
            bullet.position.y -= bulletSpeed;
            if (bullet.position.y > document.body.clientHeight) {
                bullet.destroy();
            }
        }, onCollisionWith: {
            'Player': (entity, self) => { 
                entity.destroy();
                self.destroy();
                showGameOver();
            }
        }
    });
    bullet.element.classList.add('enemyBullet');
}