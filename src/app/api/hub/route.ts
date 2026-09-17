import { NextResponse } from 'next/server';
import { getHubData, saveHubData } from '@/lib/storage';
import { HubData } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const data = await getHubData();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al recuperar los datos del hub' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body: HubData = await request.json();
    
    if (!body || !Array.isArray(body.folders) || !Array.isArray(body.links)) {
      return NextResponse.json(
        { error: 'Estructura de datos inválida' },
        { status: 400 }
      );
    }

    const success = await saveHubData(body);
    if (!success) {
      return NextResponse.json(
        { error: 'Error al guardar los datos en el servidor' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, lastUpdated: new Date().toISOString() });
  } catch (error) {
    return NextResponse.json(
      { error: 'Error en el servidor al procesar la solicitud' },
      { status: 500 }
    );
  }
}
