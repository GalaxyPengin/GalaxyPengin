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

  // ---- NEW: Progress bar elements ----
  const progressContainer = document.getElementById('progressContainer');
  const progressBar = document.getElementById('progressBar');

  let currentTrackId = null;
  let progressStart = 0;
  let trackDuration = 0;
  let lastUpdate = 0;
  let isPlaying = false;

  async function fetchNowPlaying() {
    try {
      const response = await fetch('https://gpwebflask.onrender.com/now-playing');
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status} - ${errorText}`);
      }
      const data = await response.json();

      if (data?.is_playing && data.item?.name && data.item.artists?.length) {
        isPlaying = true;
        if (data.item.id !== currentTrackId) {
          currentTrackId = data.item.id;
          embedContent.innerHTML = `
            <iframe src="https://open.spotify.com/embed/track/${currentTrackId}?theme=0"
                    width="100%" height="160" frameborder="0"
                    allowtransparency="true" allow="encrypted-media"></iframe>`;
        }
        // Update progress info
        progressStart = data.progress_ms || 0;
        trackDuration = data.duration_ms || 0;
        lastUpdate = data.timestamp || Date.now();
        progressContainer.style.display = "block";
      } else {
        isPlaying = false;
        currentTrackId = null;
        if (!embedContent.innerHTML.includes('GPVinyl.png')) {
          embedContent.innerHTML = vinyl;
        }
        progressContainer.style.display = "none";
        progressBar.style.width = "0%";
      }
    } catch (err) {
      isPlaying = false;
      currentTrackId = null;
      progressContainer.style.display = "none";
      progressBar.style.width = "0%";
      if (!embedContent.innerHTML.includes('GPVinyl.png')) {
        embedContent.innerHTML = vinyl;
      }
      console.error('Fetch error:', err);
    }
  }

  // New function to smoothly update progress bar width
  function updateProgressBar() {
    if (!isPlaying || trackDuration === 0) return;

    const elapsed = Date.now() - lastUpdate + progressStart;
    const percent = Math.min((elapsed / trackDuration) * 100, 100);
    progressBar.style.width = `${percent}%`;

    if (percent >= 100) {
      // Track finished, force a refresh next tick
      fetchNowPlaying();
    }
  }

  fetchNowPlaying();
  setInterval(fetchNowPlaying, 5000); // poll every 5s to catch new track changes
  setInterval(updateProgressBar, 500); // update progress bar every 0.5s

})();
