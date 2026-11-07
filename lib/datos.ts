// Datos fijos de la historia. Lo que dice "(a completar)" lo cargan ustedes.

export const EXAMEN_4 = '2027-01-09T08:00:00-03:00';

export type Capitulo = {
  n: number;
  titulo: string;
  fecha: string;
  encontrados: number | null;
  sacados: number | null;
  quedaron: number | null;
  texto: string;
  foto?: { src: string; alt: string };
};

export const CAPITULOS: Capitulo[] = [
  {
    n: 1,
    titulo: 'La primera vez',
    fecha: '(a completar)',
    encontrados: 13,
    sacados: 6,
    quedaron: 7,
    texto:
      'Fue a hacerse un control y aparecieron trece. Le sacaron seis en el momento y los otros siete quedaron anotados para la próxima.',
  },
  {
    n: 2,
    titulo: 'La revancha',
    fecha: '(a completar)',
    encontrados: 7,
    sacados: 7,
    quedaron: 0,
    texto: 'Volvieron por los siete que quedaban. Se fueron todos. Marcador en cero.',
  },
  {
    n: 3,
    titulo: 'Volvieron',
    fecha: '(a completar)',
    encontrados: 12,
    sacados: 12,
    quedaron: 0,
    texto:
      'El control siguiente encontró doce nuevos. Salieron todos en la misma sesión. Otra vez en cero.',
    foto: { src: '/fotos/camilla.webp', alt: 'Ella en la camilla de la clínica, con suero, tapándose un ojo con la mano' },
  },
  {
    n: 4,
    titulo: 'Hagan sus apuestas',
    fecha: '9 de enero de 2027',
    encontrados: null,
    sacados: null,
    quedaron: null,
    texto: '¿Cuántos van a aparecer esta vez? La timba está abierta hasta que entre al estudio.',
    foto: { src: '/fotos/suero.webp', alt: 'Una mano con la vía del suero apoyada sobre la sábana' },
  },
];

export const TOTAL_SACADOS = CAPITULOS.reduce((a, c) => a + (c.sacados ?? 0), 0);

// Niveles del juego: uno por colonoscopia
export const NIVELES = [13, 7, 12];

export const DATOS_101 = [
  'La mayoría de los pólipos no son cáncer. Sacarlos a tiempo es justamente lo que evita que alguno llegue a serlo.',
  'Un pólipo adenomatoso puede tardar unos 10 años en volverse maligno. Por eso los controles funcionan.',
  'La colonoscopia es el único estudio que encuentra los pólipos y los saca en el mismo momento.',
  'En Argentina se recomienda empezar los controles a los 50 años, o antes si hay antecedentes en la familia.',
  'Sangre en la materia fecal, cambios en el ritmo intestinal o anemia sin explicación son motivo para consultar a cualquier edad.',
];
