// Entity.ts
class Entity {
  element;
  position;
  onUpdate;
  onCollision;
  onCollisionWith;
  id;
  _created;
  static entities = {};
  constructor(entityData) {
    this.element = entityData.element;
    this.position = entityData.position;
    this.id = entityData.id;
    this._created = false;
    this.onUpdate = entityData.onUpdate;
    this.onCollision = entityData.onCollision;
    this.onCollisionWith = entityData.onCollisionWith;
    Entity.entities[entityData.id] ? Entity.entities[entityData.id].push(this) : Entity.entities[entityData.id] = [this];
  }
  draw() {
    if (!this._created) {
      document.getElementById("gameArea")?.appendChild(this.element);
      this._created = true;
    }
    this.element.style.left = this.position.x + "px";
    this.element.style.top = this.position.y + "px";
  }
  update(pressed) {
    this.onUpdate && this.onUpdate(pressed);
    for (const entityId in this.onCollisionWith) {
      if (Entity.entities[entityId]) {
        for (const entity of Entity.entities[entityId]) {
          if (Entity.isCollided(this, entity)) {
            this.onCollisionWith[entityId](entity, this);
          }
        }
      }
    }
  }
  destroy() {
    this.element.remove();
    Entity.entities[this.id].splice(Entity.entities[this.id].indexOf(this), 1);
  }
  static isCollided(entity1, entity2) {
    const x1 = entity1.position.x;
    const y1 = entity1.position.y;
    const w1 = entity1.element.clientWidth;
    const h1 = entity1.element.clientHeight;
    const x2 = entity2.position.x;
    const y2 = entity2.position.y;
    const w2 = entity2.element.clientWidth;
    const h2 = entity2.element.clientHeight;
    if (x1 + w1 < x2) {
      return false;
    }
    if (x1 > x2 + w2) {
      return false;
    }
    if (y1 > y2 + h2) {
      return false;
    }
    if (y1 + h1 < y2) {
      return false;
    }
    return true;
  }
}

// gameOver.ts
function showGameOver() {
  visible = true;
  document.getElementById("gameOver").classList.add("show");
}
function setSelectedOption(newOption) {
  if (visible) {
    selectedOption = newOption;
    if (newOption === "Yes") {
      document.getElementById("yesText").classList.add("selectedOption");
      document.getElementById("noText").classList.remove("selectedOption");
    } else {
      document.getElementById("noText").classList.add("selectedOption");
      document.getElementById("yesText").classList.remove("selectedOption");
    }
  }
}
function onEnter() {
  if (visible) {
    if (selectedOption === "Yes") {
      location.reload();
    } else {
      window.close();
    }
  }
}
var selectedOption = "Yes";
var visible = false;

// enemyBullet.ts
var bulletSpeed = -10;
function createBullet(position) {
  const bullet = new Entity({
    element: document.createElement("div"),
    id: "Bullet",
    position,
    onUpdate: () => {
      bullet.position.y -= bulletSpeed;
      if (bullet.position.y > document.body.clientHeight) {
        bullet.destroy();
      }
    },
    onCollisionWith: {
      Player: (entity, self) => {
        entity.destroy();
        self.destroy();
        showGameOver();
      }
    }
  });
  bullet.element.classList.add("enemyBullet");
}

// enemy.ts
var fireRate = 0.01;
var framesToNextFire = 0;
function createEnemy() {
  const newEnemyX = Math.random() * document.body.clientWidth - 100;
  const enemy = new Entity({
    element: document.createElement("div"),
    position: { x: newEnemyX < 0 ? 0 : newEnemyX, y: document.body.clientHeight * 0.15 },
    id: "Enemy",
    onUpdate: () => {
      framesToNextFire--;
      if (framesToNextFire <= 0) {
        createBullet({ x: enemy.position.x + 50, y: enemy.position.y });
        framesToNextFire = 1 / fireRate;
      }
    }
  });
  enemy.element.classList.add("enemy");
}

// score.ts
function getScore() {
  return _score;
}
function setScore(score) {
  _score = score;
  document.getElementById("score").innerHTML = "Score: " + _score;
}
var _score = 0;

// bullet.ts
var bulletSpeed2 = 10;
function createBullet2(position) {
  const bullet = new Entity({
    element: document.createElement("div"),
    id: "Bullet",
    position,
    onUpdate: () => {
      bullet.position.y -= bulletSpeed2;
      if (bullet.position.y < 0) {
        bullet.destroy();
      }
    },
    onCollisionWith: {
      Enemy: (entity, self) => {
        entity.destroy();
        self.destroy();
        setScore(getScore() + 1);
        createEnemy();
      }
    }
  });
  bullet.element.classList.add("bullet");
}

// player.ts
var playerSpeed = 10;
var fireRate2 = 0.05;
var framesToNextFire2 = 0;
function createPlayer() {
  const player = new Entity({
    element: document.createElement("div"),
    id: "Player",
    position: {
      x: document.body.clientWidth / 2,
      y: document.body.clientHeight - 150
    },
    onUpdate: (pressed) => {
      framesToNextFire2--;
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
      if (pressed.Space && framesToNextFire2 <= 0) {
        framesToNextFire2 = 1 / fireRate2;
        createBullet2({ x: player.position.x + 50, y: player.position.y });
      }
    }
  });
  player.element.classList.add("player");
}

// main.ts
var gameLoop = function() {
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
};
createPlayer();
createEnemy();
setSelectedOption("Yes");
var pressed = {};
document.addEventListener("keydown", (e) => {
  pressed[e.code] = true;
  if (e.code === "KeyF") {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      document.documentElement.requestPointerLock();
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
      document.exitPointerLock();
    }
  }
  if (e.code === "ArrowLeft") {
    setSelectedOption("Yes");
  }
  if (e.code === "ArrowRight") {
    setSelectedOption("No");
  }
  if (e.code === "Enter") {
    onEnter();
  }
});
document.addEventListener("keyup", (e) => {
  pressed[e.code] = false;
});
window.requestAnimationFrame(gameLoop);
