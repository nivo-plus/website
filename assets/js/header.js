 
        const menuToggle = document.getElementById('menuToggle');
        const mobileNavOverlay = document.getElementById('mobileNavOverlay');
        const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

        
        menuToggle.addEventListener('click', () => {
            mobileNavOverlay.classList.toggle('active');
        });

        
        mobileNavOverlay.addEventListener('click', (e) => {
            if (e.target === mobileNavOverlay) {
                mobileNavOverlay.classList.remove('active');
            }
        });

        
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileNavOverlay.classList.remove('active');
            });
        });

        document.querySelectorAll('.nav-menu .nav-link, .nav-menu .btn__secondary--outline').forEach(link => {
            link.addEventListener('click', () => {
                if (mobileNavOverlay.classList.contains('active')) {
                    mobileNavOverlay.classList.remove('active');
                }
            });
        });

        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileNavOverlay.classList.contains('active')) {
                mobileNavOverlay.classList.remove('active');
            }
        });

        
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