// Downloads an image URL as a file rather than navigating to it — needed
// because the QR image is served from a different origin than the frontend,
// where a plain `<a download>` would just open the image instead of saving it.
export async function downloadImageUrl(url: string, filename: string) {
  const res = await fetch(url);
  const blob = await res.blob();
  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = objectUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(objectUrl);
}

// QRCodeCanvas renders its modules edge-to-edge with no quiet zone, which
// looks fine on screen only because the surrounding wrapper div adds CSS
// padding — but that padding never makes it into the raw canvas pixels, so a
// direct download comes out with zero margin and many scanners then fail to
// recognize the QR at all. Redraw onto a bigger white canvas with real
// padding baked into the pixels before exporting.
export function downloadCanvas(
  canvas: HTMLCanvasElement,
  filename: string,
  paddingRatio = 0.1,
) {
  const padding = Math.round(canvas.width * paddingRatio);
  const padded = document.createElement("canvas");
  padded.width = canvas.width + padding * 2;
  padded.height = canvas.height + padding * 2;

  const ctx = padded.getContext("2d");
  if (!ctx) return;
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, padded.width, padded.height);
  ctx.drawImage(canvas, padding, padding);

  const link = document.createElement("a");
  link.href = padded.toDataURL("image/png");
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
}
