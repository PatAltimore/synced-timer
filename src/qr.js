import QRCode from "qrcode";

/**
 * Render a QR code into the given container element.
 * Returns the created <canvas>.
 */
export async function renderQR(container, url) {
  container.innerHTML = "";
  const canvas = document.createElement("canvas");
  await QRCode.toCanvas(canvas, url, { width: 256, margin: 2 });
  container.appendChild(canvas);
  return canvas;
}
