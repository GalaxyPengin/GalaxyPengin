async function fetchVisitorCount() {
  try {
    const response = await fetch('https://gpwebflask.onrender.com/api/visitors');
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    console.log("Visitor count fetched:", data.count);
    document.getElementById('visitor-count').textContent = data.count;
  } catch (err) {
    document.getElementById('visitor-count').textContent = 'Error loading count';
    console.error(err);
  }
}
fetchVisitorCount();
setInterval(fetchVisitorCount, 60000);
(() => {
  const embedContent = document.getElementById('embedContent');
  const vinyl = `
    <img src="images/important/GPVinyl.png" 
      alt="Vinyl image" 
      class="vinyl-spin">`;

  let currentTrackId = null;

  async function fetchNowPlaying() {
    try {
      const response = await fetch('https://gpwebflask.onrender.com/now-playing');
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status} - ${errorText}`);
      }
      const data = await response.json();
  
      if (data?.is_playing && data.item?.name && data.item.artists?.length) {
        if (data.item.id !== currentTrackId) {
          currentTrackId = data.item.id;
          embedContent.innerHTML = `
            <iframe src="https://open.spotify.com/embed/track/${currentTrackId}?theme=0"
                    width="100%" height="160" frameborder="0"
                    allowtransparency="true" allow="encrypted-media"></iframe>`;
        }
      } else {
        currentTrackId = null;
        if (!embedContent.innerHTML.includes('GPVinyl.png')) {
          embedContent.innerHTML = vinyl;
        }
      }
    } catch (err) {
      if (!embedContent.innerHTML.includes('GPVinyl.png')) {
        embedContent.innerHTML = vinyl;
      }
      console.error('Fetch error:', err);
    }
  }

  fetchNowPlaying();
  setInterval(fetchNowPlaying, 1000);
})();

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
