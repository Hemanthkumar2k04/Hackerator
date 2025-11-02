import { useState } from 'react';
import { motion } from 'framer-motion';
import { splitTasks } from '../lib/api.ts';
import type { IntermediateIdea, TeamInfo, TeamMember } from '../types/index.ts';

interface TeamSetupModalProps {
    idea: IntermediateIdea;
    model?: string;
    onComplete: (teamInfo: TeamInfo) => void;
    onCancel: () => void;
    isLoading?: boolean;
}

export function TeamSetupModal({
    idea,
    model,
    onComplete,
    onCancel,
    isLoading: externalIsLoading = false,
}: TeamSetupModalProps) {
    const [projectName, setProjectName] = useState(idea.idea_title);
    const [teamSize, setTeamSize] = useState(2);
    const [members, setMembers] = useState<TeamMember[]>([
        { name: '', role: '' },
        { name: '', role: '' },
    ]);
    const [aiSplitTasks, setAiSplitTasks] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    console.log('[TeamSetupModal] Received model:', model);

    const updateMember = (index: number, field: keyof TeamMember, value: string) => {
        const updated = [...members];
        updated[index][field] = value;
        setMembers(updated);
    };

    const addMember = () => {
        setMembers([...members, { name: '', role: '' }]);
        setTeamSize(teamSize + 1);
    };

    const removeMember = (index: number) => {
        if (members.length > 1) {
            setMembers(members.filter((_, i) => i !== index));
            setTeamSize(teamSize - 1);
        }
    };

    const handleSubmit = async () => {
        // Validate
        if (!projectName.trim()) {
            setError('Project name is required');
            return;
        }

        const filledMembers = members.filter((m) => m.name.trim());
        if (filledMembers.length === 0) {
            setError('At least one team member is required');
            return;
        }

        setError(null);
        setIsLoading(true);

        try {
            const teamInfo: TeamInfo = {
                project_name: projectName,
                team_size: filledMembers.length,
                members: filledMembers,
                ai_split_tasks: aiSplitTasks,
            };

            // Call LLM to split tasks if enabled
            if (aiSplitTasks) {
                console.log('[TeamSetupModal] Splitting tasks with model:', model || 'undefined (will use default)');
                await splitTasks({ idea, team_info: teamInfo, model: model || undefined });
            }

            onComplete(teamInfo);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to set up team');
        } finally {
            setIsLoading(false);
        }
    };

    const isProcessing = isLoading || externalIsLoading;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        >
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-surface-darker rounded-lg border border-border-subtle max-w-md w-full max-h-[90vh] overflow-y-auto"
            >
                <div className="p-6">
                    <h2 className="text-2xl font-bold text-primary mb-2">Team Setup</h2>
                    <p className="text-secondary text-sm mb-6">
                        Configure your team before starting the workspace
                    </p>

                    {/* Project Name */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-secondary mb-2">
                            Project Name
                        </label>
                        <input
                            type="text"
                            value={projectName}
                            onChange={(e) => setProjectName(e.target.value)}
                            className="w-full bg-surface-dark border border-border-subtle rounded px-3 py-2 text-primary"
                            disabled={isProcessing}
                        />
                    </div>

                    {/* Team Members */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-secondary mb-2">
                            Team Members ({members.filter((m) => m.name.trim()).length})
                        </label>
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                            {members.map((member, index) => (
                                <div key={index} className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="Name"
                                        value={member.name}
                                        onChange={(e) => updateMember(index, 'name', e.target.value)}
                                        className="flex-1 bg-surface-dark border border-border-subtle rounded px-2 py-1 text-sm text-primary"
                                        disabled={isProcessing}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Role"
                                        value={member.role}
                                        onChange={(e) => updateMember(index, 'role', e.target.value)}
                                        className="flex-1 bg-surface-dark border border-border-subtle rounded px-2 py-1 text-sm text-primary"
                                        disabled={isProcessing}
                                    />
                                    <button
                                        onClick={() => removeMember(index)}
                                        disabled={members.length === 1 || isProcessing}
                                        className="px-2 py-1 text-red-500 hover:text-red-400 disabled:opacity-50"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={addMember}
                            disabled={isProcessing}
                            className="mt-2 text-sm text-accent-primary hover:text-accent-secondary disabled:opacity-50"
                        >
                            + Add Member
                        </button>
                    </div>

                    {/* AI Task Split Toggle */}
                    <div className="mb-6 p-4 bg-surface-dark rounded border border-border-subtle">
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={aiSplitTasks}
                                onChange={(e) => setAiSplitTasks(e.target.checked)}
                                disabled={isProcessing}
                                className="w-4 h-4 rounded accent-primary"
                            />
                            <span className="text-sm font-medium text-primary">
                                Let Hackerator AI split tasks among team members
                            </span>
                        </label>
                        <p className="text-xs text-secondary mt-2">
                            {aiSplitTasks
                                ? 'AI will analyze your idea and distribute tasks optimally'
                                : 'You will manually assign tasks in the workspace'}
                        </p>
                    </div>

                    {/* Error */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-4 p-3 bg-red-500 bg-opacity-20 border border-red-500 rounded text-red-400 text-sm"
                        >
                            {error}
                        </motion.div>
                    )}

                    {/* Buttons */}
                    <div className="flex gap-3">
                        <button
                            onClick={onCancel}
                            disabled={isProcessing}
                            className="flex-1 px-4 py-2 bg-surface-dark border border-border-subtle text-primary rounded hover:border-accent-primary transition disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={isProcessing}
                            className="flex-1 px-4 py-2 bg-accent-primary text-surface-dark rounded font-semibold hover:bg-accent-secondary transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isProcessing ? (
                                <span className="flex items-center justify-center gap-2">
                                    <span className="animate-spin">⏳</span> Setting up...
                                </span>
                            ) : (
                                'Start Workspace'
                            )}
                        </button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}
