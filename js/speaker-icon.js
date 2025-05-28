document.addEventListener('DOMContentLoaded', () => {
  const audio = document.getElementById('GalaxyPenginPronounce');
  const icon = document.querySelector('.speaker-icon');

	// Create audio context & source
  const audioCtx = new AudioContext();
  const source = audioCtx.createMediaElementSource(audio);

  // Create gain node to boost volume
  const gainNode = audioCtx.createGain();
  gainNode.gain.value = 0.5;

  // Connect nodes
  source.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  icon.addEventListener('click', () => {
    // Resume audio context if suspended (required by some browsers)
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    audio.play();
  });
});