import { getStore } from '@netlify/blobs';

const wiltingHours = 0.1;
const wiltingDuration = wiltingHours * 60 * 60 * 1000;
const store = getStore('wwwegetables');

async function getLastWateredAt() {
  const saved = await store.get('watering', { type: 'json' });
  const lastWateredAt = Number(saved?.lastWateredAt) || Date.now();

  if (!saved?.lastWateredAt) {
    await store.setJSON('watering', { lastWateredAt });
  }

  return lastWateredAt;
}

function getSaturationPercent(lastWateredAt) {
  const elapsed = Date.now() - lastWateredAt;
  const progress = Math.min(elapsed / wiltingDuration, 1);

  return Math.round(Math.max(0, Math.min(100, (1 - progress) * 100)));
}

export default async function watering(request) {
  const lastWateredAt = await getLastWateredAt();

  if (request.method === 'GET') {
    return Response.json({ lastWateredAt });
  }

  if (request.method === 'POST') {
    if (getSaturationPercent(lastWateredAt) > 50) {
      return Response.json(
        {
          lastWateredAt,
          watered: false,
          message: 'thanks but i have just been watered'
        },
        { status: 429 }
      );
    }

    const nextWateredAt = Date.now();
    await store.setJSON('watering', { lastWateredAt: nextWateredAt });

    return Response.json({
      lastWateredAt: nextWateredAt,
      watered: true,
      message: 'thank u for caring for me'
    });
  }

  return new Response('method not allowed', {
    status: 405,
    headers: { allow: 'GET, POST' }
  });
}
