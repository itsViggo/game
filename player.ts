import Entity from "./Entity";
import createBullet from "./bullet";

const playerSpeed = 10;
const fireRate = 0.05;
let framesToNextFire = 0;

export default function createPlayer() {
    const player = new Entity({
        element: document.createElement('div'), id: 'Player', position: {
            x: document.body.clientWidth/2,
            y: document.body.clientHeight - 150,
        }, onUpdate: (pressed) => {
            framesToNextFire--;
            if (pressed.ArrowLeft) {
                player.position.x -= playerSpeed;
                if (player.position.x < 0) {
                    player.position.x = 0;
                }
            }
            if (pressed.ArrowUp) {
                player.position.y -= playerSpeed;
                if (player.position.y < 0) {
                    player.position.y = 0;
                }
            }
            if (pressed.ArrowRight) {
                player.position.x += playerSpeed;
                if (player.position.x > document.body.clientWidth - 100) {
                    player.position.x = document.body.clientWidth - 100;
                }
            }
            if (pressed.ArrowDown) {
                player.position.y += playerSpeed;
                if (player.position.y > document.body.clientHeight - 100) {
                    player.position.y = document.body.clientHeight - 100;
                }
            }
            if (pressed.Space && framesToNextFire <= 0) {
                framesToNextFire = 1 / fireRate;
                createBullet({ x: player.position.x + 50, y: player.position.y })
            }
        }
    });
    player.element.classList.add('player');
}