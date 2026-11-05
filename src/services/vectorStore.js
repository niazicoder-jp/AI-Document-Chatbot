import { OllamaEmbeddings } from "@langchain/ollama";
import { MemoryVectorStore } from "@langchain/classic/vectorstores/memory";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { Document } from "@langchain/core/documents";

// OLLAMA EMBEDDING MODEL

const embeddings = new OllamaEmbeddings({
    model: process.env.EMBEDDING_MODEL || "nomic-embed-text",
    baseUrl: process.env.OLLAMA_BASE_URL || "http://127.0.0.1:11434"
});

// TEXT SPLITTER

const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 150
});

// MEMORY VECTOR STORE

let vectorStore = null;
const uploadedDocuments = new Set();

// ADD DOCUMENT TO VECTOR STORE

export async function addDocumentToStore(text, filename) {

    if (!text || !text.trim()) {
        throw new Error("Document text is empty.");
    }

    // Split document into smaller chunks
    const chunks = await textSplitter.splitText(text);

    // Convert chunks into LangChain Documents
    const documents = chunks.map((chunk, index) => {

        return new Document({
            pageContent: chunk,
            metadata: {
                source: filename,
                chunk: index + 1
            }
        });
    });

    // Create vector store or add to existing store
    if (!vectorStore) {

        vectorStore = await MemoryVectorStore.fromDocuments(
            documents,
            embeddings
        );

    } else {

        await vectorStore.addDocuments(documents);
    }

    uploadedDocuments.add(filename);

    return {
        filename,
        chunks: documents.length
    };
}

// SEARCH RELEVANT DOCUMENT CONTENT

export async function searchDocuments(question) {

    if (!vectorStore) {
        throw new Error("Please upload a document first.");
    }

    if (!question || !question.trim()) {
        throw new Error("Please enter a question.");
    }

    const results = await vectorStore.similaritySearch(
        question,
        4
    );

    return results;
}

// GET UPLOADED DOCUMENT NAMES

export function getUploadedDocuments() {
    return Array.from(uploadedDocuments);
}