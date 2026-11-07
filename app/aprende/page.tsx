import Infografias from '@/components/Infografias';

export const metadata = { title: 'Polipitos 101 · Polipitos' };

export default function Aprende() {
  return (
    <main className="contenedor">
      <section className="pila">
        <span className="chip menta">Polipitos 101</span>
        <h1>Conocé al enemigo</h1>
        <p className="mano">Te explicamos quiénes somos, por qué nos sacan, y por qué está bien que lo hagan.</p>
      </section>

      <Infografias />

      <p className="aviso chico">
        Esta sección es informativa y no reemplaza la consulta con un médico. Cada caso es distinto: lo que te toca a
        vos, y cada cuánto, lo decide tu gastroenterólogo. Más información:{' '}
        <a href="https://www.argentina.gob.ar/salud/instituto-nacional-del-cancer" target="_blank" rel="noreferrer">
          Instituto Nacional del Cáncer
        </a>
        .
      </p>
    </main>
  );
}
