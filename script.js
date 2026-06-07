document.addEventListener('DOMContentLoaded', () => {
  const brochure = document.getElementById('brochure');
  const btnState = document.getElementById('toggle-state');
  const btnFlip = document.getElementById('toggle-flip');

  let state = 0; // 0: Closed, 1: Cover Open, 2: Fully Open
  let isFlipped = false;

  const updateState = () => {
    // Reset classes
    brochure.classList.remove('step-1', 'step-2');
    
    if (state === 1) {
      brochure.classList.add('step-1');
      btnState.textContent = "Open Inside Flap";
      if (isFlipped) toggleFlip(); // Don't allow opening backwards
    } else if (state === 2) {
      brochure.classList.add('step-2');
      btnState.textContent = "Close Brochure";
    } else {
      btnState.textContent = "Open Cover";
    }
  };

  const cycleState = () => {
    state = (state + 1) % 3; // Cycles 0 -> 1 -> 2 -> 0
    updateState();
  };

  const toggleFlip = () => {
    isFlipped = !isFlipped;
    if (isFlipped) {
      brochure.classList.add('is-flipped');
      btnFlip.textContent = "View Front";
      // If they try to look at the back while open, close it first
      if (state !== 0) { 
        state = 0;
        updateState();
      }
    } else {
      brochure.classList.remove('is-flipped');
      btnFlip.textContent = "Flip to Back";
    }
  };

  btnState.addEventListener('click', cycleState);
  btnFlip.addEventListener('click', toggleFlip);

  // --- Mobile Swipe Mechanics ---
  let touchStartX = 0;
  let touchEndX = 0;

  const handleSwipe = () => {
    const swipeThreshold = 50; 
    const swipeDistance = touchEndX - touchStartX;

    if (swipeDistance > swipeThreshold) {
      // Swipe Right (Open further)
      if (state < 2 && !isFlipped) {
        state++;
        updateState();
      }
      if (isFlipped) toggleFlip();
    } else if (swipeDistance < -swipeThreshold) {
      // Swipe Left (Close)
      if (state > 0) {
        state--;
        updateState();
      } else if (!isFlipped) {
        toggleFlip();
      }
    }
  };

  const container = document.querySelector('.survey-brochure-container');
  
  container.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  container.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });
});
