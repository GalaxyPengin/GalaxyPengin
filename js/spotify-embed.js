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
  setInterval(fetchNowPlaying, 5000);
})();