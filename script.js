document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('header');
  const headerTrigger = document.querySelector('.wwwegetables');
  const stream = document.querySelector('.stream');
  const activeDinner = document.querySelector('.six'); // here goes the active dinner number
  const waterButton = document.querySelector('.water');

  const mobileQuery = window.matchMedia('(max-width: 375px)');
  const expandedHeaderSpace = '500px';
  const collapsedHeaderSpace = '100px';

  // header: collapses after scrolling, opens again on title click
  function getScrollThreshold() {
    return mobileQuery.matches ? 480 : 280;
  }

  function getScrollTop() {
    return window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
  }

  function collapseHeader() {
    if (!header) return;

    header.classList.add('collapsed');
    document.documentElement.style.setProperty('--header-space', collapsedHeaderSpace);
  }

  function expandHeader() {
    if (!header) return;

    header.classList.remove('collapsed');
    document.documentElement.style.setProperty('--header-space', expandedHeaderSpace);
  }

  function updateHeader() {
    if (getScrollTop() > getScrollThreshold()) {
      collapseHeader();
    }
  }

  if (header && headerTrigger) {
    window.addEventListener('scroll', updateHeader, { passive: true });
    document.addEventListener('scroll', updateHeader, { passive: true });
    document.body.addEventListener('scroll', updateHeader, { passive: true });
    headerTrigger.addEventListener('click', expandHeader);
    updateHeader();
  }

  // stream: opens centered around the active dinner
  function centerActiveDinner() {
    if (!stream || !activeDinner) return;

    stream.scrollLeft = Math.max(
      0,
      activeDinner.offsetLeft - (stream.clientWidth - activeDinner.offsetWidth) / 2
    );
  }

  centerActiveDinner();
  window.addEventListener('load', centerActiveDinner);
  window.addEventListener('resize', centerActiveDinner);

  // water: refreshes the wilting, gives color
  const wiltingHours = 0.5;
  const wiltingDuration = wiltingHours * 60 * 60 * 1000;
  const wateringUrl = '/.netlify/functions/watering';
  let savedTime = Date.now();

  function getSaturationPercent() {
    const elapsed = Date.now() - savedTime; // how long since watering
    const progress = Math.min(elapsed / wiltingDuration, 1); // fraction of wilting cycle

    return Math.round(Math.max(0, Math.min(100, (1 - progress) * 100)));
  }

  function updateWiltingColors() {
    document.documentElement.style.filter = `saturate(${getSaturationPercent()}%)`;
  }

  async function loadWateringState() {
    try {
      const response = await fetch(wateringUrl);
      const data = await response.json();

      savedTime = data.lastWateredAt || Date.now();
      updateWiltingColors();
    } catch (error) {
      console.warn('could not load watering state', error);
      updateWiltingColors();
    }
  }

  async function waterSite() {
    try {
      const response = await fetch(wateringUrl, { method: 'POST' });
      const data = await response.json();

      savedTime = data.lastWateredAt || savedTime;
      window.alert(data.message);
      updateWiltingColors();
    } catch (error) {
      console.warn('could not water site', error);
      window.alert('we are out of water :/');
    }
  }

  if (waterButton) {
    waterButton.addEventListener('click', waterSite);
  }

  loadWateringState();
  window.setInterval(loadWateringState, 60 * 1000);
  window.setInterval(updateWiltingColors, 60 * 1000);
});
