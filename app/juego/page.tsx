'use client';
import { useState } from 'react';
import Juego from '@/components/Juego';
import Polipito from '@/components/Polipito';
import { NIVELES, TOTAL_SACADOS } from '@/lib/datos';
import { useSettings } from '@/lib/supabase';

function useNiveles() {
  const r = useSettings()?.result;
  return r !== null && r !== undefined && r > 0 ? [...NIVELES, r] : NIVELES;
}

export default function PaginaJuego() {
  const [jugando, setJugando] = useState(false);
  const niveles = useNiveles();
  const cuarto = niveles.length > NIVELES.length;

  return (
    <main className="contenedor">
      {!jugando ? (
        <>
          <section className="pila">
            <span className="chip">Juego</span>
            <h1>Operación Polipito</h1>
            <p className="mano">Vos sos el endoscopio. Ya sacaron {TOTAL_SACADOS}. Ahora te toca a vos.</p>
          </section>
          <section className="tarjeta">
            <h2>Cómo se juega</h2>
            <ol className="reglas">
              <li>Tocá la punta amarilla del endoscopio y arrastrala con el dedo.</li>
              <li>Si tocás la pared del colon, suena el zumbido y perdés una vida. Tenés tres.</li>
              <li>Para sacar un pólipo, dejá la punta encima hasta que se complete el círculo.</li>
              <li>Cada nivel es una colonoscopia real: 13, 7 y 12 pólipos.</li>
            </ol>
            <p className="aviso chico">
              {cuarto
                ? `Nivel 4 desbloqueado: ${niveles[3]} pólipos, como en la colonoscopia real.`
                : 'El nivel 4 se desbloquea el 9 de enero, con el resultado real.'}
            </p>
            <button className="boton rosa" onClick={() => setJugando(true)}>Empezar</button>
          </section>
          <div className="deco" aria-hidden="true">
            <Polipito size={64} humor="pícaro" />
            <Polipito size={44} humor="sorprendido" />
            <Polipito size={54} humor="feliz" />
          </div>
        </>
      ) : (
        <Juego niveles={niveles} onSalir={() => setJugando(false)} />
      )}
      <style>{`
        .reglas{margin:0;padding-left:22px;display:flex;flex-direction:column;gap:6px}
        .deco{display:flex;justify-content:center;gap:12px;align-items:flex-end}
      `}</style>
    </main>
  );
}
