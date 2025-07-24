import type { WebSocket } from 'ws';
import { getFilteredPeople } from '../services/people.service';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

interface StartStreamMessage {
  type: 'start_stream';
  count: number;
  page: number;
  search?: string;
  hobbies?: string[];
  nationality?: string;
}

export async function handleMessage(message: StartStreamMessage, ws: WebSocket) {
  if (message.type !== 'start_stream') {
    console.warn('Unknown message type received:', message.type);
    return;
  }

  const { count, page, search, hobbies, nationality } = message;

  console.log(
    `Start stream request — Page: ${page}, Count: ${count}, ` +
    `Search: "${search}", Hobbies: ${hobbies?.join(', ')}, Nationality: ${nationality}`
  );

  try {
    const { data, total } = await getFilteredPeople({
      page,
      limit: count,
      search,
      hobbies,
      nationality,
    });

    if (data.length === 0) {
      ws.send(JSON.stringify({ type: 'no_more_data' }));
      console.log(`Sent no_more_data signal — No results on page ${page}.`);
      return;
    }

    console.log(`Streaming ${data.length} people (Page ${page} / Total Filtered: ${total})`);

    for (const person of data) {
      if (ws.readyState !== ws.OPEN) break;
      ws.send(JSON.stringify(person));
      await delay(100); // Reduced delay for better UX
    }

    console.log(`Done streaming people for page ${page}.`);

  } catch (error) {
    console.error('Error fetching filtered people:', error);
    ws.send(JSON.stringify({ error: 'Failed to fetch people' }));
  }
}
