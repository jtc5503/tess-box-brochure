document.addEventListener('DOMContentLoaded', () => {
  const brochure = document.getElementById('brochure');
  const btnState = document.getElementById('toggle-state');
  const btnFlip = document.getElementById('toggle-flip');

  let state = 0; // 0: Closed, 1: Cover Open, 2: Fully Open
  let isFlipped = false;
  let isAnimating = false; // Prevents button spamming

  const updateState = () => {
    brochure.classList.remove('step-1', 'step-2');
    
    if (state === 1) {
      brochure.classList.add('step-1');
      btnState.textContent = "Open Inside Flap";
    } else if (state === 2) {
      brochure.classList.add('step-2');
      btnState.textContent = "Close Brochure";
    } else {
      btnState.textContent = "Open Cover";
    }
  };

  const cycleState = () => {
    if (isAnimating) return;
    
    // If looking at the back, flip to front first, then open
    if (isFlipped) {
      executeFlip();
      isAnimating = true;
      setTimeout(() => {
        state = 1;
        updateState();
        isAnimating = false;
      }, 900); // Waits for the flip to finish
      return;
    }

    state = (state + 1) % 3; 
    updateState();
  };

  const executeFlip = () => {
    isFlipped = !isFlipped;
    if (isFlipped) {
      brochure.classList.add('is-flipped');
      btnFlip.textContent = "View Front";
    } else {
      brochure.classList.remove('is-flipped');
      btnFlip.textContent = "Flip to Back";
    }
  };

  const toggleFlip = () => {
    if (isAnimating) return;

    // If the brochure is open, fold it up FIRST, then flip it
    if (state !== 0) { 
      state = 0;
      updateState();
      isAnimating = true;
      
      setTimeout(() => {
        executeFlip();
        isAnimating = false;
      }, 800); // Waits for the folding to finish
    } else {
      executeFlip();
    }
  };

  btnState.addEventListener('click', cycleState);
  btnFlip.addEventListener('click', toggleFlip);

  // --- Mobile Swipe Mechanics ---
  let touchStartX = 0;
  let touchEndX = 0;

  const handleSwipe = () => {
    if (isAnimating) return;
    const swipeThreshold = 50; 
    const swipeDistance = touchEndX - touchStartX;

    if (swipeDistance > swipeThreshold) {
      if (state < 2 && !isFlipped) {
        state++;
        updateState();
      } else if (isFlipped) {
        toggleFlip();
      }
    } else if (swipeDistance < -swipeThreshold) {
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
