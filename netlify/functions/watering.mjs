import { getStore } from '@netlify/blobs';

const WILTING_DURATION = 10 * 60 * 1000; // 

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

function getSaturationPercent(lastWateredAt) {
  const elapsed = Date.now() - lastWateredAt;

  return Math.max(
    0,
    Math.round((1 - elapsed / WILTING_DURATION) * 100)
  );
}

function json(data, init = {}) {
  return Response.json(data, {
    headers: {
      'cache-control': 'no-store'
    },
    ...init
  });
}

export default async function watering(request) {
  const lastWateredAt = await getLastWateredAt();

  if (request.method === 'GET') {
    return json({ lastWateredAt });
  }

  if (request.method === 'POST') {
    const saturation = getSaturationPercent(lastWateredAt);

    if (saturation > 50) {
      return json(
        {
          lastWateredAt,
          watered: false,
          message: 'thanks but someone else has watered me recently'
        },
        { status: 429 }
      );
    }

    const nextWateredAt = Date.now();

    await store.setJSON('watering', {
      lastWateredAt: nextWateredAt
    });

    return json({
      lastWateredAt: nextWateredAt,
      watered: true,
      message: 'thank u for caring for me'
    });
  }

  return new Response('method not allowed', {
    status: 405,
    headers: {
      allow: 'GET, POST'
    }
  });
}