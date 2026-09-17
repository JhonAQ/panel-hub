import fs from 'fs/promises';
import path from 'path';
import { HubData } from '@/types';
import { INITIAL_HUB_DATA } from '@/data/defaultData';

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'hub-data.json');

export async function getHubData(): Promise<HubData> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    const content = await fs.readFile(DATA_FILE, 'utf-8');
    const parsed = JSON.parse(content) as HubData;
    return parsed;
  } catch {
    // If file doesn't exist or is invalid, write initial data
    try {
      await fs.mkdir(DATA_DIR, { recursive: true });
      await fs.writeFile(DATA_FILE, JSON.stringify(INITIAL_HUB_DATA, null, 2), 'utf-8');
    } catch (e) {
      console.error('Error writing initial hub data:', e);
    }
    return INITIAL_HUB_DATA;
  }
}

export async function saveHubData(data: HubData): Promise<boolean> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    data.lastUpdated = new Date().toISOString();
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error('Failed to persist hub data:', error);
    return false;
  }
}
