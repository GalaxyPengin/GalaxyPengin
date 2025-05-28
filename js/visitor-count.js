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