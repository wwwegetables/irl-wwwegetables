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
const site = document.querySelector('.site');
const wiltingHours = 0.1;
const wiltingDuration = wiltingHours * 60 * 60 * 1000;
const wateringUrl = '/.netlify/functions/watering';
let savedTime = Date.now();

function getSaturationPercent() {
  const elapsed = Date.now() - Number(savedTime);
  const progress = Math.min(elapsed / wiltingDuration, 1);
  return Math.round((1 - progress) * 100);
}

function updateWiltingColors() {
  if (!site) return;
  site.style.filter = `saturate(${getSaturationPercent()}%)`;
}

async function loadWateringState() {
  try {
    const response = await fetch(wateringUrl, { cache: 'no-store' });
    const data = await response.json();
    savedTime = Number(data.lastWateredAt) || Date.now();
  } catch (error) {
    console.warn('could not load watering state', error);
  }
  updateWiltingColors();
}

async function waterSite() {
  try {
    const response = await fetch(wateringUrl, { method: 'POST' });
    const data = await response.json();

    if (!response.ok) {
      window.alert(data.message || 'we are out of water :(');
      return;
    }

    savedTime = Number(data.lastWateredAt) || savedTime;
    updateWiltingColors();
    window.alert(data.message);
  } catch (error) {
    console.warn('could not water site', error);
    window.alert('we are out of water :(');
  }
}

  if (waterButton) {
    waterButton.addEventListener('click', waterSite);
  }

  loadWateringState();
  window.setInterval(loadWateringState, 60 * 1000);
  window.setInterval(updateWiltingColors, 60 * 1000);
});

/*force horizontal scroll till the end of the stream
const stream = document.querySelector('.stream');
let locked = false;

function atEnd(el) {
  return el.scrollLeft + el.clientWidth >= el.scrollWidth - 2;
}

function atStart(el) {
  return el.scrollLeft <= 2;
}

stream.addEventListener('mouseenter', () => {
  locked = true;
});

stream.addEventListener('mouseleave', () => {
  locked = false;
});

stream.addEventListener(
  'wheel',
  (e) => {
    const goingDown = e.deltaY > 0;
    const goingUp = e.deltaY < 0;

    const canScrollRight = !atEnd(stream);
    const canScrollLeft = !atStart(stream);

    if ((goingDown && canScrollRight) || (goingUp && canScrollLeft)) {
      e.preventDefault();
      stream.scrollLeft += e.deltaY;
      locked = true;
    } else {
      locked = false;
    }
  },
  {passive: false}
)*/


