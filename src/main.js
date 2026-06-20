// src/main.js — Главный скрипт для загрузки и отображения примеров

/**
 * Данные о примерах
 * Каждый пример соответствует папке в /examples/
 */
 const EXAMPLES_DATA = [
    {
        id: '001-bouncing-ball',
        title: 'Прыгающий мяч',
        description: 'Классическая анимация мяча с физикой отскока и гравитацией',
        category: 'Анимация',
        difficulty: '⭐',
        tags: ['физика', 'гравитация', 'коллизия'],
        gif: 'assets/demo/001-bouncing-ball.gif',
        demoUrl: 'examples/001-bouncing-ball/index.html',
        docsUrl: 'examples/001-bouncing-ball/docs/index.html',
        codeUrl: 'https://github.com/Gabryelf/Demostrative-Canvas/tree/main/examples/001-bouncing-ball'
    },
    {
        id: '002-particle-system',
        title: 'Система частиц',
        description: 'Динамическая система частиц с различными эффектами и поведением',
        category: 'Эффекты',
        difficulty: '⭐⭐',
        tags: ['частицы', 'эффекты', 'физика'],
        gif: 'assets/demo/002-particle-system.gif',
        demoUrl: 'examples/002-particle-system/index.html',
        docsUrl: 'examples/002-particle-system/docs/index.html',
        codeUrl: 'https://github.com/Gabryelf/Demostrative-Canvas/tree/main/examples/002-particle-system'
    },
    {
        id: '003-rotating-shapes',
        title: 'Вращающиеся фигуры',
        description: 'Композиция из вращающихся геометрических фигур с плавной анимацией',
        category: 'Анимация',
        difficulty: '⭐',
        tags: ['вращение', 'геометрия', 'трансформации'],
        gif: 'assets/demo/003-rotating-shapes.gif',
        demoUrl: 'examples/003-rotating-shapes/index.html',
        docsUrl: 'examples/003-rotating-shapes/docs/index.html',
        codeUrl: 'https://github.com/Gabryelf/Demostrative-Canvas/tree/main/examples/003-rotating-shapes'
    },
    {
        id: '004-wave-motion',
        title: 'Волновое движение',
        description: 'Волны из точек и линий с настраиваемыми параметрами',
        category: 'Эффекты',
        difficulty: '⭐⭐',
        tags: ['волны', 'синусоиды', 'точки'],
        gif: 'assets/demo/004-wave-motion.gif',
        demoUrl: 'examples/004-wave-motion/index.html',
        docsUrl: 'examples/004-wave-motion/docs/index.html',
        codeUrl: 'https://github.com/Gabryelf/Demostrative-Canvas/tree/main/examples/004-wave-motion'
    },
    {
        id: '005-orbiting-system',
        title: 'Орбитальная система',
        description: 'Планетарная система с вращением по орбитам и гравитацией',
        category: 'Симуляция',
        difficulty: '⭐⭐⭐',
        tags: ['орбиты', 'гравитация', 'планеты'],
        gif: 'assets/demo/005-orbiting-system.gif',
        demoUrl: 'examples/005-orbiting-system/index.html',
        docsUrl: 'examples/005-orbiting-system/docs/index.html',
        codeUrl: 'https://github.com/Gabryelf/Demostrative-Canvas/tree/main/examples/005-orbiting-system'
    },
    {
        id: '006-game-snake',
        title: 'Игра Змейка',
        description: 'Классическая игра "Змейка" с управлением с клавиатуры',
        category: 'Игры',
        difficulty: '⭐⭐⭐',
        tags: ['игра', 'управление', 'коллизия'],
        gif: 'assets/demo/006-game-snake.gif',
        demoUrl: 'examples/006-game-snake/index.html',
        docsUrl: 'examples/006-game-snake/docs/index.html',
        codeUrl: 'https://github.com/Gabryelf/Demostrative-Canvas/tree/main/examples/006-game-snake'
    }
];

/**
 * Загрузка количества примеров
 */
document.addEventListener('DOMContentLoaded', () => {
    // Обновляем счетчик примеров
    const examplesCount = document.getElementById('examplesCount');
    if (examplesCount) {
        examplesCount.textContent = EXAMPLES_DATA.length;
    }

    // Загружаем примеры в сетку
    renderExamples();
});

/**
 * Рендеринг карточек примеров
 */
function renderExamples() {
    const grid = document.getElementById('examplesGrid');
    if (!grid) return;

    // Очищаем контейнер
    grid.innerHTML = '';

    // Создаем карточки для каждого примера
    EXAMPLES_DATA.forEach((example, index) => {
        const card = createExampleCard(example, index);
        grid.appendChild(card);
    });
}

/**
 * Создание HTML-элемента карточки примера
 */
function createExampleCard(example, index) {
    const card = document.createElement('div');
    card.className = 'example-card';
    card.style.animationDelay = `${(index * 0.05).toFixed(2)}s`;

    // GIF или плейсхолдер
    const gifContent = example.gif 
        ? `<img src="${example.gif}" alt="${example.title}" loading="lazy" onerror="this.parentElement.innerHTML='<span class=\'placeholder\'><span class=\'placeholder-icon\'></span>${example.title}</span>'">`
        : `<span class="placeholder"><span class="placeholder-icon"></span>${example.title}</span>`;

    card.innerHTML = `
        <div class="example-gif">
            ${gifContent}
        </div>
        <div class="example-info">
            <div class="example-meta">
                <span class="example-number">#${String(index + 1).padStart(3, '0')}</span>
                <span class="example-category">${example.category}</span>
                <span class="example-difficulty">${example.difficulty}</span>
            </div>
            <h3 class="example-title">${example.title}</h3>
            <p class="example-description">${example.description}</p>
            <div class="example-tags">
                ${example.tags.map(tag => `<span class="example-tag">#${tag}</span>`).join('')}
            </div>
            <div class="example-actions">
                <a href="${example.demoUrl}" class="btn btn-demo" target="_blank">▶ Запустить</a>
                <a href="${example.docsUrl}" class="btn btn-docs" target="_blank">📖 Документация</a>
                <a href="${example.codeUrl}" class="btn btn-code" target="_blank">💻 Код</a>
            </div>
        </div>
    `;

    return card;
}

// Экспорт для использования в других модулях
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { EXAMPLES_DATA, renderExamples };
}