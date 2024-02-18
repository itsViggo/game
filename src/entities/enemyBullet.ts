import Entity from "./types/Entity";
import { Position } from "./types/Position";
import { setSelectedOption, showGameOver } from "../ui/gameOver";

const bulletSpeed = -10;

export default function createBullet(position: Position) {
    const bullet = new Entity({
        element: document.createElement('div'), id: 'EnemyBullet', position, onUpdate: () => {
            bullet.position.y -= bulletSpeed;
            if (bullet.position.y > document.body.clientHeight) {
                bullet.destroy();
            }
        }, onCollisionWith: {
            'Player': (entity, self) => { 
                entity.destroy();
                self.destroy();
                showGameOver();
                setSelectedOption('Yes');
            }
        }
    });
    bullet.element.classList.add('enemyBullet');
}