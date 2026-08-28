import { useEffect, useRef, useState } from "react";
import type { CardCodeFormat } from "@/lib/types";

/**
 * Renders a scannable barcode or QR entirely in the browser.
 * Value never leaves the device — no remote barcode APIs.
 */
export function CardBarcode({
  value,
  format,
  className,
}: {
  value: string;
  format: CardCodeFormat;
  className?: string;
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setError(null);
    setQrUrl(null);

    if (!value) {
      setError("Нет номера");
      return;
    }

    if (format === "QR") {
      void (async () => {
        try {
          const QRCode = (await import("qrcode")).default;
          const url = await QRCode.toDataURL(value, {
            errorCorrectionLevel: "M",
            margin: 2,
            width: 280,
            color: { dark: "#000000", light: "#ffffff" },
          });
          if (!cancelled) setQrUrl(url);
        } catch {
          if (!cancelled) setError("Не удалось нарисовать QR");
        }
      })();
      return () => {
        cancelled = true;
      };
    }

    void (async () => {
      try {
        const JsBarcode = (await import("jsbarcode")).default;
        if (!svgRef.current || cancelled) return;
        // clear previous
        while (svgRef.current.firstChild) {
          svgRef.current.removeChild(svgRef.current.firstChild);
        }
        JsBarcode(svgRef.current, value, {
          format,
          width: 2.4,
          height: 96,
          displayValue: true,
          fontSize: 16,
          margin: 8,
          background: "#ffffff",
          lineColor: "#000000",
        });
      } catch {
        if (!cancelled) {
          setError("Проверьте номер и формат кода");
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [value, format]);

  if (error) {
    return (
      <p className="px-4 text-center text-[14px] text-danger">{error}</p>
    );
  }

  if (format === "QR") {
    if (!qrUrl) {
      return <p className="text-center text-[13px] text-muted">…</p>;
    }
    return (
      <img
        src={qrUrl}
        alt=""
        className={className ?? "mx-auto size-[280px] rounded-lg bg-white"}
        // Prevent long-press save leaking into share sheets accidentally on some browsers
        draggable={false}
      />
    );
  }

  return (
    <svg
      ref={svgRef}
      className={className ?? "mx-auto max-w-full bg-white"}
      role="img"
      aria-label="Штрихкод карты"
    />
  );
}
