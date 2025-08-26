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
    

    const openPrivacyButton = document.getElementById('openPrivacy');
    const closePrivacyButton = document.getElementById('closePrivacy');
    const privacyModal = document.getElementById('privacyModal');
    const privacyOverlay = document.querySelector('.privacy__overlay');

    if (openPrivacyButton && closePrivacyButton && privacyModal && privacyOverlay) {
        openPrivacyButton.addEventListener('click', () => {
            privacyModal.classList.add('privacy--active');  // Use privacyModal, not modal
            document.body.style.overflow = 'hidden';
            privacyOverlay.style.opacity = '1';             // Use privacyOverlay, not overlay
            privacyOverlay.style.visibility = 'visible';
        });
        
        closePrivacyButton.addEventListener('click', () => {
            privacyModal.classList.remove('privacy--active');
            document.body.style.overflow = '';
            privacyOverlay.style.opacity = '0';
            privacyOverlay.style.visibility = 'hidden';
        });
        
        privacyOverlay.addEventListener('click', () => {     // Use privacyOverlay, not overlay
            privacyModal.classList.remove('privacy--active');
            document.body.style.overflow = '';  
            privacyOverlay.style.opacity = '0';
            privacyOverlay.style.visibility = 'hidden';
        });
    }
