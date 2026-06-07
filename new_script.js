document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('header');
  const trigger = document.querySelector('.wwwegetables');
  const stream = document.querySelector('.stream');
  const activeDinner = document.querySelector('.six');

  if (!header || !trigger) return;

  let threshold;
  const mobileQuery = window.matchMedia('(max-width: 375px)');

  function setThreshold() {
    if (mobileQuery.matches) {
      threshold = 480;
    } else {
      threshold = 280;
    }
  }

  function centerActiveDinner() {
    if (!stream || !activeDinner) return;

    stream.scrollLeft = Math.max(
      0,
      activeDinner.offsetLeft - (stream.clientWidth - activeDinner.offsetWidth) / 2
    );
  }

  function updateHeader() {
    setThreshold();
    if (window.scrollY > threshold) {
      header.classList.add('collapsed');
      document.documentElement.style.setProperty('--header-space', '100px');
    }
  }

  window.addEventListener('scroll', updateHeader, { passive: true });

  trigger.addEventListener('click', () => {
    header.classList.remove('collapsed');
    document.documentElement.style.setProperty('--header-space', '500px');
  });

  updateHeader();
  centerActiveDinner();
  window.addEventListener('load', centerActiveDinner);
  window.addEventListener('resize', centerActiveDinner);
});

// this site needs water

const wiltingHours = 1;
const dayLength = wiltingHours * 60 * 60 * 1000;
let savedTime = Number(localStorage.getItem('savedTime'));

if (!savedTime) {
  savedTime = Date.now();
  localStorage.setItem('savedTime', savedTime);
}

function wiltingColors() {
  const now = Date.now();
  const elapsed = now - savedTime;
  const progress = Math.min(elapsed / dayLength, 1);
  const satMultiplier = 1 - progress;
  const saturationPercent = Math.round(
    Math.max(0, Math.min(100, satMultiplier * 100))
  );

  document.body.style.filter = `saturate(${saturationPercent}%)`;
}

function getSaturationPercent() {
  const now = Date.now();
  const elapsed = now - savedTime;
  const progress = Math.min(elapsed / dayLength, 1);
  const satMultiplier = 1 - progress;
  return Math.round(Math.max(0, Math.min(100, satMultiplier * 100)));
}

function slugify(text) {
  return String(text)
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

function setSlugFromMessage(msg) {
  const slug = slugify(msg);
  history.replaceState(null, '', '/' + slug);
}

function clearSlug() {
  history.replaceState(
    null,
    '',
    window.location.pathname + window.location.search
  );
}

function waterSite() {
  const sat = getSaturationPercent();
  if (sat > 50) {
    setSlugFromMessage('thanks but i have just been watered');
    return;
  }

  savedTime = Date.now();
  localStorage.setItem('savedTime', savedTime);
  setSlugFromMessage('thank u for caring for me');
  wiltingColors();
}

const waterButton = document.querySelector('.water');
if (waterButton) {
  waterButton.addEventListener('click', waterSite);
}

wiltingColors();
setInterval(wiltingColors, 60 * 1000);