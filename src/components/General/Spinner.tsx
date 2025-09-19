// src/components/General/Spinner.tsx
import React from 'react';

type SpinnerProps = {
  size?: string;
  weight?: string;
  thickness?: 'thin' | 'normal' | 'bold';
  colorClass?: string;     // ej: "text-blue-600"
  label?: string;          // texto accesible/visible opcional
  className?: string;
  overlay?: boolean;       // position: absolute sobre el contenedor
  fullscreen?: boolean;    // position: fixed a pantalla completa
};

export default function Spinner({
  size = 'size-4',
  weight = '2',
  colorClass = 'text-black',
  label,
  className = '',
  overlay = false,
  fullscreen = false,
}: SpinnerProps) {

  const ring = (
    <span
      className={[
        'inline-block animate-spin rounded-full border-solid',
        'border-'+weight,
        // borde usa el color actual; un lado transparente para efecto de spinner
        'border-current border-r-transparent',
        colorClass,
        size,
        className,
      ].join(' ')}
    />
  );

  if (fullscreen || overlay) {
    const layerBase = 'inset-0 flex items-center justify-center bg-black/5';
    const layer = fullscreen
      ? `fixed ${layerBase} z-50`
      : `absolute ${layerBase}`;

    return (
      <div className={layer} role="status" aria-live="polite" aria-busy="true">
        <div className="flex items-center gap-3">
          {ring}
          {label && <span className="text-sm text-gray-700">{label}</span>}
          <span className="sr-only">{label ?? 'Cargando'}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-2" role="status" aria-live="polite" aria-busy="true">
      {ring}
      {label && <span className="text-sm text-gray-700">{label}</span>}
      <span className="sr-only">{label ?? 'Cargando'}</span>
    </div>
  );
}
