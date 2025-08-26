let currentSlideIndex = 0;
const slides = document.querySelectorAll('.image-slide');
const btns = document.querySelectorAll('.radio-btn');
const steps = document.querySelectorAll('.sidebar__step');
const bullets = document.querySelectorAll('.step__bullet');
const totalSlides = slides.length;
const mainTitle = document.getElementById('main-title');
const mainDescription = document.getElementById('main-description');


let autorunInterval;
let isAutorunActive = true;
const autorunDelay = 5000; 

function updateSlider() {
  slides.forEach((slide, index) => {
    slide.classList.toggle('active', index === currentSlideIndex);
    if (index === currentSlideIndex) {
      slide.classList.add('fading');
      setTimeout(() => slide.classList.remove('fading'), 800);
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

function updateMainContent() {
  const activeStep = steps[currentSlideIndex];
  if (activeStep) {
    const stepTitle = activeStep.querySelector('.step__title');
    const stepDescription = activeStep.querySelector('.step__description');
    if (stepTitle && stepDescription) {
      mainTitle.textContent = stepTitle.textContent;
      mainDescription.textContent = stepDescription.textContent;
    }
  }
}

function goToSlide(index) {
  if (index >= 0 && index < totalSlides) {
    currentSlideIndex = index;
    updateSlider();
    resetAutorun(); 
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

function startAutorun() {
  if (totalSlides <= 1) return; 
  
  stopAutorun(); 
  autorunInterval = setInterval(() => {
    if (isAutorunActive) {
      changeSlide(1); 
    }
  }, autorunDelay);
}

function stopAutorun() {
  if (autorunInterval) {
    clearInterval(autorunInterval);
    autorunInterval = null;
  }
}

function resetAutorun() {
  if (isAutorunActive) {
    startAutorun(); 
  }
}

function toggleAutorun() {
  isAutorunActive = !isAutorunActive;
  if (isAutorunActive) {
    startAutorun();
  } else {
    stopAutorun();
  }
  return isAutorunActive;
}

function pauseAutorunOnHover() {
  const sliderContainer = document.querySelector('.slider-container') || document.body;
  
  sliderContainer.addEventListener('mouseenter', () => {
    if (isAutorunActive) {
      stopAutorun();
    }
  });
  
  sliderContainer.addEventListener('mouseleave', () => {
    if (isAutorunActive) {
      startAutorun();
    }
  });
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') {
    changeSlide(-1);
    resetAutorun();
  } else if (e.key === 'ArrowRight') {
    changeSlide(1);
    resetAutorun();
  } else if (e.key === ' ' || e.key === 'Spacebar') {
    
    e.preventDefault();
    toggleAutorun();
  }
});


btns.forEach((btn, index) => {
  btn.addEventListener('click', () => {
    goToSlide(index);
  });
});


steps.forEach((step, index) => {
  step.addEventListener('click', () => {
    goToSlide(index);
  });
});

updateSlider();
startAutorun();