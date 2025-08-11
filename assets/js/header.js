 // Mobile menu toggle functionality
        const menuToggle = document.getElementById('menuToggle');
        const mobileNavOverlay = document.getElementById('mobileNavOverlay');
        const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

        // Toggle mobile menu
        menuToggle.addEventListener('click', () => {
            mobileNavOverlay.classList.toggle('active');
        });

        // Close mobile menu when clicking outside the panel
        mobileNavOverlay.addEventListener('click', (e) => {
            if (e.target === mobileNavOverlay) {
                mobileNavOverlay.classList.remove('active');
            }
        });

        // Close mobile menu when clicking on any nav link
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileNavOverlay.classList.remove('active');
            });
        });

        // Also close menu when clicking desktop nav links on mobile (in case of responsive breakpoint changes)
        document.querySelectorAll('.nav-menu .nav-link, .nav-menu .btn__secondary--outline').forEach(link => {
            link.addEventListener('click', () => {
                if (mobileNavOverlay.classList.contains('active')) {
                    mobileNavOverlay.classList.remove('active');
                }
            });
        });

        // Close mobile menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileNavOverlay.classList.contains('active')) {
                mobileNavOverlay.classList.remove('active');
            }
        });

        // Smooth scroll offset for fixed header
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    const headerHeight = document.querySelector('.navbar').offsetHeight;
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });