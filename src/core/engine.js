// src/core/engine.js — Главный движок приложения

class Engine {
    constructor(config = {}) {
        this.canvas = config.canvas || null;
        this.ctx = config.ctx || null;
        this.scenes = [];
        this.activeScene = null;
        this.isRunning = false;
        this._lastTime = 0;
        this._frameId = null;
        this._fps = config.fps || 60;
        this._deltaTime = 0;
        this._elapsedTime = 0;
        this._debug = config.debug || false;
    }

    /**
     * Инициализация движка
     */
    init(canvasId) {
        if (typeof canvasId === 'string') {
            this.canvas = document.getElementById(canvasId);
        } else if (canvasId instanceof HTMLCanvasElement) {
            this.canvas = canvasId;
        }

        if (!this.canvas) {
            console.error('Engine: Canvas не найден');
            return false;
        }

        this.ctx = this.canvas.getContext('2d');
        if (!this.ctx) {
            console.error('Engine: Не удалось получить 2D контекст');
            return false;
        }

        // Автоматический resize
        this._setupResize();

        return true;
    }

    /**
     * Настройка автоматического изменения размера
     */
    _setupResize() {
        const resize = () => {
            // Можно настроить под свои нужды
            // Например, сохранять соотношение сторон
        };
        window.addEventListener('resize', resize);
        resize();
    }

    /**
     * Добавление сцены
     */
    addScene(scene) {
        this.scenes.push(scene);
        if (!this.activeScene) {
            this.activeScene = scene;
        }
        return this;
    }

    /**
     * Установка активной сцены
     */
    setActiveScene(name) {
        const scene = this.scenes.find(s => s.name === name);
        if (scene) {
            this.activeScene = scene;
            if (typeof scene.onActivate === 'function') {
                scene.onActivate();
            }
        }
        return this;
    }

    /**
     * Запуск игрового цикла
     */
    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this._lastTime = performance.now();
        this._loop(this._lastTime);
    }

    /**
     * Остановка игрового цикла
     */
    stop() {
        this.isRunning = false;
        if (this._frameId) {
            cancelAnimationFrame(this._frameId);
            this._frameId = null;
        }
    }

    /**
     * Главный игровой цикл
     */
    _loop(timestamp) {
        if (!this.isRunning) return;

        this._frameId = requestAnimationFrame((t) => this._loop(t));

        // Вычисляем deltaTime
        this._deltaTime = (timestamp - this._lastTime) / 1000;
        this._lastTime = timestamp;

        // Ограничиваем deltaTime
        if (this._deltaTime > 0.1) {
            this._deltaTime = 0.1;
        }

        this._elapsedTime += this._deltaTime;

        // Обновление
        this.update(this._deltaTime);

        // Рендеринг
        this.render();

        // Отладка
        if (this._debug) {
            this._debugInfo();
        }
    }

    /**
     * Обновление
     */
    update(deltaTime) {
        if (this.activeScene && typeof this.activeScene.update === 'function') {
            this.activeScene.update(deltaTime);
        }
    }

    /**
     * Рендеринг
     */
    render() {
        if (!this.ctx) return;

        // Очистка
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        if (this.activeScene && typeof this.activeScene.render === 'function') {
            this.activeScene.render(this.ctx);
        }
    }

    /**
     * Отладочная информация
     */
    _debugInfo() {
        // Можно выводить FPS и другую информацию
    }

    /**
     * Получение размеров canvas
     */
    getSize() {
        return {
            width: this.canvas.width,
            height: this.canvas.height
        };
    }

    /**
     * Установка размера canvas
     */
    setSize(width, height) {
        this.canvas.width = width;
        this.canvas.height = height;
        return this;
    }

    /**
     * Получение FPS
     */
    getFPS() {
        return this._fps;
    }

    /**
     * Получение deltaTime
     */
    getDeltaTime() {
        return this._deltaTime;
    }

    /**
     * Получение прошедшего времени
     */
    getElapsedTime() {
        return this._elapsedTime;
    }
}

// Экспорт
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Engine };
} else {
    window.Engine = Engine;
}