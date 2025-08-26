    const openModalButton = document.getElementById('openModal');
    const closeModalButton = document.getElementById('closeModal');
    const modal = document.getElementById('myModal');
    const overlay = document.querySelector('.modal__overlay');

    if (openModalButton && closeModalButton && modal && overlay) {
        openModalButton.addEventListener('click', () => {
            modal.classList.add('modal--active');
            document.body.style.overflow = 'hidden';
            overlay.style.opacity = '1';
            overlay.style.visibility = 'visible';
        });
            closeModalButton.addEventListener('click', () => {
            modal.classList.remove('modal--active');
            document.body.style.overflow = '';
            overlay.style.opacity = '0';
            overlay.style.visibility = 'hidden';
        });
            overlay.addEventListener('click', () => {
            modal.classList.remove('modal--active');
            document.body.style.overflow = '';  
            overlay.style.opacity = '0';
            overlay.style.visibility = 'hidden';
        });
    }
    
    // Privacy
    const openPrivacyButton = document.getElementById('openPrivacy');
    const closePrivacyButton = document.getElementById('closePrivacy');
    const privacyModal = document.getElementById('privacyModal');
    const privacyOverlay = document.querySelector('.privacy__overlay');

    if (openPrivacyButton && closePrivacyButton && privacyModal && privacyOverlay) {
        openPrivacyButton.addEventListener('click', () => {
            privacyModal.classList.add('privacy--active');
            document.body.style.overflow = 'hidden';
            privacyOverlay.style.opacity = '1';           
            privacyOverlay.style.visibility = 'visible';
        });
        
        closePrivacyButton.addEventListener('click', () => {
            privacyModal.classList.remove('privacy--active');
            document.body.style.overflow = '';
            privacyOverlay.style.opacity = '0';
            privacyOverlay.style.visibility = 'hidden';
        });
        
        privacyOverlay.addEventListener('click', () => {   
            privacyModal.classList.remove('privacy--active');
            document.body.style.overflow = '';  
            privacyOverlay.style.opacity = '0';
            privacyOverlay.style.visibility = 'hidden';
        });
    }

    // Expand image
    function updateSlider() {
        slides.forEach((slide, index) => {
            slide.classList.toggle('active', index === currentSlideIndex);

            if (index === currentSlideIndex) {
                slide.classList.add('fading');
                setTimeout(() => slide.classList.remove('fading'), 800);

                slide.style.pointerEvents = "auto";
            } else {
                slide.style.pointerEvents = "none";
            }
        });

        btns.forEach((btn, index) => {
            btn.classList.toggle('active', index === currentSlideIndex);
        });

        steps.forEach((step, index) => {
            step.classList.toggle('active', index === currentSlideIndex);
        });

        bullets.forEach((bullet, index) => {
            bullet.classList.toggle('active', index === currentSlideIndex);
        });

        updateMainContent();
    }


    const zoomModal = document.getElementById('zoom-modal');
    const zoomImage = zoomModal.querySelector('.zoom-image');
    const zoomClose = document.getElementById('zoomClose');
    
    slides.forEach(slide => {
        slide.addEventListener('click', () => {
            if (slide.classList.contains('active')) {
                zoomImage.src = slide.src;
                zoomModal.classList.add('active');
            }
        });
    });

    zoomClose.addEventListener('click', () => {
        zoomModal.classList.remove('active');
    });

    zoomModal.addEventListener('click', (e) => {
        if (e.target === zoomModal) zoomModal.classList.remove('active');
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') zoomModal.classList.remove('active');
    });
