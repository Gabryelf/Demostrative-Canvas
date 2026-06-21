// script.js — Управление слайдами в документации

(() => {
    const slides = document.querySelectorAll('.slide');
    const navBtns = document.querySelectorAll('.nav-btn');
    const dots = document.getElementById('slideDots');
    const prevBtn = document.getElementById('prevSlide');
    const nextBtn = document.getElementById('nextSlide');
    const counter = document.getElementById('slideCounter');
    let currentSlide = 0;
    const totalSlides = slides.length;

    // Создание точек
    if (dots) {
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('button');
            dot.className = 'slide-dot' + (i === 0 ? ' active' : '');
            dot.dataset.index = i;
            dot.addEventListener('click', () => goToSlide(i));
            dots.appendChild(dot);
        }
    }

    // Функция перехода к слайду
    function goToSlide(index) {
        if (index < 0 || index >= totalSlides) return;
        
        currentSlide = index;
        
        // Обновление слайдов
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === currentSlide);
        });
        
        // Обновление кнопок навигации
        navBtns.forEach((btn, i) => {
            btn.classList.toggle('active', i === currentSlide);
        });
        
        // Обновление точек
        document.querySelectorAll('.slide-dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === currentSlide);
        });
        
        // Обновление счетчика
        if (counter) {
            counter.textContent = `${currentSlide + 1} / ${totalSlides}`;
        }
        
        // Обновление состояния кнопок
        if (prevBtn) prevBtn.disabled = currentSlide === 0;
        if (nextBtn) nextBtn.disabled = currentSlide === totalSlides - 1;
        
        // Прокрутка к началу слайда
        const container = document.querySelector('.slides-container');
        if (container) {
            container.scrollTop = 0;
        }
    }

    // Обработчики для кнопок навигации
    navBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
            const index = parseInt(btn.dataset.slide);
            goToSlide(index);
        });
    });

    if (prevBtn) {
        prevBtn.addEventListener('click', () => goToSlide(currentSlide - 1));
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => goToSlide(currentSlide + 1));
    }

    // Клавиатурная навигация
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            e.preventDefault();
            goToSlide(currentSlide + 1);
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            e.preventDefault();
            goToSlide(currentSlide - 1);
        } else if (e.key === 'Home') {
            e.preventDefault();
            goToSlide(0);
        } else if (e.key === 'End') {
            e.preventDefault();
            goToSlide(totalSlides - 1);
        }
    });

    // Инициализация
    goToSlide(0);

    // Логирование
    console.log('📖 Документация загружена');
    console.log(`📊 Слайдов: ${totalSlides}`);
})();