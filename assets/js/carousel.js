 let currentCard = 1; // Start with second card active
        const totalCards = 3;
        const wrapper = document.getElementById('carouselWrapper');
        const dots = document.querySelectorAll('.bullet');
        const cards = document.querySelectorAll('.card--quote');

        // Touch/scroll handling
        let isDown = false;
        let startX;
        let scrollLeft;
        let startTime;
        let moved = false;

        // Click on card to activate
        cards.forEach((card, index) => {
            card.addEventListener('click', (e) => {
                if (!moved) {
                    goToCard(index);
                }
            });
        });

        wrapper.addEventListener('mousedown', (e) => {
            isDown = true;
            startX = e.pageX - wrapper.offsetLeft;
            scrollLeft = wrapper.scrollLeft;
            startTime = Date.now();
            moved = false;
        });

        wrapper.addEventListener('mouseleave', () => {
            isDown = false;
        });

        wrapper.addEventListener('mouseup', () => {
            isDown = false;
            if (!moved) return;
            
            const endTime = Date.now();
            const timeDiff = endTime - startTime;
            const distance = Math.abs(wrapper.scrollLeft - scrollLeft);
            
            // If quick swipe, move to next/prev slide
            if (timeDiff < 300 && distance > 50) {
                const direction = wrapper.scrollLeft > scrollLeft ? 1 : -1;
                moveCarousel(direction);
            } else {
                // Snap to closest slide
                snapToClosest();
            }
        });

        wrapper.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            moved = true;
            e.preventDefault();
            const x = e.pageX - wrapper.offsetLeft;
            const walk = (x - startX) * 2;
            wrapper.scrollLeft = scrollLeft - walk;
        });

        // Touch events for mobile
        wrapper.addEventListener('touchstart', (e) => {
            startX = e.touches[0].pageX;
            scrollLeft = wrapper.scrollLeft;
            startTime = Date.now();
            moved = false;
        });

        wrapper.addEventListener('touchmove', (e) => {
            if (!startX) return;
            moved = true;
            const x = e.touches[0].pageX;
            const walk = (startX - x) * 1;
            wrapper.scrollLeft = scrollLeft + walk;
        });

        wrapper.addEventListener('touchend', () => {
            if (!moved) return;
            
            const endTime = Date.now();
            const timeDiff = endTime - startTime;
            const distance = Math.abs(wrapper.scrollLeft - scrollLeft);
            
            if (timeDiff < 300 && distance > 30) {
                const direction = wrapper.scrollLeft > scrollLeft ? 1 : -1;
                moveCarousel(direction);
            } else {
                snapToClosest();
            }
            
            startX = null;
        });

        function updateCarousel() {
            const cardWidth = 320 + 20; // card width + gap
            const targetScroll = currentCard * cardWidth;
            
            wrapper.style.transform = `translateX(-${targetScroll}px)`;
            
            // Update active states
            cards.forEach((card, index) => {
                card.classList.toggle('active', index === currentCard);
            });
            
            // Update dots
            dots.forEach((bullet, index) => {
                bullet.classList.toggle('active', index === currentCard);
            });
        }

        function moveCarousel(direction) {
            currentCard += direction;
            
            if (currentCard < 0) {
                currentCard = totalCards - 1;
            } else if (currentCard >= totalCards) {
                currentCard = 0;
            }
            
            updateCarousel();
        }

        function goToCard(index) {
            currentCard = index;
            updateCarousel();
        }

        function snapToClosest() {
            const cardWidth = 320 + 20;
            const scrollPos = -parseFloat(wrapper.style.transform.replace('translateX(', '').replace('px)', '')) || 0;
            const closest = Math.round(scrollPos / cardWidth);
            
            currentCard = Math.max(0, Math.min(closest, totalCards - 1));
            updateCarousel();
        }

        // Auto-play functionality removed

        // Pause auto-play on hover (removed)
        // wrapper.addEventListener('mouseenter', stopAutoPlay);
        // wrapper.addEventListener('mouseleave', startAutoPlay);

        // Handle window resize
        window.addEventListener('resize', () => {
            updateCarousel();
        });

        // Initialize
        updateCarousel();

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                moveCarousel(-1);
            } else if (e.key === 'ArrowRight') {
                moveCarousel(1);
            }
        });