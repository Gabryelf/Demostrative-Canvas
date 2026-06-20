// src/core/scene.js — Управление сценой

class Scene {
    constructor(name = 'default') {
        this.name = name;
        this.objects = [];
        this._isActive = false;
        this._backgroundColor = 'rgba(0, 0, 0, 0)';
    }

    /**
     * Добавление объекта в сцену
     */
    addObject(object) {
        this.objects.push(object);
        return this;
    }

    /**
     * Удаление объекта из сцены
     */
    removeObject(object) {
        const index = this.objects.indexOf(object);
        if (index !== -1) {
            this.objects.splice(index, 1);
        }
        return this;
    }

    /**
     * Получение всех объектов
     */
    getObjects() {
        return this.objects.slice();
    }

    /**
     * Поиск объектов по тегу
     */
    getObjectsByTag(tag) {
        return this.objects.filter(obj => obj.getTag && obj.getTag() === tag);
    }

    /**
     * Поиск объектов по типу
     */
    getObjectsByType(type) {
        return this.objects.filter(obj => obj instanceof type);
    }

    /**
     * Обновление всех объектов
     */
    update(deltaTime) {
        for (const object of this.objects) {
            if (object.active !== false && typeof object.update === 'function') {
                object.update(deltaTime);
            }
        }
    }

    /**
     * Рендеринг всех объектов
     */
    render(ctx) {
        // Сортировка по zIndex
        const sorted = [...this.objects]
            .filter(obj => obj.active !== false)
            .sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));

        // Очистка
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        // Фон
        ctx.fillStyle = this._backgroundColor;
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        // Рендеринг объектов
        for (const object of sorted) {
            if (typeof object.render === 'function') {
                object.render(ctx);
            }
        }
    }

    /**
     * Установка цвета фона
     */
    setBackgroundColor(color) {
        this._backgroundColor = color;
        return this;
    }

    /**
     * Активация сцены
     */
    activate() {
        this._isActive = true;
        if (typeof this.onActivate === 'function') {
            this.onActivate();
        }
        return this;
    }

    /**
     * Деактивация сцены
     */
    deactivate() {
        this._isActive = false;
        if (typeof this.onDeactivate === 'function') {
            this.onDeactivate();
        }
        return this;
    }

    /**
     * Очистка сцены
     */
    clear() {
        this.objects = [];
        return this;
    }

    /**
     * Уничтожение сцены
     */
    destroy() {
        this.clear();
        this._isActive = false;
    }
}

// Экспорт
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Scene };
} else {
    window.Scene = Scene;
}