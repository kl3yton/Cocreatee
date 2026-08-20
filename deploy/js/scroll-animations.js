// ===========================================================
// SCROLL REVEAL ANIMATIONS - Animações ao Rolar a Página
// ===========================================================

document.addEventListener('DOMContentLoaded', function () {

    // Função para verificar se elemento está visível na tela
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;

        // Elemento é considerado visível quando 20% dele está na tela
        return (
            rect.top <= windowHeight * 0.8 &&
            rect.bottom >= 0
        );
    }

    // Função para ativar animações
    function revealOnScroll() {
        // Animar cards da seção "O que fazemos"
        const cards = document.querySelectorAll('.card');
        cards.forEach((card, index) => {
            if (isElementInViewport(card)) {
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, index * 100); // Delay escalonado para efeito cascata
            }
        });

        // Animar itens da seção "Vantagens"
        const vantagensItems = document.querySelectorAll('.vantagens .itens-container');
        vantagensItems.forEach((item, index) => {
            if (isElementInViewport(item) && !item.classList.contains('active')) {
                setTimeout(() => {
                    item.classList.add('active');
                }, index * 200);
            }
        });

        // Animar boxes de instruções
        const instruBoxes = document.querySelectorAll('.instru-box');
        instruBoxes.forEach((box, index) => {
            if (isElementInViewport(box) && !box.classList.contains('active')) {
                setTimeout(() => {
                    box.classList.add('active');
                }, index * 150);
            }
        });

        // Animar elementos com classe scroll-reveal
        const scrollRevealElements = document.querySelectorAll('.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right');
        scrollRevealElements.forEach((element) => {
            if (isElementInViewport(element)) {
                element.classList.add('active');
            }
        });
    }

    // Executar na carga inicial
    revealOnScroll();

    // Executar ao rolar com throttle para performance
    let scrollTimeout;
    window.addEventListener('scroll', function () {
        if (scrollTimeout) {
            window.cancelAnimationFrame(scrollTimeout);
        }

        scrollTimeout = window.requestAnimationFrame(function () {
            revealOnScroll();
        });
    });

    // ===========================================================
    // SMOOTH TRANSITIONS BETWEEN SECTIONS
    // ===========================================================

    // Adicionar overlay suave nas transições
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.style.transition = 'background 0.6s ease';
    });

});

// ===========================================================
// PARALLAX ULTRA SUTIL (Apenas no vídeo de background)
// ===========================================================

document.addEventListener('DOMContentLoaded', function () {
    const videoContainer = document.querySelector('.background-video video');

    if (videoContainer) {
        window.addEventListener('scroll', function () {
            const scrolled = window.pageYOffset;
            const speed = 0.3; // Muito sutil

            // Aplicar apenas se estiver perto do topo
            if (scrolled < 800) {
                videoContainer.style.transform = `translateY(${scrolled * speed}px) scale(1.1)`;
            }
        });
    }
});
