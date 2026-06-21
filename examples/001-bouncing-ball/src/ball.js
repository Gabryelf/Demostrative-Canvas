// src/ball.js — Класс мяча

class Ball {
    constructor(x, y, config = {}) {
        this.x = x || 0;
        this.y = y || 0;
        this.radius = config.radius || 20 + Math.random() * 15;
        this.color = config.color || `hsl(${Math.random() * 360}, 80%, 60%)`;
        
        this.vx = config.vx || (Math.random() - 0.5) * 8;
        this.vy = config.vy || (Math.random() - 0.5) * 6 - 2;
        
        this.gravity = config.gravity || 0.6;
        this.bounce = config.bounce || 0.8;
        this.friction = config.friction || 0.99;
        this.airResistance = config.airResistance || 0.999;
        
        this.trail = [];
        this.maxTrail = config.maxTrail || 10;
        this.trailEnabled = config.trailEnabled || false;
        
        this.isPaused = false;
        this.id = Ball._nextId++;
    }

    static _nextId = 0;

    /**
     * Обновление состояния мяча
     */
    update(canvasWidth, canvasHeight) {
        if (this.isPaused) return;

        // Сохраняем след
        if (this.trailEnabled) {
            this.trail.push({ x: this.x, y: this.y });
            if (this.trail.length > this.maxTrail) {
                this.trail.shift();
            }
        }

        // Физика
        this.vy += this.gravity;
        this.vx *= this.airResistance;
        this.x += this.vx;
        this.y += this.vy;

        // Отскок от стен
        if (this.x - this.radius < 0) {
            this.x = this.radius;
            this.vx = Math.abs(this.vx) * this.bounce;
        }
        if (this.x + this.radius > canvasWidth) {
            this.x = canvasWidth - this.radius;
            this.vx = -Math.abs(this.vx) * this.bounce;
        }
        if (this.y + this.radius > canvasHeight) {
            this.y = canvasHeight - this.radius;
            this.vy = -Math.abs(this.vy) * this.bounce;
            this.vx *= this.friction;
        }
        if (this.y - this.radius < 0) {
            this.y = this.radius;
            this.vy = Math.abs(this.vy) * this.bounce;
        }

        // Остановка при очень малой скорости
        if (Math.abs(this.vx) < 0.01) this.vx = 0;
        if (Math.abs(this.vy) < 0.01 && this.y + this.radius >= canvasHeight - 1) {
            this.vy = 0;
        }
    }

    /**
     * Отрисовка мяча
     */
    render(ctx) {
        ctx.save();

        // Тень
        ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
        ctx.shadowBlur = 20;
        ctx.shadowOffsetY = 4;

        // След
        if (this.trailEnabled && this.trail.length > 1) {
            for (let i = 0; i < this.trail.length - 1; i++) {
                const alpha = i / this.trail.length * 0.3;
                ctx.beginPath();
                ctx.arc(this.trail[i].x, this.trail[i].y, this.radius * (i / this.trail.length) * 0.5, 0, Math.PI * 2);
                ctx.fillStyle = this.color.replace(')', `, ${alpha})`).replace('hsl', 'hsla');
                ctx.fill();
            }
        }

        // Основной градиент
        const gradient = ctx.createRadialGradient(
            this.x - this.radius * 0.3,
            this.y - this.radius * 0.3,
            0,
            this.x,
            this.y,
            this.radius
        );
        gradient.addColorStop(0, '#ffffff');
        gradient.addColorStop(0.3, this.color);
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0.3)');

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Блик
        ctx.shadowBlur = 0;
        ctx.shadowOffsetY = 0;
        ctx.beginPath();
        ctx.arc(this.x - this.radius * 0.25, this.y - this.radius * 0.25, this.radius * 0.2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.fill();

        // Второй блик (маленький)
        ctx.beginPath();
        ctx.arc(this.x - this.radius * 0.1, this.y - this.radius * 0.4, this.radius * 0.08, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.fill();

        ctx.restore();
    }

    /**
     * Проверка столкновения с другим мячом
     */
    collidesWith(other) {
        const dx = this.x - other.x;
        const dy = this.y - other.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < this.radius + other.radius;
    }

    /**
     * Установка паузы
     */
    setPaused(paused) {
        this.isPaused = paused;
    }

    /**
     * Получение скорости
     */
    getSpeed() {
        return Math.sqrt(this.vx * this.vx + this.vy * this.vy);
    }

    /**
     * Уничтожение мяча
     */
    destroy() {
        this.trail = [];
    }
}

// Экспорт
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Ball };
} else {
    window.Ball = Ball;
}