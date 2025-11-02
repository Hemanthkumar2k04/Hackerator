import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateIdea, uploadFile, getAvailableModels } from '../lib/api.ts';
import type { IntermediateIdea } from '../types/index.ts';

interface InputAreaProps {
    isLoading: boolean;
    onLoadingChange: (loading: boolean) => void;
    onComplete: () => void;
    showAuthPrompt?: boolean;
    selectedModel?: string;
    onModelChange?: (model: string) => void;
}

export function InputArea({
    isLoading,
    onLoadingChange,
    onComplete,
    showAuthPrompt = false,
    selectedModel: propSelectedModel,
    onModelChange,
}: InputAreaProps) {
    const [inputText, setInputText] = useState('');
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [idea, setIdea] = useState<IntermediateIdea | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [uploadedFileSummary, setUploadedFileSummary] = useState<string | null>(null);
    const [models, setModels] = useState<string[]>([]);
    const [internalSelectedModel, setInternalSelectedModel] = useState<string>('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Use external model if provided, otherwise use internal state
    const selectedModel = propSelectedModel || internalSelectedModel;

    const handleModelChange = (model: string) => {
        setInternalSelectedModel(model);
        if (onModelChange) {
            onModelChange(model);
        }
    };

    // Fetch available models on component mount
    useEffect(() => {
        const fetchModels = async () => {
            const availableModels = await getAvailableModels();
            setModels(availableModels);
            if (availableModels.length > 0) {
                const defaultModel = propSelectedModel || availableModels[0];
                setInternalSelectedModel(defaultModel);
                if (onModelChange && !propSelectedModel) {
                    onModelChange(defaultModel);
                }
            }
        };
        fetchModels();
    }, [propSelectedModel, onModelChange]);

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Validate file type and size
        const MAX_SIZE = 10 * 1024 * 1024; // 10MB
        const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];

        if (file.size > MAX_SIZE) {
            setError('File size must be less than 10MB');
            return;
        }

        if (!ALLOWED_TYPES.includes(file.type)) {
            setError('Only images (JPEG, PNG, WebP) and PDFs are supported');
            return;
        }

        setError(null);
        setUploadedFile(file);

        // Upload file (in real scenario, would get summary from server)
        try {
            onLoadingChange(true);
            const result = await uploadFile(file);
            setUploadedFileSummary(result.summary || `File: ${file.name}`);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'File upload failed');
            setUploadedFile(null);
        } finally {
            onLoadingChange(false);
        }
    };

    const handleGenerateIdea = async () => {
        if (!inputText.trim()) {
            setError('Please enter a description or idea');
            return;
        }

        setError(null);
        onLoadingChange(true);

        try {
            const result = await generateIdea({
                input_text: inputText,
                uploaded_file_summary: uploadedFileSummary || undefined,
                model: selectedModel || undefined,
            });
            setIdea(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to generate idea');
        } finally {
            onLoadingChange(false);
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
            handleGenerateIdea();
        }
    };

    if (idea) {
        return (
            <AnimatePresence mode="wait">
                <motion.div
                    key="idea-result"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="space-y-4"
                >
                    <div className="bg-surface-darker rounded-lg p-6 border border-border-subtle">
                        <h2 className="text-2xl font-bold text-accent-primary mb-4">Your Idea</h2>

                        <div className="space-y-4 mb-6">
                            <div>
                                <label className="block text-sm font-medium text-secondary mb-2">
                                    Idea Title
                                </label>
                                <input
                                    type="text"
                                    defaultValue={idea.idea_title}
                                    className="w-full bg-surface-dark border border-border-subtle rounded px-3 py-2 text-primary"
                                    readOnly
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-secondary mb-2">
                                    Summary
                                </label>
                                <textarea
                                    defaultValue={idea.idea_summary}
                                    rows={3}
                                    className="w-full bg-surface-dark border border-border-subtle rounded px-3 py-2 text-primary"
                                    readOnly
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-secondary mb-2">
                                    Unique Selling Point
                                </label>
                                <input
                                    type="text"
                                    defaultValue={idea.unique_selling_point}
                                    className="w-full bg-surface-dark border border-border-subtle rounded px-3 py-2 text-primary"
                                    readOnly
                                />
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setIdea(null)}
                                className="flex-1 px-4 py-2 bg-surface-dark border border-border-subtle text-primary rounded hover:border-accent-primary transition"
                            >
                                Back
                            </button>
                            <button
                                onClick={() => {
                                    // Store idea in local state or context
                                    onComplete();
                                }}
                                className="flex-1 px-4 py-2 bg-accent-primary text-surface-dark rounded font-semibold hover:bg-accent-secondary transition"
                            >
                                Proceed to Team Setup
                            </button>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>
        );
    }

    return (
        <motion.div
            key="input-form"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="space-y-4"
        >
            <div className="bg-surface-darker rounded-lg p-6 border border-border-subtle">
                <h2 className="text-xl font-bold text-primary mb-4">
                    {showAuthPrompt ? 'Share Your Hackathon Idea' : 'New Idea'}
                </h2>

                {/* Text input */}
                <div className="mb-4">
                    <textarea
                        value={inputText}
                        onChange={(e) => {
                            setInputText(e.target.value);
                            setError(null);
                        }}
                        onKeyDown={handleKeyDown}
                        placeholder="Paste a theme or describe your hackathon idea..."
                        className="w-full h-32 bg-surface-dark border border-border-subtle rounded px-4 py-3 text-primary placeholder-gray-500 focus:border-accent-primary focus:outline-none"
                        disabled={isLoading}
                    />
                    <p className="text-xs text-secondary mt-1">Shift+Enter for new line, Ctrl+Enter to submit</p>
                </div>

                {/* File upload */}
                <div className="mb-4">
                    <input
                        ref={fileInputRef}
                        type="file"
                        onChange={handleFileUpload}
                        accept="image/*,.pdf"
                        disabled={isLoading}
                        className="hidden"
                    />
                    {uploadedFile ? (
                        <div className="flex items-center gap-2 p-3 bg-surface-dark rounded border border-border-subtle">
                            <span className="text-accent-primary">✓</span>
                            <span className="text-sm text-primary flex-1">{uploadedFile.name}</span>
                            <button
                                onClick={() => {
                                    setUploadedFile(null);
                                    setUploadedFileSummary(null);
                                    if (fileInputRef.current) fileInputRef.current.value = '';
                                }}
                                className="text-xs text-secondary hover:text-primary"
                            >
                                Remove
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isLoading}
                            className="w-full p-3 bg-surface-dark border-2 border-dashed border-border-subtle rounded text-secondary hover:border-accent-primary transition disabled:opacity-50"
                        >
                            📎 Upload image or PDF (optional)
                        </button>
                    )}
                </div>

                {/* Error message */}
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-4 p-3 bg-red-500 bg-opacity-20 border border-red-500 rounded text-red-400 text-sm"
                    >
                        {error}
                    </motion.div>
                )}

                {/* Model selector */}
                {models.length > 0 && (
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-secondary mb-2">
                            AI Model
                        </label>
                        <select
                            value={selectedModel}
                            onChange={(e) => handleModelChange(e.target.value)}
                            disabled={isLoading}
                            className="w-full bg-surface-dark border border-border-subtle rounded px-3 py-2 text-primary focus:border-accent-primary focus:outline-none"
                        >
                            {models.map((model) => (
                                <option key={model} value={model}>
                                    {model}
                                </option>
                            ))}
                        </select>
                        <p className="text-xs text-secondary mt-1">Select the AI model to use for generation</p>
                    </div>
                )}

                {/* Submit button */}
                <motion.button
                    onClick={handleGenerateIdea}
                    disabled={isLoading || !inputText.trim()}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full px-4 py-3 bg-accent-primary text-surface-dark font-semibold rounded hover:bg-accent-secondary transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? (
                        <span className="flex items-center justify-center gap-2">
                            <span className="animate-spin">⏳</span> Generating...
                        </span>
                    ) : (
                        '✨ Generate Idea'
                    )}
                </motion.button>

                {showAuthPrompt && (
                    <p className="text-xs text-secondary text-center mt-4">
                        Sign in to save your ideas and collaborate with your team
                    </p>
                )}
            </div>
        </motion.div>
    );
}
