import Polipito from '@/components/Polipito';

export const metadata = { title: 'Polipitos 101 · Polipitos' };

const BLOQUES = [
  {
    t: '¿Qué es un pólipo?',
    humor: 'feliz' as const,
    p: [
      'Es un bultito que crece en la pared interna del colon (el intestino grueso). Pueden ser chiquitos como una lenteja o más grandes, planos o con un "tallito".',
      'Son muy comunes: muchísimos adultos tienen alguno sin saberlo, porque casi nunca dan síntomas.',
    ],
  },
  {
    t: '¿Por qué se sacan?',
    humor: 'sorprendido' as const,
    p: [
      'La gran mayoría no es cáncer. Pero algunos tipos, sobre todo los adenomas y los pólipos serrados, pueden transformarse con los años. Ese proceso suele llevar alrededor de diez años.',
      'Si se sacan antes, ese pólipo ya no puede convertirse en nada. Por eso la colonoscopia no solo diagnostica: también previene.',
    ],
  },
  {
    t: '¿Cómo se sacan?',
    humor: 'pícaro' as const,
    p: [
      'Durante la colonoscopia, con un asa o una pinza que pasa por dentro del endoscopio. No se siente: se hace con sedación.',
      'Lo que se saca va a anatomía patológica, que dice de qué tipo era. Con eso el médico decide cada cuánto repetir el control.',
    ],
  },
  {
    t: '¿Cuándo hacerse una colonoscopia?',
    humor: 'feliz' as const,
    p: [
      'En Argentina, el Instituto Nacional del Cáncer recomienda controles desde los 50 años para personas sin factores de riesgo. Algunas sociedades médicas ya proponen empezar a los 45.',
      'Hay que empezar antes si hay familiares directos con cáncer colorrectal o pólipos, enfermedad inflamatoria intestinal, o si ya te encontraron pólipos (como acá).',
    ],
  },
];

const ALERTAS = [
  'Sangre en la materia fecal o materia fecal muy oscura',
  'Cambios en el ritmo intestinal que duran más de unas semanas',
  'Anemia sin una causa clara',
  'Dolor abdominal persistente o pérdida de peso sin explicación',
];

const MITOS = [
  ['"Duele."', 'Se hace con sedación. Lo más pesado es la preparación del día anterior.'],
  ['"Si no tengo síntomas, no necesito."', 'Los pólipos casi nunca dan síntomas. Justamente por eso se buscan.'],
  ['"Es solo para gente grande."', 'El riesgo aumenta con la edad, pero cada vez se ven más casos en menores de 50.'],
];

const PREPA = [
  'Dieta sin fibra y sin semillas los días previos, como indique tu médico.',
  'La solución evacuante entra mejor bien fría y tomada con sorbete.',
  'Tené el baño cerca, papel suave y una buena serie para mirar.',
  'Andá acompañado: después de la sedación no se puede manejar.',
];

export default function Aprende() {
  return (
    <main className="contenedor">
      <section className="pila">
        <span className="chip menta">Polipitos 101</span>
        <h1>Conocé al enemigo</h1>
        <p className="mano">Te explicamos quiénes somos, por qué nos sacan, y por qué está bien que lo hagan.</p>
      </section>

      <div className="bloques">
        {BLOQUES.map((b) => (
          <section key={b.t} className="tarjeta">
            <div className="cab">
              <Polipito size={48} humor={b.humor} color="#7cc6b0" />
              <h2>{b.t}</h2>
            </div>
            {b.p.map((x, i) => <p key={i}>{x}</p>)}
          </section>
        ))}
      </div>

      <section className="tarjeta alerta">
        <h2>Consultá sin esperar si tenés</h2>
        <ul>{ALERTAS.map((a) => <li key={a}>{a}</li>)}</ul>
        <p className="chico">A cualquier edad. No hace falta esperar a "la edad del control".</p>
      </section>

      <section className="pila">
        <h2>Mitos</h2>
        <div className="mitos">
          {MITOS.map(([m, r]) => (
            <div key={m} className="tarjeta">
              <p className="mano">{m}</p>
              <p>{r}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="tarjeta">
        <h2>Sobrevivir a la preparación</h2>
        <ul>{PREPA.map((a) => <li key={a}>{a}</li>)}</ul>
      </section>

      <p className="aviso chico">
        Esta página es informativa y no reemplaza la consulta con un médico. Cada caso es distinto: lo que te toca a
        vos, y cada cuánto, lo decide tu gastroenterólogo.
        Más información: <a href="https://www.argentina.gob.ar/salud/instituto-nacional-del-cancer" target="_blank" rel="noreferrer">Instituto Nacional del Cáncer</a>.
      </p>

      <style>{`
        .bloques{display:grid;grid-template-columns:repeat(2,1fr);gap:14px}
        @media (max-width:640px){.bloques{grid-template-columns:1fr}}
        .cab{display:flex;gap:10px;align-items:center}
        .cab h2{font-size:24px}
        .alerta{background:var(--rosa);color:var(--blanco)}
        ul{margin:0;padding-left:22px;display:flex;flex-direction:column;gap:6px}
        .mitos{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
        @media (max-width:720px){.mitos{grid-template-columns:1fr}}
        .mitos .mano{font-size:20px;color:var(--rosa-osc);text-decoration:line-through;text-decoration-thickness:2px}
      `}</style>
    </main>
  );
}
