import Polipito from './Polipito';

/** Se muestra si faltan las variables de Supabase (por ejemplo, en un preview sin configurar). */
export default function SinConfig() {
  return (
    <main className="contenedor">
      <div className="tarjeta" style={{ alignItems: 'center', textAlign: 'center' }}>
        <Polipito size={90} humor="dormido" />
        <h2>Esta parte todavía está en preparación</h2>
        <p className="suave">Falta conectar la base de datos. Volvé en un ratito.</p>
      </div>
    </main>
  );
}
