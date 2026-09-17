import fs from 'fs/promises';
import path from 'path';
import { HubData } from '@/types';
import { INITIAL_HUB_DATA } from '@/data/defaultData';
import { Redis } from '@upstash/redis';

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'hub-data.json');
const REDIS_KEY = 'panelhub_data';

// Solo activamos Redis si las variables de entorno están presentes
const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;
const redis = (redisUrl && redisToken) ? new Redis({ url: redisUrl, token: redisToken }) : null;

export async function getHubData(): Promise<HubData> {
  // 1. Intentar cargar desde Redis (Producción en Vercel)
  if (redis) {
    try {
      const data = await redis.get<HubData>(REDIS_KEY);
      if (data && data.links && data.folders) {
        return data;
      }
      // Si la DB está vacía, devuelve los iniciales y lo guarda
      await redis.set(REDIS_KEY, INITIAL_HUB_DATA);
      return INITIAL_HUB_DATA;
    } catch (e) {
      console.error('Error leyendo de Redis:', e);
    }
  }

  // 2. Fallback a Local FS (Desarrollo local)
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    const content = await fs.readFile(DATA_FILE, 'utf-8');
    const parsed = JSON.parse(content) as HubData;
    return parsed;
  } catch {
    try {
      await fs.mkdir(DATA_DIR, { recursive: true });
      await fs.writeFile(DATA_FILE, JSON.stringify(INITIAL_HUB_DATA, null, 2), 'utf-8');
    } catch (e) {
      console.error('Error al crear archivo JSON inicial:', e);
    }
    return INITIAL_HUB_DATA;
  }
}

export async function saveHubData(data: HubData): Promise<boolean> {
  data.lastUpdated = new Date().toISOString();

  // 1. Guardar en Redis (Producción en Vercel)
  if (redis) {
    try {
      await redis.set(REDIS_KEY, data);
      return true;
    } catch (error) {
      console.error('Fallo al guardar en Redis:', error);
      return false;
    }
  }

  // 2. Fallback a Local FS (Desarrollo local)
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error('Fallo al guardar archivo JSON:', error);
    return false;
  }
}
