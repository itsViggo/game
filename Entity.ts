import { Position } from "./Position";

export default class Entity {
    element: HTMLElement;
    position: Position;
    onUpdate?: (pressed: Record<string, boolean>) => void;
    onCollision?: (entity: Entity) => void;
    onCollisionWith?: Record<string, (entity: Entity, self: Entity) => void>;
    id: string;
    private _created: boolean;
    static entities = {} as Record<string, Array<Entity>>;

    constructor(entityData: { element: HTMLElement, id: string, position: Position, onUpdate?: (pressed: Record<string, boolean>) => void, onCollision?: (entity: Entity) => void, onCollisionWith?: Record<string, (entity: Entity, self: Entity) => void> }) {
        this.element = entityData.element;
        this.position = entityData.position;
        this.id = entityData.id;
        this._created = false;
        this.onUpdate = entityData.onUpdate;
        this.onCollision = entityData.onCollision;
        this.onCollisionWith = entityData.onCollisionWith;
        Entity.entities[entityData.id] ? Entity.entities[entityData.id].push(this) : Entity.entities[entityData.id] = [this];
    }

    draw(): void {
        if (!this._created) {
            document.getElementById('gameArea')?.appendChild(this.element);
            this._created = true;
        }
        this.element.style.left = this.position.x + "px";
        this.element.style.top = this.position.y + "px";
    }

    update(pressed: Record<string, boolean>): void {
        this.onUpdate && this.onUpdate(pressed);
        for (const entityId in this.onCollisionWith) {
            if (Entity.entities[entityId]) {
                for (const entity of Entity.entities[entityId]) {
                    if(Entity.isCollided(this, entity)) {
                        this.onCollisionWith[entityId](entity, this)
                    }
                }
            }
        }
    }

    destroy(): void {
        this.element.remove();
        Entity.entities[this.id].splice(Entity.entities[this.id].indexOf(this), 1);
    }

    static isCollided(entity1: Entity, entity2: Entity): boolean {
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