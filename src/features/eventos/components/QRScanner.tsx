import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Loader2, CameraOff, CheckCircle, Camera } from 'lucide-react';

interface QRScannerProps {
  onScanSuccess: (decodedText: string) => void;
}

export const QRScanner: React.FC<QRScannerProps> = ({ onScanSuccess }) => {
  const divId = 'qr-reader-camera';
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [status, setStatus] = useState<'idle' | 'starting' | 'running' | 'scanned' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const hasScanned = useRef(false);
  const [startTrigger, setStartTrigger] = useState(0);

  const onScanSuccessRef = useRef(onScanSuccess);
  useEffect(() => { onScanSuccessRef.current = onScanSuccess; }, [onScanSuccess]);

  const startScanning = () => {
    setStartTrigger((prev) => prev + 1);
    setStatus('starting');
    setErrorMsg('');
  };

  useEffect(() => {
    if (startTrigger === 0) return;

    let scanner: Html5Qrcode | null = null;
    let started = false;
    let cancelled = false;

    const start = async () => {
      try {
        scanner = new Html5Qrcode(divId, { verbose: false });
        scannerRef.current = scanner;

        await scanner.start(
          { facingMode: 'environment' },
          { fps: 15, qrbox: { width: 240, height: 240 }, aspectRatio: 1.0 },
          (decodedText: string) => {
            if (hasScanned.current) return;
            hasScanned.current = true;
            setStatus('scanned');
            onScanSuccessRef.current(decodedText);
            setTimeout(() => {
              hasScanned.current = false;
              setStatus('running');
            }, 2000);
          },
          () => {}
        );
        if (!cancelled) {
          started = true;
          setStatus('running');
        }
      } catch (err: any) {
        if (cancelled) return;
        const msg = err?.message || '';
        setErrorMsg(
          msg.toLowerCase().includes('permission')
            ? 'Permisos de cámara denegados. Habilítalos en la barra del navegador.'
            : msg || 'No se pudo iniciar la cámara.'
        );
        setStatus('error');
      }
    };

    start();

    return () => {
      cancelled = true;
      if (scanner) {
        const stopPromise = started ? scanner.stop() : Promise.resolve();
        stopPromise.finally(() => { scanner?.clear(); });
      }
    };
  }, [startTrigger]);

  return (
    <div className="w-full">
      <div className="relative rounded-2xl overflow-hidden bg-black border border-white/10 w-full" style={{ aspectRatio: '1 / 1' }}>
        <div
          id={divId}
          style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}
        />

        {status === 'idle' && (
          <button
            onClick={startScanning}
            className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-gray-950 hover:bg-gray-900 transition-colors"
          >
            <Camera size={28} className="text-indigo-400" />
            <span className="text-sm font-medium text-gray-300">Toca para escanear QR</span>
          </button>
        )}

        {(status === 'starting' || status === 'running' || status === 'scanned') && (
          <>
            {status === 'running' && (
              <>
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: `
                      linear-gradient(to right, rgba(0,0,0,0.55) 0%, transparent 25%, transparent 75%, rgba(0,0,0,0.55) 100%),
                      linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, transparent 25%, transparent 75%, rgba(0,0,0,0.55) 100%)
                    `,
                  }}
                />
                <div
                  className="absolute left-1/2 -translate-x-1/2 pointer-events-none"
                  style={{
                    top: 'calc(50% - 120px)',
                    width: '240px',
                    height: '2px',
                    background: 'linear-gradient(to right, transparent, #6366f1, transparent)',
                    animation: 'scanLine 2s linear infinite',
                  }}
                />
                {[
                  'top-[calc(50%-120px)] left-[calc(50%-120px)] border-t-2 border-l-2 rounded-tl-lg',
                  'top-[calc(50%-120px)] left-[calc(50%+88px)]  border-t-2 border-r-2 rounded-tr-lg',
                  'top-[calc(50%+88px)]  left-[calc(50%-120px)] border-b-2 border-l-2 rounded-bl-lg',
                  'top-[calc(50%+88px)]  left-[calc(50%+88px)]  border-b-2 border-r-2 rounded-br-lg',
                ].map((cls, i) => (
                  <div key={i} className={`absolute pointer-events-none w-8 h-8 border-indigo-400 ${cls}`} />
                ))}
                <div className="absolute bottom-4 left-0 right-0 flex justify-center pointer-events-none">
                  <span className="bg-black/60 text-indigo-300 text-xs px-3 py-1 rounded-full backdrop-blur-sm">
                    Apunta al código QR
                  </span>
                </div>
              </>
            )}

            {status === 'starting' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-950 gap-3 z-10">
                <Loader2 className="w-10 h-10 animate-spin text-indigo-400" />
                <p className="text-gray-400 text-sm">Iniciando cámara...</p>
              </div>
            )}

            {status === 'scanned' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-green-500/20 backdrop-blur-sm gap-3 z-10">
                <CheckCircle className="w-16 h-16 text-green-400" />
                <p className="text-green-300 font-semibold text-lg">¡Código detectado!</p>
              </div>
            )}

            {status === 'starting' && (
              <svg className="absolute inset-0 w-full h-full opacity-10 z-0" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#6366f1" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
            )}
          </>
        )}
      </div>

      {status === 'error' && (
        <div className="mt-3 flex items-start gap-3 bg-red-500/10 border border-red-500/20 rounded-xl p-4">
          <CameraOff className="text-red-400 shrink-0 mt-0.5" size={20} />
          <p className="text-red-400 text-sm">{errorMsg}</p>
        </div>
      )}

      <style>{`
        @keyframes scanLine {
          0%   { transform: translateX(-50%) translateY(0); }
          50%  { transform: translateX(-50%) translateY(238px); }
          100% { transform: translateX(-50%) translateY(0); }
        }
      `}</style>
    </div>
  );
};
