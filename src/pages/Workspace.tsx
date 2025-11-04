import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Menu, Trash2, Edit, Users, Check } from 'lucide-react';
import ReactFlow, {
    Background,
    Controls,
    useNodesState,
    useEdgesState,
    Handle,
    Position,
} from 'reactflow';
import 'reactflow/dist/style.css';
import type { Node, Edge, NodeTypes } from 'reactflow';
import type { WorkspaceNodeData } from '../components/WorkspaceNode.tsx';
import { testProjectData } from '../components/TestData.tsx';
import './Workspace.css';

// Custom node component for React Flow
const PhaseNodeComponent = ({
    data,
}: {
    data: WorkspaceNodeData & {
        onSelect: (id: string) => void;
        id: string;
        isSelected: boolean;
        completionPercentage?: number;
    };
}) => {
    const isComplete = data.completionPercentage === 100;

    return (
        <>
            <Handle type="target" position={Position.Top} />
            <div
                className={`px-6 py-4 rounded-lg border-2 transition-all cursor-pointer text-center min-w-64 ${data.isSelected
                    ? 'bg-white/10 shadow-lg text-white'
                    : isComplete
                        ? 'bg-white/10 shadow-lg text-white'
                        : 'bg-white/10 border-white/20 hover:border-accent-primary hover:shadow-lg hover:shadow-accent-primary/30 text-white'
                    }`}
                style={
                    data.isSelected
                        ? {
                            borderColor: 'hsl(220, 90%, 56%)',
                            boxShadow: '0 10px 25px -5px hsla(220, 90%, 56%, 0.5)',
                        }
                        : isComplete
                            ? {
                                borderColor: 'hsl(150, 60%, 45%)',
                                boxShadow: '0 10px 25px -5px hsla(150, 60%, 45%, 0.5)',
                            }
                            : undefined
                }
                onClick={() => data.onSelect(data.id)}
            >
                <div className="flex flex-col items-center">
                    <span className="text-xs font-semibold mb-1">
                        Phase {data.phase_no}
                    </span>
                    <h3 className="text-base font-bold">{data.phase_name}</h3>
                    <span className="text-xs mt-2 opacity-75">{data.completionPercentage ?? 0}%</span>
                </div>
            </div>
            <Handle type="source" position={Position.Bottom} />
        </>
    );
};

// Sample phase data
const phases: Record<string, WorkspaceNodeData & { id: string }> = testProjectData.phases;

export function Workspace() {
    const [selectedPhase, setSelectedPhase] = useState<string | null>(null);
    const [projectTitle, setProjectTitle] = useState(testProjectData.projectTitle);
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [projectIdea, setProjectIdea] = useState(testProjectData.projectIdea);
    const [isEditingIdea, setIsEditingIdea] = useState(false);
    const [teamMembers] = useState(testProjectData.teamMembers.map(member => member.name));
    const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(true);

    // Initialize todos with completion status
    const [todoStatuses, setTodoStatuses] = useState<Record<string, Record<string, boolean>>>(() => {
        const statuses: Record<string, Record<string, boolean>> = {};
        Object.entries(testProjectData.phases).forEach(([phaseId, phase]) => {
            statuses[phaseId] = {};
            phase.todos.forEach((todo) => {
                statuses[phaseId][todo.id] = todo.completed;
            });
        });
        return statuses;
    });

    // Toggle todo completion
    const toggleTodo = (phaseId: string, todoId: string) => {
        setTodoStatuses(prev => ({
            ...prev,
            [phaseId]: {
                ...prev[phaseId],
                [todoId]: !prev[phaseId][todoId],
            },
        }));
    };

    const initialNodes: Node[] = useMemo(
        () =>
            Object.values(phases).map((phase) => {
                // Calculate completion percentage for this phase
                const completedCount = phase.todos.filter(
                    (todo) => todoStatuses[phase.id]?.[todo.id] || false
                ).length;
                const phaseCompletionPercentage = phase.todos.length
                    ? Math.round((completedCount / phase.todos.length) * 100)
                    : 0;

                return {
                    id: phase.id,
                    data: {
                        ...phase,
                        onSelect: setSelectedPhase,
                        isSelected: selectedPhase === phase.id,
                        completionPercentage: phaseCompletionPercentage,
                    },
                    position: {
                        x: 150,
                        y: (phase.phase_no - 1) * 280,
                    },
                };
            }),
        [selectedPhase, todoStatuses]
    );

    const initialEdges: Edge[] = useMemo(() => {
        const edges: Edge[] = [];
        Object.values(phases).forEach((phase) => {
            if (phase.next_phase_id) {
                edges.push({
                    id: `${phase.id}-${phase.next_phase_id}`,
                    source: phase.id,
                    target: phase.next_phase_id,
                    sourceHandle: 'bottom',
                    targetHandle: 'top',
                    animated: true,
                    style: {
                        stroke: 'rgba(255, 255, 255, 0.6)',
                        strokeWidth: 2,
                    },
                });
            }
        });
        return edges;
    }, []);

    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, , onEdgesChange] = useEdgesState(initialEdges);

    // Sync node updates when todoStatuses or initialNodes change
    useEffect(() => {
        setNodes((currentNodes) =>
            currentNodes.map((node) => {
                const updatedNode = initialNodes.find((n) => n.id === node.id);
                return updatedNode ? updatedNode : node;
            })
        );
    }, [initialNodes, setNodes]);

    const selectedPhaseData = selectedPhase ? phases[selectedPhase] : null;
    const completedTodos = selectedPhaseData && selectedPhase
        ? selectedPhaseData.todos.filter(
            (todo) =>
                todoStatuses[selectedPhase]?.[todo.id] || false
        ).length
        : 0;
    const completionPercentage = selectedPhaseData?.todos.length
        ? Math.round((completedTodos / selectedPhaseData.todos.length) * 100)
        : 0;

    const nodeTypes: NodeTypes = useMemo(
        () => ({ default: PhaseNodeComponent }),
        []
    );

    return (
        <div className="pt-20 h-screen bg-dark text-text-primary flex flex-row">
            {/* Left Sidebar - Overlay */}
            <motion.div
                initial={{ x: -320, opacity: 1 }}
                animate={{
                    x: isLeftSidebarOpen ? 0 : -320,
                    opacity: isLeftSidebarOpen ? 1 : 0,
                }}
                transition={{ type: 'spring', damping: 25, stiffness: 120 }}
                className="fixed left-0 top-20 bottom-0 w-80 bg-panel border-r border-border-muted overflow-y-auto z-40 bg-black"
                style={{ pointerEvents: isLeftSidebarOpen ? 'auto' : 'none' }}
            >

                {/* Project Title Section */}
                <div className="p-6 border-b border-border-muted">
                    <div className="flex items-center gap-2">
                        {isEditingTitle ? (
                            <input
                                type="text"
                                value={projectTitle}
                                onChange={(e) => setProjectTitle(e.target.value)}
                                onBlur={() => setIsEditingTitle(false)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') setIsEditingTitle(false);
                                }}
                                autoFocus
                                className="text-lg font-bold text-dark bg-accent-primary border border-accent-primary rounded px-3 py-1 outline-none focus:border-accent-secondary flex-1"
                            />
                        ) : (
                            <h1
                                onClick={() => setIsEditingTitle(true)}
                                className="text-lg font-bold text-accent-primary cursor-pointer hover:text-accent-secondary transition-colors flex-1"
                            >
                                {projectTitle}
                            </h1>
                        )}
                        <button
                            onClick={() => setIsEditingTitle(!isEditingTitle)}
                            className="p-2 text-accent-primary hover:bg-surface rounded transition-colors flex-shrink-0"
                            title="Edit title"
                        >
                            <Edit className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setIsLeftSidebarOpen(false)}
                            className="p-2 text-text-muted hover:text-accent-primary hover:bg-surface rounded transition-colors flex-shrink-0"
                            title="Close sidebar"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Phases List */}
                <div className="px-6 py-4 border-b border-border-muted">
                    <h3 className="text-sm font-semibold text-text-primary mb-3">Phases</h3>
                    <div className="space-y-2">
                        {Object.values(phases).map((phase) => (
                            <div
                                key={phase.id}
                                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm ${selectedPhase === phase.id
                                    ? 'bg-accent-primary text-dark'
                                    : 'bg-surface text-text-primary hover:bg-surface/80'
                                    }`}
                            >
                                <button
                                    onClick={() => setSelectedPhase(phase.id)}
                                    className="flex-1 text-left"
                                >
                                    <div className="font-medium">Phase {phase.phase_no}</div>
                                    <div className="text-xs opacity-75">{phase.phase_name}</div>
                                </button>
                                <button
                                    onClick={() => {
                                        // Delete phase logic will be added here
                                        console.log('Delete phase:', phase.id);
                                    }}
                                    className="p-1 hover:bg-black/20 rounded transition-colors flex-shrink-0"
                                    title="Delete phase"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Team Members */}
                <div className="px-6 py-4 border-b border-border-muted">
                    <h3 className="text-sm font-semibold text-text-primary mb-3">Team Members</h3>
                    <div className="space-y-2">
                        {teamMembers.map((member, idx) => (
                            <div
                                key={idx}
                                className="flex items-center gap-3 p-2 rounded bg-surface/50"
                            >
                                <div className="w-8 h-8 rounded-full bg-accent-primary/30 flex items-center justify-center flex-shrink-0">
                                    <span className="text-xs font-semibold text-accent-primary">
                                        <Users className="w-4 h-4" />
                                    </span>
                                </div>
                                <span className="text-sm text-text-primary">{member}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Project Idea */}
                <div className="px-6 py-4 flex-1 flex flex-col">
                    <h3 className="text-sm font-semibold text-text-primary mb-3">Project Idea</h3>
                    {isEditingIdea ? (
                        <div className="flex-1 flex flex-col gap-2">
                            <textarea
                                value={projectIdea}
                                onChange={(e) => setProjectIdea(e.target.value)}
                                onBlur={() => setIsEditingIdea(false)}
                                autoFocus
                                className="flex-1 p-3 rounded bg-surface text-text-primary border border-border-muted outline-none focus:border-accent-primary resize-none text-sm"
                            />
                            <button
                                onClick={() => setIsEditingIdea(false)}
                                className="px-3 py-1 bg-accent-primary text-dark rounded text-sm font-medium hover:bg-accent-secondary transition-colors"
                            >
                                Done
                            </button>
                        </div>
                    ) : (
                        <div
                            onClick={() => setIsEditingIdea(true)}
                            className="p-3 rounded bg-surface/50 text-text-primary cursor-pointer hover:bg-surface transition-colors text-sm border border-border-muted"
                        >
                            {projectIdea}
                        </div>
                    )}
                </div>
            </motion.div>

            {/* Floating Menu Button */}
            {!isLeftSidebarOpen && (
                <motion.button
                    initial={{ x: -100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 120 }}
                    onClick={() => setIsLeftSidebarOpen(true)}
                    className="fixed left-6 top-32 z-50 p-3 bg-accent-primary text-dark rounded-full shadow-lg hover:bg-accent-secondary transition-colors"
                    title="Open sidebar"
                >
                    <Menu className="w-6 h-6" />
                </motion.button>
            )}

            {/* Workspace Container with Border */}
            <div className="flex-1 flex relative overflow-visible border-2 border-accent-primary m-4 rounded-lg bg-dark">
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    nodeTypes={nodeTypes}
                    defaultViewport={{ x: 0, y: 0, zoom: 1 }}
                    minZoom={0.5}
                    maxZoom={2}
                    fitView
                >
                    <Background color="rgba(255, 255, 255, 0.1)" gap={50} />
                    <Controls />
                </ReactFlow>

                {/* Sidebar - Overlays the workspace */}
                <motion.div
                    initial={{ x: 400, opacity: 0 }}
                    animate={{
                        x: selectedPhase ? 0 : 400,
                        opacity: selectedPhase ? 1 : 0,
                    }}
                    transition={{ type: 'spring', damping: 25, stiffness: 120 }}
                    className="absolute right-0 top-0 bottom-0 w-96 bg-panel bg-black border-l border-border-muted overflow-y-auto flex flex-col z-30"
                    style={{ pointerEvents: selectedPhase ? 'auto' : 'none' }}
                >
                    {selectedPhaseData && (
                        <>
                            {/* Header */}
                            <div className="p-6 border-b border-border-muted flex flex-col gap-4">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <div className="text-sm text-text-muted mb-2">
                                            Phase {selectedPhaseData.phase_no}
                                        </div>
                                        <h2 className="text-2xl font-bold text-text-primary">
                                            {selectedPhaseData.phase_name}
                                        </h2>
                                    </div>
                                    <button
                                        onClick={() => setSelectedPhase(null)}
                                        className="ml-4 p-2 hover:bg-surface rounded-lg transition-colors text-text-muted hover:text-text-primary flex-shrink-0"
                                        title="Close"
                                    >
                                        <svg
                                            className="w-5 h-5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M6 18L18 6M6 6l12 12"
                                            />
                                        </svg>
                                    </button>
                                </div>
                                <div className="w-full">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm text-text-primary">Progress</span>
                                        <span className="text-sm font-semibold text-accent-primary">
                                            {completionPercentage}%
                                        </span>
                                    </div>
                                    <div className="w-full h-3 bg-surface/50 rounded-full overflow-hidden border border-border-muted">
                                        <motion.div
                                            className="h-full bg-gradient-to-r from-green-400 via-green-400 to-green-900 w-full"
                                            initial={{ width: '0%' }}
                                            animate={{ width: `${completionPercentage}%` }}
                                            transition={{ duration: 0.8, ease: 'easeOut' }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Time Estimate */}
                            <div className="p-6 border-b border-border-muted">
                                <div className="text-sm text-text-muted mb-2">
                                    Estimated Time
                                </div>
                                <div className="text-3xl font-bold text-accent-primary">
                                    {`${Math.floor(selectedPhaseData.est_time_minutes / 60)}h ${selectedPhaseData.est_time_minutes % 60}m`}
                                </div>
                            </div>

                            {/* Tasks List */}
                            <div className="flex-1 p-6">
                                <h3 className="text-lg font-semibold text-text-primary mb-4">
                                    Tasks ({completedTodos}/{selectedPhaseData.todos.length})
                                </h3>
                                <div className="space-y-2">
                                    {selectedPhaseData.todos.length > 0 ? (
                                        selectedPhaseData.todos.map((todo) => {
                                            const isCompleted = selectedPhase ? (todoStatuses[selectedPhase]?.[todo.id] || false) : false;
                                            return (
                                                <div
                                                    key={todo.id}
                                                    className="flex items-start gap-3 p-3 rounded bg-surface hover:bg-surface/80 transition-colors cursor-pointer"
                                                    onClick={() => selectedPhase && toggleTodo(selectedPhase, todo.id)}
                                                >
                                                    <div className="mt-0.5 flex-shrink-0 w-4 h-4 rounded border-2 border-border-muted bg-surface flex items-center justify-center"
                                                        style={isCompleted ? { borderColor: 'hsl(150, 60%, 45%)', backgroundColor: 'hsl(150, 60%, 45%)' } : {}}
                                                    >
                                                        {isCompleted && (
                                                            <Check className="w-3 h-3 text-dark" strokeWidth={3} />
                                                        )}
                                                    </div>
                                                    <span
                                                        className={`text-sm flex-1 ${isCompleted
                                                            ? 'line-through text-text-muted/60'
                                                            : 'text-text-primary'
                                                            }`}
                                                    >
                                                        {todo.name}
                                                    </span>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <p className="text-text-muted/60 text-sm italic">
                                            No tasks added
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Navigation Buttons */}
                            <div className="p-6 border-t border-border-muted flex gap-3">
                                {selectedPhaseData.prev_phase_id && (
                                    <button
                                        onClick={() =>
                                            setSelectedPhase(selectedPhaseData.prev_phase_id!)
                                        }
                                        className="flex-1 px-4 py-2 bg-surface text-text-primary hover:bg-surface/80 border border-border-muted rounded transition-colors text-sm"
                                    >
                                        ← Previous
                                    </button>
                                )}
                                {selectedPhaseData.next_phase_id && (
                                    <button
                                        onClick={() =>
                                            setSelectedPhase(selectedPhaseData.next_phase_id!)
                                        }
                                        className="flex-1 px-4 py-2 bg-accent-primary text-dark hover:bg-accent-secondary border border-accent-primary rounded transition-colors text-sm font-medium"
                                    >
                                        Next →
                                    </button>
                                )}
                            </div>
                        </>
                    )}
                </motion.div>
            </div>
        </div>
    );
}