import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
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
import './Workspace.css';

// Custom node component for React Flow
const PhaseNodeComponent = ({
    data,
}: {
    data: WorkspaceNodeData & {
        onSelect: (id: string) => void;
        id: string;
        isSelected: boolean;
    };
}) => {
    return (
        <>
            <Handle type="target" position={Position.Top} />
            <div
                className={`px-6 py-4 rounded-lg border-2 transition-all cursor-pointer text-center min-w-64 ${data.isSelected
                    ? 'bg-accent-primary border-accent-secondary shadow-lg shadow-accent-primary/50 text-dark'
                    : 'bg-white/10 border-white/20 hover:border-accent-primary hover:shadow-lg hover:shadow-accent-primary/30 text-white'
                    }`}
                onClick={() => data.onSelect(data.id)}
            >
                <div className="flex flex-col items-center">
                    <span className="text-xs font-semibold mb-1">
                        Phase {data.phase_no}
                    </span>
                    <h3 className="text-base font-bold">{data.phase_name}</h3>
                </div>
            </div>
            <Handle type="source" position={Position.Bottom} />
        </>
    );
};

// Sample phase data
const phases: Record<string, WorkspaceNodeData & { id: string }> = {
    'phase-1': {
        id: 'phase-1',
        phase_no: 1,
        phase_name: 'Research & Planning',
        todos: [
            'Market research',
            '✓ Competitor analysis',
            'Architecture design',
        ],
        est_time_minutes: 480,
        prev_phase_id: undefined,
        next_phase_id: 'phase-2',
    },
    'phase-2': {
        id: 'phase-2',
        phase_no: 2,
        phase_name: 'Backend Development',
        todos: [
            'Setup environment',
            '✓ Database schema',
            'API endpoints',
            '✓ Authentication',
        ],
        est_time_minutes: 720,
        prev_phase_id: 'phase-1',
        next_phase_id: 'phase-3',
    },
    'phase-3': {
        id: 'phase-3',
        phase_no: 3,
        phase_name: 'Frontend Development',
        todos: ['UI design', 'Component library', '✓ Dashboard page'],
        est_time_minutes: 600,
        prev_phase_id: 'phase-2',
        next_phase_id: 'phase-4',
    },
    'phase-4': {
        id: 'phase-4',
        phase_no: 4,
        phase_name: 'Testing & Deployment',
        todos: [
            'Unit tests',
            'Integration tests',
            'Deployment setup',
        ],
        est_time_minutes: 360,
        prev_phase_id: 'phase-3',
        next_phase_id: undefined,
    },
};

export function Workspace() {
    const [selectedPhase, setSelectedPhase] = useState<string | null>(null);
    const [projectTitle, setProjectTitle] = useState('My Project');
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [projectIdea, setProjectIdea] = useState('This is where the original project idea goes. Click to edit and describe your vision for this project.');
    const [isEditingIdea, setIsEditingIdea] = useState(false);
    const [teamMembers] = useState(['Alice Johnson', 'Bob Smith', 'Carol Davis']);

    const initialNodes: Node[] = useMemo(
        () =>
            Object.values(phases).map((phase) => ({
                id: phase.id,
                data: {
                    ...phase,
                    onSelect: setSelectedPhase,
                    isSelected: selectedPhase === phase.id,
                },
                position: {
                    x: 150,
                    y: (phase.phase_no - 1) * 280,
                },
            })),
        [selectedPhase]
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

    const [nodes, , onNodesChange] = useNodesState(initialNodes);
    const [edges, , onEdgesChange] = useEdgesState(initialEdges);

    const selectedPhaseData = selectedPhase ? phases[selectedPhase] : null;
    const completedTodos =
        selectedPhaseData?.todos.filter(
            (todo: string) =>
                typeof todo === 'string' && todo.startsWith('✓')
        ).length || 0;
    const completionPercentage = selectedPhaseData?.todos.length
        ? Math.round((completedTodos / selectedPhaseData.todos.length) * 100)
        : 0;

    const nodeTypes: NodeTypes = useMemo(
        () => ({ default: PhaseNodeComponent }),
        []
    );

    return (
        <div className="pt-20 h-screen bg-dark text-text-primary flex flex-row">
            {/* Left Sidebar */}
            <div className="w-80 bg-panel border-r border-border-muted overflow-y-auto flex flex-col">
                {/* Project Title Section */}
                <div className="p-6 border-b border-border-muted">
                    <div className="flex items-center gap-2 mb-3">
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
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Phases List */}
                <div className="px-6 py-4 border-b border-border-muted">
                    <h3 className="text-sm font-semibold text-text-primary mb-3">Phases</h3>
                    <div className="space-y-2">
                        {Object.values(phases).map((phase) => (
                            <button
                                key={phase.id}
                                onClick={() => setSelectedPhase(phase.id)}
                                className={`w-full text-left px-3 py-2 rounded-lg transition-colors text-sm ${selectedPhase === phase.id
                                    ? 'bg-accent-primary text-dark font-medium'
                                    : 'bg-surface text-text-primary hover:bg-surface/80'
                                    }`}
                            >
                                <div className="font-medium">Phase {phase.phase_no}</div>
                                <div className="text-xs opacity-75">{phase.phase_name}</div>
                            </button>
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
                                        {member.charAt(0)}
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
            </div>

            {/* Workspace Container with Border */}
            <div className="flex-1 flex relative overflow-hidden border-2 border-accent-primary m-4 rounded-lg bg-dark">
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
                    className="absolute right-0 top-0 bottom-0 w-96 bg-panel border-l border-border-muted overflow-y-auto flex flex-col h-auto"
                    style={{ pointerEvents: selectedPhase ? 'auto' : 'none' }}
                >
                    {selectedPhaseData && (
                        <>
                            {/* Header */}
                            <div className="p-6 border-b border-border-muted flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="text-sm text-text-muted mb-2">
                                        Phase {selectedPhaseData.phase_no}
                                    </div>
                                    <h2 className="text-2xl font-bold text-text-primary mb-4">
                                        {selectedPhaseData.phase_name}
                                    </h2>
                                    <div className="flex items-center gap-4">
                                        <div className="flex-1">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-xs text-text-muted">Progress</span>
                                                <span className="text-sm font-semibold text-accent-primary">
                                                    {completionPercentage}%
                                                </span>
                                            </div>
                                            <div className="w-full h-2 bg-surface rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-gradient-to-r from-accent-primary to-accent-secondary rounded-full transition-all duration-300"
                                                    style={{ width: `${completionPercentage}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedPhase(null)}
                                    className="ml-4 p-2 hover:bg-amber-800 rounded-lg transition-colors text-amber-100 hover:text-amber-50 flex-shrink-0"
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

                            {/* Time Estimate */}
                            <div className="p-6 border-b border-amber-700">
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
                                        selectedPhaseData.todos.map((todo: string, idx: number) => (
                                            <div
                                                key={idx}
                                                className="flex items-start gap-3 p-3 rounded bg-surface hover:bg-surface/80 transition-colors cursor-pointer"
                                            >
                                                <span className="mt-0.5 flex-shrink-0">
                                                    {typeof todo === 'string' && todo.startsWith('✓') ? (
                                                        <span className="text-accent-primary text-lg">✓</span>
                                                    ) : (
                                                        <span className="text-border-muted text-lg">◦</span>
                                                    )}
                                                </span>
                                                <span
                                                    className={`text-sm flex-1 ${typeof todo === 'string' &&
                                                        todo.startsWith('✓')
                                                        ? 'line-through text-text-muted/60'
                                                        : 'text-text-primary'
                                                        }`}
                                                >
                                                    {typeof todo === 'string'
                                                        ? todo.replace(/^✓\s*/, '')
                                                        : String(todo)}
                                                </span>
                                            </div>
                                        ))
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