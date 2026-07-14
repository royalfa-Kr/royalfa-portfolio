import { Redis } from '@upstash/redis';
import { NextResponse } from 'next/server';

// Conexión automática usando las variables de entorno de Vercel/Local
const redis = Redis.fromEnv();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Creamos un ID único para la reseña basado en la fecha exacta
    const id = `review:${Date.now()}`;
    
    // Le agregamos la fecha de creación y un estado
    const review = { 
      ...body, 
      id, 
      createdAt: Date.now(), 
      // Todas las reseñas nuevas entran como "aprobadas" para mostrarse de inmediato, 
      // pero podrías poner "pendiente" en un futuro si quieres filtrarlas.
      status: 'approved' 
    };
    
    // Guardamos en Redis
    await redis.set(id, review);
    
    return NextResponse.json({ success: true, review });
  } catch (error) {
    console.error("Error guardando reseña:", error);
    return NextResponse.json({ error: 'Fallo al guardar la reseña' }, { status: 500 });
  }
}

export async function GET() {
  try {
    // Buscamos todas las llaves que empiecen con "review:"
    const keys = await redis.keys('review:*');
    
    if (keys.length === 0) {
      return NextResponse.json([]); // Si no hay reseñas, devolvemos un arreglo vacío
    }
    
    // Obtenemos los datos de cada llave encontrada
    const reviews = await Promise.all(keys.map(key => redis.get(key)));
    
    // Filtramos las válidas y las devolvemos
    return NextResponse.json(reviews.filter(r => r !== null));
  } catch (error) {
    console.error("Error leyendo reseñas:", error);
    return NextResponse.json({ error: 'Fallo al obtener las reseñas' }, { status: 500 });
  }
}