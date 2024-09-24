import { PDFDocument, PDFPage, rgb, StandardFonts } from 'pdf-lib';

export async function createCuponPDF(content: string, image?: string | Uint8Array | ArrayBuffer) {
    const pdfDoc = await PDFDocument.create()
    const pdfPage = await pdfDoc.addPage()
    pdfPage.setHeight(18 * content.split('\n').length + 50)

    if (image) {
        await addImage(image, pdfPage, pdfDoc)        
    }

    await addContent(content, pdfPage, pdfDoc)
    return await pdfDoc.save();
}

async function addContent(text: string, page: PDFPage, pdfDoc: PDFDocument) {
    const { height } = page.getSize();
    const font = await pdfDoc.embedFont(StandardFonts.CourierBold);

    page.drawText(text, {
        lineHeight: 15,
        y: height - 4 * 35,
        x: 0,
        size: 12,
        font,
        color: rgb(0, 0, 0)
    });
}

async function addImage(image: string | Uint8Array | ArrayBuffer, page: PDFPage, pdfDoc: PDFDocument) {
    const embeddedImage = await pdfDoc.embedPng(image);
    const imageDimension = embeddedImage.scale(0.25)
    const { height } = page.getSize();

    page.drawImage(embeddedImage, {
        y: height - 4 * 27,
        x: 90,
        width: imageDimension.width,
        height: imageDimension.height,
    });
}
