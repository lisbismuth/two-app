import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Button, Sheet } from "@/components/ui";
import {
  decodeBarcodeFromFile,
  mapZxingFormat,
  type ScanResult,
} from "@/lib/scan-barcode";

/**
 * Live camera scan (ZXing) + fallback: photo of the code.
 * All decoding stays on-device.
 */
export function BarcodeScannerSheet({
  open,
  onOpenChange,
  onDetected,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onDetected: (result: ScanResult) => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const controlsRef = useRef<{ stop: () => void } | null>(null);
  const [busy, setBusy] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const handled = useRef(false);
  const onDetectedRef = useRef(onDetected);
  onDetectedRef.current = onDetected;

  useEffect(() => {
    if (!open) {
      controlsRef.current?.stop();
      controlsRef.current = null;
      handled.current = false;
      setCameraError(null);
      return;
    }

    let cancelled = false;
    handled.current = false;

    void (async () => {
      try {
        const { BrowserMultiFormatReader } = await import("@zxing/browser");
        if (cancelled || !videoRef.current) return;
        const reader = new BrowserMultiFormatReader();
        const controls = await reader.decodeFromVideoDevice(
          undefined,
          videoRef.current,
          (result, _err, ctrl) => {
            if (!result || handled.current) return;
            const value = result.getText();
            if (!value) return;
            handled.current = true;
            const formatName =
              typeof result.getBarcodeFormat === "function"
                ? String(result.getBarcodeFormat())
                : "CODE_128";
            ctrl.stop();
            controlsRef.current = null;
            onDetectedRef.current({
              value,
              format: mapZxingFormat(formatName),
            });
            onOpenChange(false);
            toast("Код считан");
          },
        );
        if (cancelled) {
          controls.stop();
          return;
        }
        controlsRef.current = controls;
      } catch {
        if (!cancelled) {
          setCameraError("Камера недоступна — сфотографируйте код кнопкой ниже");
        }
      }
    })();

    return () => {
      cancelled = true;
      controlsRef.current?.stop();
      controlsRef.current = null;
    };
  }, [open, onOpenChange]);

  async function onPhoto(list: FileList | null) {
    const file = list?.[0];
    if (!file) return;
    setBusy(true);
    try {
      const result = await decodeBarcodeFromFile(file);
      onDetected(result);
      onOpenChange(false);
      toast("Код считан с фото");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Не распознали");
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange} title="Сканер кода">
      <div className="flex flex-col gap-4">
        <div className="aspect-[3/4] overflow-hidden rounded-card bg-ink">
          <video
            ref={videoRef}
            className="size-full object-cover"
            muted
            playsInline
            autoPlay
          />
        </div>
        <p className="text-center text-[13px] text-muted">
          Наведите на штрихкод или QR. Распознавание только на телефоне.
        </p>
        {cameraError ? (
          <p className="text-center text-[13px] text-danger">{cameraError}</p>
        ) : null}
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(e) => void onPhoto(e.target.files)}
        />
        <Button variant="secondary" disabled={busy} onClick={() => fileRef.current?.click()}>
          {busy ? "Распознаём…" : "Сфотографировать код"}
        </Button>
        <Button variant="ghost" onClick={() => onOpenChange(false)}>
          Отмена
        </Button>
      </div>
    </Sheet>
  );
}
