import { getStore } from '@netlify/blobs';

const WILTING_DURATION = 10 * 60 * 1000;

const store = getStore({
  name: 'wwwegetables',
  consistency: 'strong'
});

async function getLastWateredAt() {
  const saved = await store.get('watering', { type: 'json' });

  if (saved?.lastWateredAt) {
    return Number(saved.lastWateredAt);
  }

  const now = Date.now();

  await store.setJSON('watering', {
    lastWateredAt: now
  });

  return now;
}

function getSaturation(lastWateredAt) {
  const elapsed = Date.now() - lastWateredAt;

  return Math.max(
    0,
    Math.round((1 - elapsed / WILTING_DURATION) * 100)
  );
}

export const handler = async (event) => {
  const lastWateredAt = await getLastWateredAt();

  if (event.httpMethod === 'GET') {
    return {
      statusCode: 200,
      headers: { 'cache-control': 'no-store' },
      body: JSON.stringify({ lastWateredAt })
    };
  }

  if (event.httpMethod === 'POST') {
    const saturation = getSaturation(lastWateredAt);

    if (saturation > 70) {
      return {
        statusCode: 429,
        body: JSON.stringify({
          watered: false,
          lastWateredAt,
          message: 'someone else has just watered me :)'
        })
      };
    }

    const now = Date.now();

    await store.setJSON('watering', {
      lastWateredAt: now
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        watered: true,
        lastWateredAt: now,
        message: 'thank u for taking care of me!'
      })
    };
  }

  return {
    statusCode: 405,
    body: 'Method Not Allowed'
  };
};