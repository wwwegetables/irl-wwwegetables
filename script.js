
document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('header');
  const headerTrigger = document.querySelector('.wwwegetables');
  const stream = document.querySelector('.stream');
  const activeDinner = document.querySelector('.six');
  const waterButton = document.querySelector('.water');

  const mobileQuery = window.matchMedia('(max-width: 375px)');
  const expandedHeaderSpace = '500px';
  const collapsedHeaderSpace = '100px';


  // -------------------------
  // HEADER
  // -------------------------

  function getScrollThreshold() {
    return mobileQuery.matches ? 480 : 280;
  }

  function getScrollTop() {
    return (
      window.scrollY ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0
    );
  }

  function collapseHeader() {
    if (!header) return;

    header.classList.add('collapsed');

    document.documentElement.style.setProperty(
      '--header-space',
      collapsedHeaderSpace
    );
  }

  function expandHeader() {
    if (!header) return;

    header.classList.remove('collapsed');

    document.documentElement.style.setProperty(
      '--header-space',
      expandedHeaderSpace
    );
  }

  function updateHeader() {
    if (getScrollTop() > getScrollThreshold()) {
      collapseHeader();
    }
  }

  if (header && headerTrigger) {
    window.addEventListener(
      'scroll',
      updateHeader,
      { passive: true }
    );

    headerTrigger.addEventListener(
      'click',
      expandHeader
    );

    updateHeader();
  }


  // -------------------------
  // STREAM
  // -------------------------

  function centerActiveDinner() {
    if (!stream || !activeDinner) return;

    stream.scrollLeft = Math.max(
      0,
      activeDinner.offsetLeft -
        (stream.clientWidth - activeDinner.offsetWidth) / 2
    );
  }

  centerActiveDinner();

  window.addEventListener(
    'load',
    centerActiveDinner
  );

  window.addEventListener(
    'resize',
    centerActiveDinner
  );


  // -------------------------
  // WATERING / WILTING
  // -------------------------

  const site = document.documentElement;

  const WILTING_DURATION = 10 * 60 * 1000;

  const WATERING_URL =
    '/.netlify/functions/watering';


  // starts empty so no fake 100% flash
  let lastWateredAt = null;


  function getSaturationPercent() {

    if (!lastWateredAt) return 100;

    const elapsed =
      Date.now() - lastWateredAt;


    return Math.max(
      0,
      Math.round(
        (1 - elapsed / WILTING_DURATION) * 100
      )
    );
  }


  function updateWiltingColors() {

    if (!lastWateredAt) return;

    site.style.filter =
      `saturate(${getSaturationPercent()}%)`;
  }


  async function loadWateringState() {

    try {

      const response =
        await fetch(
          WATERING_URL,
          {
            cache: 'no-store'
          }
        );


      const data =
        await response.json();


      lastWateredAt =
        Number(data.lastWateredAt);


      updateWiltingColors();


      // reveal only after correct state is loaded
      document.documentElement.style.visibility =
        'visible';


    } catch (error) {

      console.warn(
        'could not load watering state',
        error
      );


      // don't leave page invisible if server fails
      document.documentElement.style.visibility =
        'visible';
    }
  }



  async function waterSite() {

    if (!waterButton) return;


    waterButton.disabled = true;


    try {

      const response =
        await fetch(
          WATERING_URL,
          {
            method: 'POST'
          }
        );


      const data =
        await response.json();


      alert(data.message);


      if (data.lastWateredAt) {

        lastWateredAt =
          Number(data.lastWateredAt);


        updateWiltingColors();
      }


    } catch (error) {

      console.warn(
        'could not water site',
        error
      );


      alert(
        'we are out of water :('
      );


    } finally {

      waterButton.disabled = false;
    }
  }



  if (waterButton) {

    waterButton.addEventListener(
      'click',
      waterSite
    );
  }



  // first load
  loadWateringState();


  // smooth local wilting
  setInterval(
    updateWiltingColors,
    1000
  );


  // sync with other visitors
  setInterval(
    loadWateringState,
    10000
  );



  // -------------------------
  // STREAM ARROWS
  // -------------------------

  const backBtn =
    document.getElementById(
      'arrow-left'
    );

  const nextBtn =
    document.getElementById(
      'arrow-right'
    );


  if (
    stream &&
    backBtn &&
    nextBtn
  ) {


    nextBtn.addEventListener(
      'click',
      () => {

        stream.scrollBy({
          left: 910,
          behavior: 'smooth'
        });

      }
    );


    backBtn.addEventListener(
      'click',
      () => {

        stream.scrollBy({
          left: -910,
          behavior: 'smooth'
        });

      }
    );

  }

});

