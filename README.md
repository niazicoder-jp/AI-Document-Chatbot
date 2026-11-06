# AI Document Chatbot

An AI-powered document chatbot that allows users to upload documents and ask questions based on their content using Retrieval-Augmented Generation (RAG).

## Features

Responsive user interface using Bootstrap 5.
Upload PDF, TXT, DOCX, and CSV documents.
Ask questions about uploaded documents.
AI-generated answers using Ollama.
RAG-based document retrieval using embeddings.
Source document identification.
Multiple document uploads.
Chat history during the active session.
Loading and error handling.
Dark/Light theme toggle.

## Technologies Used

Node.js
Express.js
HTML, CSS, JavaScript
Bootstrap 5
LangChain
Ollama
Llama 3.2 (1B)
Nomic Embed Text
Memory Vector Store
Multer

## Requirements

Node.js and npm
Git
Ollama

## Installation

1. Clone the repository:

```bash
git clone https://github.com/niazicoder-jp/AI-Document-Chatbot.git
```

2. Navigate to the project directory:

```bash
cd AI-Document-Chatbot
```

3. Install dependencies:

```bash
npm install
```

4. Install the required Ollama models:

```bash
ollama pull llama3.2:1b
ollama pull nomic-embed-text
```

5. Create a `.env` file in the project root:

```env
PORT=3000
OLLAMA_BASE_URL=http://127.0.0.1:11434
LLM_MODEL=llama3.2:1b
EMBEDDING_MODEL=nomic-embed-text
```

6. Start the application:

```bash
npm run dev
```

7. Open the application in your browser:

```text
http://localhost:3000
```

## Supported File Formats

- PDF
- TXT
- DOCX
- CSV

## How It Works

The application extracts text from uploaded documents, splits the content into smaller chunks, generates embeddings, and stores them in an in-memory vector store.

When a user asks a question, the application retrieves relevant document content and uses the Ollama language model to generate an answer based only on the retrieved context.

## Storage Note

The vector store operates in memory. Uploaded documents need to be uploaded again after restarting the server.

## Author

GitHub: https://github.com/niazicoder-jp