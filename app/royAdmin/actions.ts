"use server";

import { Redis } from '@upstash/redis';
import { revalidatePath } from 'next/cache';

// Conexión automática recomendada por Upstash
const redis = Redis.fromEnv();

// Tipos de datos
export type ClassData = {
  isActive: boolean;
  date: string;
  time: string;
  subject: string;
  topic: string;
  modality: string;
};

// 1. Obtener la información actual
export async function getAdminData() {
  const currentClass = await redis.get<ClassData>('upcomingClass');
  
  if (!currentClass) {
    return {
      isActive: true,
      date: "Lunes",
      time: "12:00 PM",
      subject: "Lógica",
      topic: "Tablas de Verdad",
      modality: "En línea"
    };
  }
  
  return currentClass;
}

// 2. Guardar la nueva información
export async function saveAdminData(pin: string, data: ClassData) {
  if (pin !== process.env.ROY_ADMIN_PIN) {
    return { success: false, message: "PIN Incorrecto" };
  }

  try {
    await redis.set('upcomingClass', data);
    revalidatePath('/'); 
    return { success: true, message: "¡Actualizado con éxito!" };
  } catch (error) {
    return { success: false, message: "Error al guardar en la base de datos" };
  }
}