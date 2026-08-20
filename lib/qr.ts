import QRCode from "qrcode";

/**
 * Mengubah token string menjadi Data URL Base64 (image/png)
 */
export async function generateQRCodeDataURL(text: string): Promise<string> {
  try {
    return await QRCode.toDataURL(text, {
      errorCorrectionLevel: "M",
      margin: 2,
      width: 300,
      color: {
        dark: "#000000",
        light: "#ffffff",
      },
    });
  } catch (error) {
    throw new Error(`Gagal generate QR Code: ${(error as Error).message}`);
  }
}
