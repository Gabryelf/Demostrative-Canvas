// src/abstract/game-object.js

/**
 * Базовый класс для всех игровых объектов
 * В будущем будет расширен интерфейсами Renderable, Updatable и др.
 */
 class GameObject {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
        this.rotation = 0;
        this.scaleX = 1;
        this.scaleY = 1;
        this.alpha = 1;
        this.zIndex = 0;
        this.active = true;
        this._components = [];
        this._children = [];
        this._parent = null;
        this._tag = '';
        this._id = GameObject._nextId++;
    }

    static _nextId = 0;

    // ===== Основные методы (будут расширены интерфейсами) =====
    
    update(deltaTime) {
        if (!this.active) return;
        
        for (const component of this._components) {
            if (component.active !== false && typeof component.update === 'function') {
                component.update(deltaTime, this);
            }
        }
        
        for (const child of this._children) {
            child.update(deltaTime);
        }
    }

    render(ctx) {
        if (!this.active) return;
        
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.scale(this.scaleX, this.scaleY);
        
        this._draw(ctx);
        
        ctx.restore();
        
        for (const child of this._children) {
            child.render(ctx);
        }
    }

    _draw(ctx) {
        // Переопределяется в наследниках
        // В будущем будет использовать Renderable интерфейс
    }

    // ===== Компоненты =====

    addComponent(component) {
        this._components.push(component);
        if (typeof component.onAttach === 'function') {
            component.onAttach(this);
        }
        return this;
    }

    removeComponent(component) {
        const index = this._components.indexOf(component);
        if (index !== -1) {
            this._components.splice(index, 1);
            if (typeof component.onDetach === 'function') {
                component.onDetach(this);
            }
        }
        return this;
    }

    getComponent(type) {
        return this._components.find(comp => comp instanceof type) || null;
    }

    getComponents(type) {
        return this._components.filter(comp => comp instanceof type);
    }

    // ===== Дочерние объекты =====

    addChild(child) {
        this._children.push(child);
        child._parent = this;
        return this;
    }

    removeChild(child) {
        const index = this._children.indexOf(child);
        if (index !== -1) {
            this._children.splice(index, 1);
            child._parent = null;
        }
        return this;
    }

    getChildren() {
        return this._children.slice();
    }

    getParent() {
        return this._parent;
    }

    // ===== Позиционирование =====

    getWorldPosition() {
        let x = this.x;
        let y = this.y;
        let current = this._parent;
        while (current) {
            x += current.x;
            y += current.y;
            current = current._parent;
        }
        return { x, y };
    }

    setPosition(x, y) {
        this.x = x;
        this.y = y;
        return this;
    }

    setRotation(rotation) {
        this.rotation = rotation;
        return this;
    }

    setScale(scaleX, scaleY) {
        this.scaleX = scaleX;
        this.scaleY = scaleY;
        return this;
    }

    setAlpha(alpha) {
        this.alpha = Math.max(0, Math.min(1, alpha));
        return this;
    }

    // ===== Состояние =====

    setActive(active) {
        this.active = active;
        for (const child of this._children) {
            child.setActive(active);
        }
        return this;
    }

    setTag(tag) {
        this._tag = tag;
        return this;
    }

    getTag() {
        return this._tag;
    }

    getId() {
        return this._id;
    }

    setZIndex(zIndex) {
        this.zIndex = zIndex;
        return this;
    }

    getZIndex() {
        return this.zIndex;
    }

    // ===== Жизненный цикл =====

    destroy() {
        this.active = false;
        if (this._parent) {
            this._parent.removeChild(this);
        }
        for (const child of this._children) {
            child.destroy();
        }
        this._components = [];
        this._children = [];
        return this;
    }

    // ===== Вспомогательные методы =====

    getBounds() {
        return null; // Переопределяется в наследниках
    }
}

// Экспорт для браузерного использования
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { GameObject };
} else {
    window.GameObject = GameObject;
}