// AI DOCUMENT CHATBOT - FRONTEND

// HTML Elements
const fileInput = document.getElementById("fileInput");
const uploadBtn = document.getElementById("uploadBtn");
const uploadStatus = document.getElementById("uploadStatus");

const documentList = document.getElementById("documentList");

const questionInput = document.getElementById("questionInput");
const sendBtn = document.getElementById("sendBtn");

const chatMessages = document.getElementById("chatMessages");
const loadingIndicator = document.getElementById("loadingIndicator");

const newChatBtn = document.getElementById("newChatBtn");
const clearHistoryBtn = document.getElementById("clearHistoryBtn");
const themeBtn = document.getElementById("themeBtn");

// Chat history for current browser session
let chatHistory = [];

// DISPLAY CHAT MESSAGE

function addMessage(message, sender, sources = []) {

    const welcome = document.querySelector(".welcome-message");

    if (welcome) {
        welcome.remove();
    }

    const messageDiv = document.createElement("div");

    messageDiv.classList.add("message");

    if (sender === "user") {
        messageDiv.classList.add("user-message");
    } else {
        messageDiv.classList.add("bot-message");
    }

    const textElement = document.createElement("div");
    textElement.textContent = message;

    messageDiv.appendChild(textElement);

    // Display document sources
    if (sources.length > 0) {

        const sourceDiv = document.createElement("small");

        sourceDiv.textContent =
            "Sources: " + sources.join(", ");

        messageDiv.appendChild(sourceDiv);
    }

    chatMessages.appendChild(messageDiv);

    chatMessages.scrollTop = chatMessages.scrollHeight;

    chatHistory.push({
        message,
        sender,
        sources,
        time: new Date().toISOString()
    });
}

// UPLOAD DOCUMENTS

uploadBtn.addEventListener("click", async () => {

    const files = fileInput.files;

    if (!files || files.length === 0) {
        uploadStatus.textContent = "Please select a document first.";
        return;
    }

    const formData = new FormData();

    for (const file of files) {
        formData.append("documents", file);
    }

    uploadBtn.disabled = true;
    uploadStatus.textContent = "Uploading documents...";

    try {

        const response = await fetch("/api/upload", {
            method: "POST",
            body: formData
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Upload failed.");
        }

        uploadStatus.textContent =
            data.message || "Documents uploaded successfully.";

        updateDocumentList(data.documents || []);

        fileInput.value = "";

    } catch (error) {

        uploadStatus.textContent = error.message;

    } finally {

        uploadBtn.disabled = false;
    }
});

// UPDATE DOCUMENT LIST

function updateDocumentList(documents) {

    documentList.replaceChildren();

    if (documents.length === 0) {

        const emptyMessage = document.createElement("p");
        emptyMessage.className = "text-muted small";
        emptyMessage.textContent = "No documents uploaded yet.";

        documentList.appendChild(emptyMessage);
        return;
    }

    documents.forEach((document) => {

        const item = document.createElement("div");

        item.className = "small border-bottom py-2";
        item.textContent = "📄 " + document;

        documentList.appendChild(item);
    });
}

// SEND CHAT MESSAGE

async function sendMessage() {

    const question = questionInput.value.trim();

    if (!question) {
        return;
    }

    addMessage(question, "user");

    questionInput.value = "";

    loadingIndicator.hidden = false;
    sendBtn.disabled = true;

    try {

        const response = await fetch("/api/chat", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                question
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Unable to get answer.");
        }

        addMessage(
            data.answer || "No answer received.",
            "bot",
            data.sources || []
        );

    } catch (error) {

        addMessage(
            "Error: " + error.message,
            "bot"
        );

    } finally {

        loadingIndicator.hidden = true;
        sendBtn.disabled = false;
        questionInput.focus();
    }
}

// Send button
sendBtn.addEventListener("click", sendMessage);

// Press Enter to send
questionInput.addEventListener("keydown", (event) => {

    if (event.key === "Enter") {
        sendMessage();
    }
});

// CLEAR CHAT HISTORY

function clearChat() {

    chatMessages.replaceChildren();

    chatHistory = [];

    const welcome = document.createElement("div");

    welcome.className = "welcome-message text-center";

    const heading = document.createElement("h3");
    heading.textContent = "Welcome to AI Document Chatbot! 👋";

    const paragraph = document.createElement("p");
    paragraph.className = "text-muted";
    paragraph.textContent = "Upload a document to get started.";

    welcome.append(heading, paragraph);

    chatMessages.appendChild(welcome);
}

clearHistoryBtn.addEventListener("click", clearChat);

newChatBtn.addEventListener("click", clearChat);

// DARK / LIGHT MODE

themeBtn.addEventListener("click", () => {

    document.body.classList.toggle("dark-mode");


    const darkModeEnabled =
        document.body.classList.contains("dark-mode");

    themeBtn.textContent = darkModeEnabled
        ? "☀️ Light Theme"
        : "🌙 Toggle Theme";
});
