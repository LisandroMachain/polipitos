type Humor = 'feliz' | 'sorprendido' | 'dormido' | 'pícaro';

/** La mascota: un pólipo redondito con cara. */
export default function Polipito({
  size = 80,
  humor = 'feliz',
  color = '#e0577b',
  className,
}: {
  size?: number;
  humor?: Humor;
  color?: string;
  className?: string;
}) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className={className} aria-hidden="true">
      <ellipse cx="50" cy="92" rx="30" ry="5" fill="#000" opacity=".08" />
      <path d="M50 12c22 0 38 18 38 42 0 22-14 36-38 36S12 76 12 54c0-24 16-42 38-42z" fill={color} />
      <ellipse cx="36" cy="32" rx="10" ry="6" fill="#fff" opacity=".35" transform="rotate(-25 36 32)" />
      <ellipse cx="28" cy="62" rx="7" ry="4.5" fill="#fff" opacity=".28" />
      <ellipse cx="72" cy="62" rx="7" ry="4.5" fill="#fff" opacity=".28" />
      {humor === 'dormido' ? (
        <g stroke="#4a2a3a" strokeWidth="3.5" strokeLinecap="round" fill="none">
          <path d="M33 52q5 4 10 0" />
          <path d="M57 52q5 4 10 0" />
          <path d="M45 66q5 3 10 0" />
        </g>
      ) : (
        <g fill="#4a2a3a">
          <ellipse cx="38" cy="51" rx="4.5" ry={humor === 'sorprendido' ? 6 : 5} />
          {humor === 'pícaro' ? (
            <path d="M57 51q5-5 10 0" stroke="#4a2a3a" strokeWidth="3.5" strokeLinecap="round" fill="none" />
          ) : (
            <ellipse cx="62" cy="51" rx="4.5" ry={humor === 'sorprendido' ? 6 : 5} />
          )}
          <circle cx="39.5" cy="49" r="1.5" fill="#fff" />
          {humor !== 'pícaro' && <circle cx="63.5" cy="49" r="1.5" fill="#fff" />}
          {humor === 'sorprendido' ? (
            <ellipse cx="50" cy="68" rx="5" ry="6" />
          ) : (
            <path d="M42 64q8 8 16 0" stroke="#4a2a3a" strokeWidth="3.5" strokeLinecap="round" fill="none" />
          )}
        </g>
      )}
    </svg>
  );
}
