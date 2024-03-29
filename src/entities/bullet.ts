import Entity from "./types/Entity";
import { Position } from "./types/Position";
import createEnemy from "./enemy";
import { getScore, setScore } from "../ui/score";

const bulletSpeed = 10;

export default function createBullet(position: Position) {
    const bullet = new Entity({
        element: document.createElement('div'), id: 'Bullet', position, onUpdate: () => {
            bullet.position.y -= bulletSpeed;
            if (bullet.position.y < 0) {
                bullet.destroy();
            }
        }, onCollisionWith: {
            'Enemy': (entity, self) => { 
                entity.destroy();
                self.destroy();
                setScore(getScore() + 1);
                createEnemy();
            }
        }
    });
    bullet.element.classList.add('bullet');
}