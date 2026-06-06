document.addEventListener('DOMContentLoaded', () => {
  const brochure = document.getElementById('brochure');
  const btnOpen = document.getElementById('toggle-open');
  const btnFlip = document.getElementById('toggle-flip');

  let isOpen = false;
  let isFlipped = false;

  // Toggle Open/Closed
  const toggleOpen = () => {
    isOpen = !isOpen;
    if (isOpen) {
      brochure.classList.add('is-open');
      btnOpen.textContent = "Close Brochure";
      // Ensure we aren't looking at the back when we open it
      if (isFlipped) toggleFlip(); 
    } else {
      brochure.classList.remove('is-open');
      btnOpen.textContent = "Open Brochure";
    }
  };

  // Toggle Front/Back
  const toggleFlip = () => {
    isFlipped = !isFlipped;
    if (isFlipped) {
      brochure.classList.add('is-flipped');
      btnFlip.textContent = "View Front";
      // Close it if they try to look at the back while it's open
      if (isOpen) toggleOpen(); 
    } else {
      brochure.classList.remove('is-flipped');
      btnFlip.textContent = "Flip to Back";
    }
  };

  btnOpen.addEventListener('click', toggleOpen);
  btnFlip.addEventListener('click', toggleFlip);

  // --- Mobile Swipe Mechanics ---
  let touchStartX = 0;
  let touchEndX = 0;

  const handleSwipe = () => {
    const swipeThreshold = 50; // Minimum pixel distance to trigger swipe
    const swipeDistance = touchEndX - touchStartX;

    if (swipeDistance > swipeThreshold) {
      // Swipe Right -> Open it
      if (!isOpen && !isFlipped) toggleOpen();
      if (isFlipped) toggleFlip(); // unflip if looking at the back
    } else if (swipeDistance < -swipeThreshold) {
      // Swipe Left -> Close it, or flip to back
      if (isOpen) toggleOpen();
      else if (!isFlipped) toggleFlip();
    }
  };

  // Attach touch listeners to the container
  const container = document.querySelector('.survey-brochure-container');
  
  container.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  container.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });
});