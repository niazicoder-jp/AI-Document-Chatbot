import { PDFParse } from "pdf-parse";
import mammoth from "mammoth";
import { parse } from "csv-parse/sync";

// EXTRACT TEXT FROM PDF

async function extractPDF(buffer) {
    const parser = new PDFParse({ data: buffer });

    try {
        const result = await parser.getText();
        return result.text || "";
    } finally {
        await parser.destroy();
    }
}

// EXTRACT TEXT FROM DOCX

async function extractDOCX(buffer) {
    const result = await mammoth.extractRawText({ buffer });
    return result.value || "";
}

// EXTRACT TEXT FROM CSV

function extractCSV(buffer) {
    const csvText = buffer.toString("utf-8");

    const records = parse(csvText, {
        columns: true,
        skip_empty_lines: true,
        trim: true
    });

    return records
        .map((record, index) => {
            const values = Object.entries(record)
                .map(([key, value]) => `${key}: ${value}`)
                .join(", ");

            return `Row ${index + 1}: ${values}`;
        })
        .join("\n");
}

// EXTRACT TEXT FROM TXT

function extractTXT(buffer) {
    return buffer.toString("utf-8");
}

// MAIN DOCUMENT PROCESSOR

export async function extractDocumentText(file) {

    const extension = file.originalname
        .split(".")
        .pop()
        .toLowerCase();

    let text = "";

    switch (extension) {

        case "pdf":
            text = await extractPDF(file.buffer);
            break;

        case "docx":
            text = await extractDOCX(file.buffer);
            break;

        case "csv":
            text = extractCSV(file.buffer);
            break;

        case "txt":
            text = extractTXT(file.buffer);
            break;

        default:
            throw new Error(
                `Unsupported file format: .${extension}`
            );
    }

    if (!text || !text.trim()) {
        throw new Error(
            `No readable text found in ${file.originalname}`
        );
    }

    return text.trim();
}