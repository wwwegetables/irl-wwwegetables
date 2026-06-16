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

export default async function watering(request) {
  const lastWateredAt = await getLastWateredAt();

  if (request.method === 'GET') {
    return Response.json(
      { lastWateredAt },
      {
        headers: {
          'cache-control': 'no-store'
        }
      }
    );
  }

  if (request.method === 'POST') {
    const saturation = getSaturation(lastWateredAt);

    // only allow watering below 70%
    if (saturation > 70) {
      return Response.json(
        {
          watered: false,
          lastWateredAt,
          message: 'someone else has just watered me :)'
        },
        { status: 429 }
      );
    }

    const now = Date.now();

    await store.setJSON('watering', {
      lastWateredAt: now
    });

    return Response.json({
      watered: true,
      lastWateredAt: now,
      message: 'thank u for taking care of me!'
    });
  }

  return new Response('Method Not Allowed', {
    status: 405
  });
}