// src/main.js — Главный скрипт для примера

(() => {
    const canvas = document.getElementById('demo');
    const ctx = canvas.getContext('2d');
    const ballCountEl = document.getElementById('ballCount');
    const fpsDisplay = document.getElementById('fpsDisplay');

    // Конфигурация
    const CONFIG = {
        gravity: 0.6,
        bounce: 0.8,
        friction: 0.99,
        maxBalls: 50,
        trailEnabled: false
    };

    let balls = [];
    let isPaused = false;
    let frameCount = 0;
    let fpsTimer = 0;
    let currentFps = 0;

    // Создание начальных мячей
    function initBalls(count = 1) {
        balls = [];
        for (let i = 0; i < count; i++) {
            const x = 100 + Math.random() * (canvas.width - 200);
            const y = 50 + Math.random() * 100;
            addBall(x, y);
        }
        updateBallCount();
    }

    // Добавление одного мяча
    function addBall(x, y) {
        if (balls.length >= CONFIG.maxBalls) {
            // Удаляем самый старый мяч
            const oldest = balls.shift();
            if (oldest.destroy) oldest.destroy();
        }

        const ball = new Ball(x, y, {
            gravity: CONFIG.gravity,
            bounce: CONFIG.bounce,
            friction: CONFIG.friction,
            trailEnabled: CONFIG.trailEnabled
        });
        balls.push(ball);
        updateBallCount();
        return ball;
    }

    // Обновление счетчика мячей
    function updateBallCount() {
        if (ballCountEl) {
            ballCountEl.textContent = balls.length;
        }
    }

    // Очистка всех мячей
    function clearBalls() {
        balls.forEach(ball => {
            if (ball.destroy) ball.destroy();
        });
        balls = [];
        updateBallCount();
    }

    // Обновление физики
    function update(deltaTime) {
        if (isPaused) return;

        const step = Math.min(deltaTime * 60, 5);
        for (let i = 0; i < step; i++) {
            balls.forEach(ball => {
                ball.update(canvas.width, canvas.height);
            });
        }

        // Проверка столкновений между мячами (упрощенная)
        for (let i = 0; i < balls.length; i++) {
            for (let j = i + 1; j < balls.length; j++) {
                const a = balls[i];
                const b = balls[j];
                if (a.collidesWith && a.collidesWith(b)) {
                    // Простой отскок
                    const dx = a.x - b.x;
                    const dy = a.y - b.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist > 0) {
                        const nx = dx / dist;
                        const ny = dy / dist;
                        const overlap = (a.radius + b.radius - dist) / 2;
                        a.x += nx * overlap;
                        a.y += ny * overlap;
                        b.x -= nx * overlap;
                        b.y -= ny * overlap;
                        
                        // Меняем скорости
                        const tempVx = a.vx;
                        const tempVy = a.vy;
                        a.vx = b.vx * 0.8;
                        a.vy = b.vy * 0.8;
                        b.vx = tempVx * 0.8;
                        b.vy = tempVy * 0.8;
                    }
                }
            }
        }
    }

    // Отрисовка
    function render() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Фон с градиентом
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, '#1a1a2e');
        gradient.addColorStop(1, '#0a0a15');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Пол
        const floorGradient = ctx.createLinearGradient(0, canvas.height - 30, 0, canvas.height);
        floorGradient.addColorStop(0, 'rgba(139, 92, 246, 0.05)');
        floorGradient.addColorStop(0.5, 'rgba(139, 92, 246, 0.15)');
        floorGradient.addColorStop(1, 'rgba(139, 92, 246, 0.25)');
        ctx.fillStyle = floorGradient;
        ctx.fillRect(0, canvas.height - 30, canvas.width, 30);

        // Линия пола
        ctx.strokeStyle = 'rgba(139, 92, 246, 0.2)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, canvas.height - 30);
        ctx.lineTo(canvas.width, canvas.height - 30);
        ctx.stroke();

        // Рендеринг мячей
        balls.forEach(ball => {
            ball.render(ctx);
        });

        // Информация о количестве
        if (balls.length === 0) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
            ctx.font = '24px Inter, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('Нажмите "+" или кликните по холсту', canvas.width / 2, canvas.height / 2);
        }
    }

    // Игровой цикл
    let lastTime = 0;

    function gameLoop(timestamp) {
        const deltaTime = (timestamp - lastTime) / 1000;
        lastTime = timestamp;

        // FPS счетчик
        frameCount++;
        fpsTimer += deltaTime;
        if (fpsTimer >= 1) {
            currentFps = Math.round(frameCount / fpsTimer);
            frameCount = 0;
            fpsTimer = 0;
            if (fpsDisplay) {
                fpsDisplay.textContent = currentFps;
            }
        }

        update(deltaTime);
        render();
        requestAnimationFrame(gameLoop);
    }

    // ===== Обработчики событий =====

    // Клик по холсту - добавить мяч
    canvas.addEventListener('click', (e) => {
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const x = (e.clientX - rect.left) * scaleX;
        const y = (e.clientY - rect.top) * scaleY;
        addBall(x, y);
    });

    // Кнопка добавления мяча
    document.getElementById('addBallBtn')?.addEventListener('click', () => {
        const x = 100 + Math.random() * (canvas.width - 200);
        const y = 50 + Math.random() * 100;
        addBall(x, y);
    });

    // Кнопка очистки
    document.getElementById('clearBtn')?.addEventListener('click', () => {
        clearBalls();
    });

    // Клавиша Space для паузы
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space') {
            e.preventDefault();
            isPaused = !isPaused;
            balls.forEach(ball => {
                if (ball.setPaused) ball.setPaused(isPaused);
            });
            // Визуальный индикатор паузы
            if (isPaused) {
                canvas.style.opacity = '0.6';
            } else {
                canvas.style.opacity = '1';
            }
        }
    });

    // ===== Инициализация =====

    // Устанавливаем размер canvas
    canvas.width = 800;
    canvas.height = 500;

    // Инициализация
    initBalls(3);

    // Запуск игрового цикла
    lastTime = performance.now();
    requestAnimationFrame(gameLoop);

    // Логирование
    console.log('🏀 Пример 001: Прыгающий мяч');
    console.log('📊 Мячей:', balls.length);
    console.log('🎮 Нажмите Space для паузы');
})();