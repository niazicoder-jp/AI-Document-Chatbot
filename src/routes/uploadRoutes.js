import express from "express";
import multer from "multer";
import path from "path";

import { extractDocumentText } from "../services/documentService.js";

import {
    addDocumentToStore,
    getUploadedDocuments
} from "../services/vectorStore.js";

const router = express.Router();

// MULTER CONFIGURATION
const storage = multer.memoryStorage();

const upload = multer({
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024,
        files: 10
    },
    fileFilter: (req, file, callback) => {
        const allowedExtensions = [
            ".pdf",
            ".txt",
            ".docx",
            ".csv"
        ];

        const extension = path.extname(file.originalname).toLowerCase();

        if (allowedExtensions.includes(extension)) {
            callback(null, true);
        } else {
            callback(
                new Error("Only PDF, TXT, DOCX and CSV files are allowed.")
            );
        }
    }
});

// DOCUMENT UPLOAD ROUTE
router.post("/", upload.array("documents", 10), async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Please select at least one document."
            });
        }

        const successfulUploads = [];
        const failedUploads = [];

        for (const file of req.files) {
            try {
                const text = await extractDocumentText(file);

                const result = await addDocumentToStore(
                    text,
                    file.originalname
                );

                successfulUploads.push({
                    filename: result.filename,
                    chunks: result.chunks
                });

            } catch (error) {
                failedUploads.push({
                    filename: file.originalname,
                    error: error.message
                });
            }
        }

        if (successfulUploads.length === 0) {
            return res.status(400).json({
                success: false,
                message: "No documents could be processed.",
                errors: failedUploads
            });
        }

        return res.status(200).json({
            success: true,
            message: `${successfulUploads.length} document(s) uploaded successfully.`,
            uploaded: successfulUploads,
            errors: failedUploads,
            documents: getUploadedDocuments()
        });

    } catch (error) {
        console.error("Upload error:", error);

        return res.status(500).json({
            success: false,
            message: "An error occurred while uploading documents."
        });
    }
});

export default router;
