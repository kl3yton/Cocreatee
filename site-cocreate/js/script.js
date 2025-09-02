let currentSlide = 0;
const cardesPerView = 3;
const cardeWidth = 350 + 20;
let isTransitioning = false;
let totalSlides = 0;
let wrapper;

function initCarousel() {
    wrapper = document.getElementById('carouselWrapper');
    const originalCardes = wrapper.children;
    totalSlides = originalCardes.length;
    
    // Clonar últimos cards no início
    for (let i = totalSlides - cardesPerView; i < totalSlides; i++) {
        wrapper.insertBefore(originalCardes[i].cloneNode(true), wrapper.firstChild);
    }
    
    // Clonar primeiros cards no final
    for (let i = 0; i < cardesPerView; i++) {
        wrapper.appendChild(originalCardes[i + cardesPerView].cloneNode(true));
    }
    
    // Posicionar no primeiro card real
    currentSlide = cardesPerView;
    wrapper.style.transform = `translateX(-${currentSlide * cardeWidth}px)`;
}

function updateCarousel(animate = true) {
    wrapper.style.transition = animate ? 'transform 0.5s ease-in-out' : 'none';
    wrapper.style.transform = `translateX(-${currentSlide * cardeWidth}px)`;
    
    // Atualizar indicadores
    const realIndex = (currentSlide - cardesPerView + totalSlides) % totalSlides;
    document.querySelectorAll('.indicator').forEach((indicator, index) => {
        indicator.classList.toggle('active', index === realIndex);
    });
}

function nextSlide() {
    if (isTransitioning) return;
    
    isTransitioning = true;
    currentSlide++;
    updateCarousel();
    
    setTimeout(() => {
        if (currentSlide >= totalSlides + cardesPerView) {
            currentSlide = cardesPerView;
            updateCarousel(false);
        }
        isTransitioning = false;
    }, 500);
}

function prevSlide() {
    if (isTransitioning) return;
    
    isTransitioning = true;
    currentSlide--;
    updateCarousel();
    
    setTimeout(() => {
        if (currentSlide < cardesPerView) {
            currentSlide = totalSlides + cardesPerView - 1;
            updateCarousel(false);
        }
        isTransitioning = false;
    }, 500);
}

function goToSlide(index) {
    if (isTransitioning) return;
    currentSlide = index + cardesPerView;
    updateCarousel();
}

// Touch support
let startX = 0;
let endX = 0;

function handleSwipe() {
    const diff = startX - endX;
    if (Math.abs(diff) > 50) {
        if (diff > 0) nextSlide();
        else prevSlide();
    }
}

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    initCarousel();
    
    wrapper.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
    });

    wrapper.addEventListener('touchend', (e) => {
        endX = e.changedTouches[0].clientX;
        handleSwipe();
    });
    
    // Auto slide com pause no hover
    let autoSlideInterval = setInterval(nextSlide, 2000);

    document.querySelector('.carousel-container').addEventListener('mouseenter', () => {
        clearInterval(autoSlideInterval);
    });

    document.querySelector('.carousel-container').addEventListener('mouseleave', () => {
        autoSlideInterval = setInterval(nextSlide, 2000);
    });
});