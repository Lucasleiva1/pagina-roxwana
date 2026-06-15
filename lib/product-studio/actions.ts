"use server";

export async function extractProductSheetPdfText(formData: FormData) {
  const file = formData.get("sheet_file");

  if (!(file instanceof File) || file.size === 0) {
    return { text: "", error: "No se recibio un PDF valido." };
  }

  if (file.size > 10 * 1024 * 1024) {
    return { text: "", error: "El PDF debe pesar 10 MB o menos." };
  }

  try {
    const { PDFParse } = await import("pdf-parse");
    const parser = new PDFParse({ data: Buffer.from(await file.arrayBuffer()) });
    const result = await parser.getText();
    await parser.destroy();

    return { text: result.text || "", error: null };
  } catch {
    return { text: "", error: "No se pudo extraer texto del PDF." };
  }
}
