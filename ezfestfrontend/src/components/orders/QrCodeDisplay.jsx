import React from 'react';

export default function QRCodeDisplay({ data, size = 200 }) {
  // Usar API pública gratuita para gerar QR code
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(data)}`;

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <img
        src={qrCodeUrl}
        alt="QR Code"
        className="border-2 border-gray-200 rounded-lg bg-white shadow-lg"
        style={{ width: size, height: size }}
      />
      
      {/* Código embaixo para referência */}
      <div className="mt-3 text-center">
        <p className="text-xs text-gray-500 font-mono bg-gray-100 px-2 py-1 rounded">
          {data}
        </p>
      </div>
    </div>
  );
}