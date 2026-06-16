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
const site = document.documentElement; // or document.body
const WILTING_DURATION = 10 * 60 * 1000;
const WATERING_URL = '/.netlify/functions/watering';

let savedTime = null;
let hydrationDone = false;

function getSaturationPercent() {
  if (savedTime == null) return 100;
  const elapsed = Date.now() - savedTime;
  return Math.max(0, Math.round((1 - elapsed / WILTING_DURATION) * 100));
}

function updateWiltingColors() {
  if (!site || savedTime == null) return;
  site.style.filter = `saturate(${getSaturationPercent()}%)`;
}

async function loadWateringState() {
  try {
    const response = await fetch(WATERING_URL, { cache: 'no-store' });
    const data = await response.json();
    savedTime = Number(data.lastWateredAt) || Date.now();
    hydrationDone = true;
    updateWiltingColors();
  } catch (error) {
    console.warn('could not load watering state', error);
    savedTime = Date.now();
    hydrationDone = true;
    updateWiltingColors();
  }
}

window.addEventListener('DOMContentLoaded', () => {
  loadWateringState();
  window.setInterval(updateWiltingColors, 1000);
  window.setInterval(loadWateringState, 60 * 1000);
});


let backBtn = document.getElementById("arrow-left");
let nextBtn = document.getElementById("arrow-right");

const scrollContainer = document.querySelector(".stream");

nextBtn.addEventListener("click", () => {
  scrollContainer.scrollBy({
    left: 910,
    behavior: "smooth"
  });
});

backBtn.addEventListener("click", () => {
  scrollContainer.scrollBy({
    left: -910,
    behavior: "smooth"
  });
})
});