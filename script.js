document.addEventListener('DOMContentLoaded', () => {
 
  const stream = document.querySelector('.stream');
  const activeDinner = document.querySelector('.active');
  const waterButton = document.querySelector('.water');


  // -------------------------
  // stream
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
  // water/wilting
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
  // header arrow
  // -------------------------
const headerBtn = document.getElementById('arrow-header');
const header = document.getElementById('header');

header.classList.toggle(
  'collapsed',
  localStorage.getItem('headerCollapsed') === 'true'
);

headerBtn.addEventListener('click', () => {
  header.classList.toggle('collapsed');

  localStorage.setItem(
    'headerCollapsed',
    header.classList.contains('collapsed')
  );
});



  // -------------------------
  // dinners arrows
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

// -------------------------
// seed generation
// -------------------------


const seedAmount = Math.floor(Math.random() * 2) + 1; 
const container = document.getElementById("svg-container");

for (let i = 0; i < seedAmount; i++) {
  const seedCount = Math.floor(Math.random() * 9) + 1;
  const seed = `assets/seeds/seed_${seedCount}.svg`;

  fetch(seed)
    .then(res => res.text())
    .then(svg => {
      const wrapper = document.createElement("div");
      wrapper.classList.add("seed");

      // random values
      const rotation = Math.random() * 360; // degrees
      const scale = 2 + Math.random() * 1.6; // 0.4 - 2.0
      const margin = 15; // vw/vh
      const x = margin + Math.random() * (100 - margin * 2);
      const y = margin + Math.random() * (100 - margin * 2);

      const size = 200 + Math.random() * 400;

      wrapper.style.left = `${x}vw`;
      wrapper.style.top = `${y}vh`;
      wrapper.style.transform = `
        translate(-50%, -50%)
        rotate(${rotation}deg)
        scale(${scale})
      `;

      wrapper.innerHTML = svg;
      container.appendChild(wrapper);
    });
}

// -------------------------
// compost
// -------------------------

const compostBtn = document.querySelector('.compost');
const compost = document.getElementById('compost');

compost.classList.toggle(
  'visible',
  localStorage.getItem('compostVisible') === 'true'
);

compostBtn.addEventListener('click', () => {
  compost.classList.toggle('visible');
  window.scrollBy(0, 200);

  localStorage.setItem(
    'compostVisible',
    compost.classList.contains('visible')
  );
});