    let currentSlideIndex = 0;
        const slides = document.querySelectorAll('.image-slide');
        const btns = document.querySelectorAll('.radio-btn');
        const steps = document.querySelectorAll('.sidebar__step');
        const bullets = document.querySelectorAll('.step__bullet');
        const totalSlides = slides.length;

        function updateSlider() {
            // Update slides
            slides.forEach((slide, index) => {
                slide.classList.toggle('active', index === currentSlideIndex);
                if (index === currentSlideIndex) {
                    slide.classList.add('fading');
                    setTimeout(() => slide.classList.remove('fading'), 800);
                }
            });

            // Update btns
            btns.forEach((btn, index) => {
                btn.classList.toggle('active', index === currentSlideIndex);
            });

            // Update steps
            steps.forEach((step, index) => {
                step.classList.toggle('active', index === currentSlideIndex);
            });

            // Update bullets
            bullets.forEach((bullet, index) => {
                bullet.classList.toggle('active', index === currentSlideIndex);
            });
        }

        function goToSlide(index) {
            if (index >= 0 && index < totalSlides) {
                currentSlideIndex = index;
                updateSlider();
            }
        }

        function changeSlide(direction) {
            currentSlideIndex += direction;
            
            if (currentSlideIndex >= totalSlides) {
                currentSlideIndex = 0;
            } else if (currentSlideIndex < 0) {
                currentSlideIndex = totalSlides - 1;
            }
            
            updateSlider();
        }

        // Auto-advance slider every 5 seconds
        setInterval(() => {
            // changeSlide(1);
        }, 5000);

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                changeSlide(-1);
            } else if (e.key === 'ArrowRight') {
                changeSlide(1);
            }
        });

        // Initialize
        updateSlider();