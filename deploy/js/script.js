let currentSlide = 0;
        const cardesPerView = 3;
        let isTransitioning = false;
        let totalSlides = 0;
        let wrapper;
        let cardeWidth = 370; // 350px + 20px margin

        // Variáveis para drag/swipe
        let isDragging = false;
        let startX = 0;
        let currentX = 0;
        let initialTransform = 0;
        const threshold = 50;
        let autoSlideInterval;

        function getCardeWidth() {
            if (window.innerWidth <= 768) return 300; // 280px + 20px margin
            if (window.innerWidth <= 1200) return 340; // 320px + 20px margin
            return 370; // 350px + 20px margin
        }

        function initCarousel() {
            wrapper = document.getElementById('carouselWrapper');
            if (!wrapper) return;

            const originalCardes = Array.from(wrapper.children);
            totalSlides = originalCardes.length;
            
            cardeWidth = getCardeWidth();
            
            // Clonar últimos cards no início
            for (let i = totalSlides - cardesPerView; i < totalSlides; i++) {
                wrapper.insertBefore(originalCardes[i].cloneNode(true), wrapper.firstChild);
            }
            
            // Clonar primeiros cards no final
            for (let i = 0; i < cardesPerView; i++) {
                wrapper.appendChild(originalCardes[i].cloneNode(true));
            }
            
            // Posicionar no primeiro card real
            currentSlide = cardesPerView;
            wrapper.style.transform = `translateX(-${currentSlide * cardeWidth}px)`;
        }

        function updateCarousel(animate = true) {
            wrapper.style.transition = animate ? 'transform 0.5s ease-in-out' : 'none';
            wrapper.style.transform = `translateX(-${currentSlide * cardeWidth}px)`;
            
            // Atualizar indicadores
            const realIndex = ((currentSlide - cardesPerView) % totalSlides + totalSlides) % totalSlides;
            document.querySelectorAll('.indicator').forEach((indicator, index) => {
                indicator.classList.toggle('active', index === realIndex);
            });
        }

        function nextSlide() {
            if (isTransitioning || isDragging) return;
            
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
            if (isTransitioning || isDragging) return;
            
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
            if (isTransitioning || isDragging) return;
            currentSlide = index + cardesPerView;
            updateCarousel();
        }

        function getEventX(e) {
            return e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
        }

        function handleStart(e) {
            if (isTransitioning) return;
            
            isDragging = true;
            startX = getEventX(e);
            currentX = startX;
            initialTransform = currentSlide * cardeWidth;
            
            wrapper.style.transition = 'none';
            wrapper.style.cursor = 'grabbing';
            
            e.preventDefault();
        }

        function handleMove(e) {
            if (!isDragging) return;
            
            e.preventDefault();
            currentX = getEventX(e);
            const deltaX = currentX - startX;
            const newTransform = initialTransform - deltaX;
            
            wrapper.style.transform = `translateX(-${newTransform}px)`;
        }

        function handleEnd() {
            if (!isDragging) return;
            
            isDragging = false;
            wrapper.style.cursor = 'grab';
            
            const deltaX = currentX - startX;
            const absDeltaX = Math.abs(deltaX);
            
            if (absDeltaX > threshold) {
                if (deltaX > 0) {
                    prevSlide();
                } else {
                    nextSlide();
                }
            } else {
                updateCarousel();
            }
        }

        function handleLeave() {
            if (isDragging) {
                isDragging = false;
                wrapper.style.cursor = 'grab';
                updateCarousel();
            }
        }

        function startAutoSlide() {
            stopAutoSlide();
            autoSlideInterval = setInterval(() => {
                if (!isDragging) nextSlide();
            }, 3000);
        }

        function stopAutoSlide() {
            if (autoSlideInterval) {
                clearInterval(autoSlideInterval);
            }
        }

        document.addEventListener('DOMContentLoaded', () => {
            initCarousel();
            
            if (!wrapper) {
                console.error('Carousel wrapper não encontrado');
                return;
            }
            
            // Event listeners para mouse
            wrapper.addEventListener('mousedown', handleStart);
            wrapper.addEventListener('mousemove', handleMove);
            wrapper.addEventListener('mouseup', handleEnd);
            wrapper.addEventListener('mouseleave', handleLeave);
            
            // Event listeners para touch
            wrapper.addEventListener('touchstart', handleStart, { passive: false });
            wrapper.addEventListener('touchmove', handleMove, { passive: false });
            wrapper.addEventListener('touchend', handleEnd);
            
            wrapper.style.cursor = 'grab';
            
            // Auto slide com pause no hover
            startAutoSlide();

            const carouselContainer = document.querySelector('.carousel-container');
            if (carouselContainer) {
                carouselContainer.addEventListener('mouseenter', stopAutoSlide);
                carouselContainer.addEventListener('mouseleave', startAutoSlide);
            }
            
            // Prevenir drag de imagens
            wrapper.addEventListener('dragstart', (e) => e.preventDefault());
            
            // Click nos indicadores
            document.querySelectorAll('.indicator').forEach((indicator) => {
                indicator.addEventListener('click', () => {
                    const index = parseInt(indicator.getAttribute('data-index'));
                    goToSlide(index);
                });
            });
            
            // Redimensionamento da janela
            let resizeTimeout;
            window.addEventListener('resize', () => {
                clearTimeout(resizeTimeout);
                resizeTimeout = setTimeout(() => {
                    cardeWidth = getCardeWidth();
                    wrapper.style.transition = 'none';
                    wrapper.style.transform = `translateX(-${currentSlide * cardeWidth}px)`;
                    setTimeout(() => {
                        wrapper.style.transition = 'transform 0.5s ease-in-out';
                    }, 50);
                }, 100);
            });
        });

        