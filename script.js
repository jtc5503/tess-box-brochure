document.addEventListener('DOMContentLoaded', () => {
  const brochure = document.getElementById('brochure');
  const btnState = document.getElementById('toggle-state');
  const btnFlip = document.getElementById('toggle-flip');

  let state = 0; // 0: Closed, 1: Cover Open, 2: Fully Open
  let isFlipped = false;
  let isAnimating = false; 

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
      }, 900); 
      return;
    }

    if (state === 0) {
      state = 1;
      updateState();
    } else if (state === 1) {
      state = 2;
      updateState();
    } else if (state === 2) {
      // STAGGERED CLOSE: Right flap first, then left cover
      isAnimating = true;
      state = 1; 
      updateState();
      btnState.textContent = "Closing..."; // Optional feedback

      setTimeout(() => {
        state = 0; 
        updateState();
        isAnimating = false;
      }, 850); // Matches the 0.85s CSS transition
    }
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

    if (state === 2) {
      // If fully open, close right, close left, THEN flip
      isAnimating = true;
      state = 1;
      updateState();
      setTimeout(() => {
        state = 0;
        updateState();
        setTimeout(() => {
          executeFlip();
          isAnimating = false;
        }, 850);
      }, 850);
    } else if (state === 1) {
      // If only cover open, close it, THEN flip
      isAnimating = true;
      state = 0;
      updateState();
      setTimeout(() => {
        executeFlip();
        isAnimating = false;
      }, 850);
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
