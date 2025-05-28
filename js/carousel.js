(() => {
  const track = document.getElementById('carousel-track');
  const slides = track?.children || [];
  const prevBtn = document.getElementById('carousel-prev');
  const nextBtn = document.getElementById('carousel-next');
  let currentIndex = 0;

  function updateCarousel() {
    const slideWidth = slides[0]?.offsetWidth || 0;
    track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
  }

  function showNextSlide() {
    currentIndex = (currentIndex + 1) % slides.length;
    updateCarousel();
  }

  function showPrevSlide() {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    updateCarousel();
  }

  if (prevBtn && nextBtn && slides.length > 0) {
    prevBtn.addEventListener('click', showPrevSlide);
    nextBtn.addEventListener('click', showNextSlide);
    window.addEventListener('resize', updateCarousel);
    updateCarousel(); // init position
  }
})();