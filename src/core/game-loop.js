// src/core/game-loop.js — Игровой цикл

class GameLoop {
    constructor(updateCallback, renderCallback, fps = 60) {
        this.updateCallback = updateCallback || null;
        this.renderCallback = renderCallback || null;
        this.fps = fps;
        this.frameInterval = 1000 / fps;
        this.isRunning = false;
        this._lastTime = 0;
        this._frameId = null;
        this._deltaTime = 0;
        this._elapsedTime = 0;
        this._frameCount = 0;
        this._fpsCounter = 0;
        this._fpsTimer = 0;
        this._currentFps = 0;
        this._accumulator = 0;
        this._fixedTimestep = false;
    }

    /**
     * Запуск цикла
     */
    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this._lastTime = performance.now();
        this._loop(this._lastTime);
    }

    /**
     * Остановка цикла
     */
    stop() {
        this.isRunning = false;
        if (this._frameId) {
            cancelAnimationFrame(this._frameId);
            this._frameId = null;
        }
    }

    /**
     * Основной цикл
     */
    _loop(timestamp) {
        if (!this.isRunning) return;

        this._frameId = requestAnimationFrame((t) => this._loop(t));

        const deltaTime = (timestamp - this._lastTime) / 1000;
        this._lastTime = timestamp;

        // Ограничиваем deltaTime
        const clampedDelta = Math.min(deltaTime, 0.05);

        this._deltaTime = clampedDelta;
        this._elapsedTime += clampedDelta;

        // Обновление FPS
        this._frameCount++;
        this._fpsTimer += clampedDelta;
        if (this._fpsTimer >= 1) {
            this._currentFps = this._frameCount;
            this._frameCount = 0;
            this._fpsTimer = 0;
        }

        // Обновление
        if (this.updateCallback) {
            this.updateCallback(clampedDelta);
        }

        // Рендеринг
        if (this.renderCallback) {
            this.renderCallback(clampedDelta);
        }
    }

    /**
     * Установка FPS
     */
    setFPS(fps) {
        this.fps = fps;
        this.frameInterval = 1000 / fps;
        return this;
    }

    /**
     * Получение текущего FPS
     */
    getFPS() {
        return this._currentFps;
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

    /**
     * Включение фиксированного шага
     */
    setFixedTimestep(enabled) {
        this._fixedTimestep = enabled;
        return this;
    }

    /**
     * Обновление колбэков
     */
    setCallbacks(update, render) {
        this.updateCallback = update;
        this.renderCallback = render;
        return this;
    }
}

// Экспорт
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { GameLoop };
} else {
    window.GameLoop = GameLoop;
}