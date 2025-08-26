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
let isZoomed = false;
let isPanning = false;
let panStartX = 0;
let panStartY = 0;
let panX = 0;
let panY = 0;

// Open modal functionality
slides.forEach(slide => {
  slide.addEventListener('click', () => {
    if (slide.classList.contains('active')) {
      zoomImage.src = slide.src;
      zoomModal.classList.add('active');
      // Reset zoom state when opening modal
      isZoomed = false;
      zoomImage.classList.remove('zoomed-in');
      zoomImage.classList.add('zoomed-out');
    }
  });
});

// Close modal functionality
zoomClose.addEventListener('click', () => {
  zoomModal.classList.remove('active');
  resetZoom();
});

zoomModal.addEventListener('click', (e) => {
  if (e.target === zoomModal) {
    zoomModal.classList.remove('active');
    resetZoom();
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    zoomModal.classList.remove('active');
    resetZoom();
  }
});

// Zoom functionality
zoomImage.addEventListener('click', (e) => {
  e.stopPropagation(); // Prevent modal from closing
  if (!isPanning) { // Only toggle zoom if we weren't panning
    toggleZoom();
  }
});

// Panning functionality
zoomImage.addEventListener('mousedown', (e) => {
  if (isZoomed) {
    isPanning = true;
    panStartX = e.clientX - panX;
    panStartY = e.clientY - panY;
    zoomImage.classList.add('panning');
    e.preventDefault();
  }
});

document.addEventListener('mousemove', (e) => {
  if (isPanning && isZoomed) {
    panX = e.clientX - panStartX;
    panY = e.clientY - panStartY;
    updateImageTransform();
  }
});

document.addEventListener('mouseup', () => {
  if (isPanning) {
    isPanning = false;
    zoomImage.classList.remove('panning');
  }
});

// Touch support for mobile
zoomImage.addEventListener('touchstart', (e) => {
  if (isZoomed && e.touches.length === 1) {
    isPanning = true;
    const touch = e.touches[0];
    panStartX = touch.clientX - panX;
    panStartY = touch.clientY - panY;
    zoomImage.classList.add('panning');
    e.preventDefault();
  }
});

document.addEventListener('touchmove', (e) => {
  if (isPanning && isZoomed && e.touches.length === 1) {
    const touch = e.touches[0];
    panX = touch.clientX - panStartX;
    panY = touch.clientY - panStartY;
    updateImageTransform();
    e.preventDefault();
  }
});

document.addEventListener('touchend', () => {
  if (isPanning) {
    isPanning = false;
    zoomImage.classList.remove('panning');
  }
});

// Optional: Mouse wheel zoom
zoomImage.addEventListener('wheel', (e) => {
  e.preventDefault();
  if (e.deltaY < 0) {
    // Scroll up - zoom in
    zoomIn();
  } else {
    // Scroll down - zoom out
    zoomOut();
  }
});

function toggleZoom() {
  if (isZoomed) {
    zoomOut();
  } else {
    zoomIn();
  }
}

function zoomIn() {
  isZoomed = true;
  panX = 0;
  panY = 0;
  zoomImage.classList.remove('zoomed-out');
  zoomImage.classList.add('zoomed-in');
  updateImageTransform();
}

function zoomOut() {
  isZoomed = false;
  panX = 0;
  panY = 0;
  zoomImage.classList.remove('zoomed-in');
  zoomImage.classList.add('zoomed-out');
  updateImageTransform();
}

function resetZoom() {
  isZoomed = false;
  isPanning = false;
  panX = 0;
  panY = 0;
  zoomImage.classList.remove('zoomed-in', 'zoomed-out', 'panning');
}

function updateImageTransform() {
  if (isZoomed) {
    zoomImage.style.transform = `scale(2) translate(${panX / 2}px, ${panY / 2}px)`;
  } else {
    zoomImage.style.transform = 'scale(1)';
  }
}