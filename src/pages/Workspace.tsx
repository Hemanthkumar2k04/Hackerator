import { useState, useCallback, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import ReactFlow, {
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  type Node,
  type Connection,
} from 'reactflow';
import 'reactflow/dist/style.css';
import type { IntermediateIdea, TaskDistribution, TeamInfo } from '../types/index.ts';

interface WorkspaceProps {
  idea: IntermediateIdea;
  teamInfo: TeamInfo;
  taskDistribution?: TaskDistribution;
}

interface TaskData {
  title: string;
  description: string;
  phase: string;
  estimateMinutes: number;
  assignedTo?: string;
  status: 'pending' | 'in-progress' | 'completed';
}

type TaskNode = Node<TaskData>;

export function WorkspacePage({
  idea,
  teamInfo,
  taskDistribution,
}: WorkspaceProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState<TaskData>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [editingNodeId, setEditingNodeId] = useState<string | null>(null);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  // Initialize nodes from task distribution
  useEffect(() => {
    if (taskDistribution?.phases) {
      const newNodes: TaskNode[] = [];
      let yOffset = 0;

      taskDistribution.phases.forEach((phase, phaseIdx) => {
        const xOffset = phaseIdx * 300;

        phase.tasks.forEach((task, taskIdx) => {
          const nodeId = `${task.task_id || `task-${phaseIdx}-${taskIdx}`}`;
          newNodes.push({
            id: nodeId,
            data: {
              title: task.title || 'Untitled Task',
              description: task.description || '',
              phase: phase.phase_name || `Phase ${phaseIdx}`,
              estimateMinutes: task.estimate_minutes || 30,
              assignedTo: task.assigned_to || undefined,
              status: 'pending',
            },
            position: { x: xOffset, y: yOffset + taskIdx * 200 },
            style: {
              background: '#1a1a2e',
              border: '2px solid #0f3460',
              borderRadius: '8px',
              padding: '12px',
              color: '#eee',
              minWidth: '250px',
            },
          } as TaskNode);
        });

        yOffset += phase.tasks.length * 200;
      });

      setNodes(newNodes);
    }
  }, [taskDistribution, setNodes]);

  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) => addEdge(connection, eds));
    },
    [setEdges]
  );

  const handleNodeClick = useCallback(
    (_event: React.MouseEvent, node: Node<TaskData>) => {
      setEditingNodeId(node.id);
    },
    []
  );

  const handleAddNode = () => {
    const newNodeId = `node-${Date.now()}`;
    const newNode: TaskNode = {
      id: newNodeId,
      data: {
        title: 'New Task',
        description: 'Add description',
        phase: 'Custom',
        estimateMinutes: 30,
        status: 'pending',
      },
      position: {
        x: Math.random() * 500,
        y: Math.random() * 500,
      },
      style: {
        background: '#1a1a2e',
        border: '2px solid #16c784',
        borderRadius: '8px',
        padding: '12px',
        color: '#eee',
        minWidth: '250px',
      },
    };
    setNodes((nds) => [...nds, newNode]);
  };

  const handleDeleteNode = (nodeId: string) => {
    setNodes((nds) => nds.filter((n) => n.id !== nodeId));
    setEditingNodeId(null);
  };

  const handleUpdateNode = (nodeId: string, updates: Partial<TaskData>) => {
    setNodes((nds) =>
      nds.map((n) =>
        n.id === nodeId
          ? {
              ...n,
              data: { ...n.data, ...updates },
            }
          : n
      )
    );
  };

  const editingNode = nodes.find((n) => n.id === editingNodeId) as TaskNode | undefined;

  return (
    <div className="min-h-screen bg-surface-dark pt-20">
      <div className="flex h-screen flex-col">
        {/* Header */}
        <div className="border-b border-border-subtle bg-surface-darker px-6 py-4">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-primary mb-2">{idea.idea_title}</h1>
            <p className="text-secondary">
              Team: {teamInfo.members.map((m) => m.name).join(', ')}
            </p>
          </div>
        </div>

        {/* Main Workspace */}
        <div className="flex-1 flex gap-6 p-6 overflow-hidden">
          {/* React Flow Canvas */}
          <div className="flex-1 rounded-lg border border-border-subtle overflow-hidden bg-surface-darker">
            <div ref={reactFlowWrapper} style={{ width: '100%', height: '100%' }}>
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onNodeClick={handleNodeClick}
              >
                <Background color="#0f3460" gap={16} />
                <Controls />
              </ReactFlow>
            </div>
          </div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-80 flex flex-col gap-4"
          >
            {/* Add Node Button */}
            <button
              onClick={handleAddNode}
              className="w-full px-4 py-3 bg-accent-primary text-surface-dark rounded-lg font-semibold hover:bg-accent-secondary transition"
            >
              + Add Task
            </button>

            {/* Node Details */}
            {editingNode ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex-1 bg-surface-darker rounded-lg border border-border-subtle p-4 space-y-4 overflow-y-auto"
              >
                <div>
                  <label className="block text-sm font-medium text-secondary mb-2">
                    Task Title
                  </label>
                  <input
                    type="text"
                    value={editingNode.data.title}
                    onChange={(e) => handleUpdateNode(editingNode.id, { title: e.target.value })}
                    className="w-full bg-surface-dark border border-border-subtle rounded px-3 py-2 text-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary mb-2">
                    Description
                  </label>
                  <textarea
                    value={editingNode.data.description}
                    onChange={(e) => handleUpdateNode(editingNode.id, { description: e.target.value })}
                    className="w-full bg-surface-dark border border-border-subtle rounded px-3 py-2 text-primary text-sm resize-none"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-secondary mb-2">
                      Phase
                    </label>
                    <input
                      type="text"
                      value={editingNode.data.phase}
                      onChange={(e) => handleUpdateNode(editingNode.id, { phase: e.target.value })}
                      className="w-full bg-surface-dark border border-border-subtle rounded px-3 py-2 text-primary text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary mb-2">
                      Est. Minutes
                    </label>
                    <input
                      type="number"
                      value={editingNode.data.estimateMinutes}
                      onChange={(e) =>
                        handleUpdateNode(editingNode.id, {
                          estimateMinutes: parseInt(e.target.value) || 30,
                        })
                      }
                      className="w-full bg-surface-dark border border-border-subtle rounded px-3 py-2 text-primary text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary mb-2">
                    Assigned To
                  </label>
                  <select
                    value={editingNode.data.assignedTo || ''}
                    onChange={(e) =>
                      handleUpdateNode(editingNode.id, {
                        assignedTo: e.target.value || undefined,
                      })
                    }
                    className="w-full bg-surface-dark border border-border-subtle rounded px-3 py-2 text-primary text-sm"
                  >
                    <option value="">Unassigned</option>
                    {teamInfo.members.map((member) => (
                      <option key={member.name} value={member.name}>
                        {member.name} ({member.role})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary mb-2">
                    Status
                  </label>
                  <select
                    value={editingNode.data.status}
                    onChange={(e) =>
                      handleUpdateNode(editingNode.id, {
                        status: e.target.value as 'pending' | 'in-progress' | 'completed',
                      })
                    }
                    className="w-full bg-surface-dark border border-border-subtle rounded px-3 py-2 text-primary text-sm"
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                <button
                  onClick={() => handleDeleteNode(editingNode.id)}
                  className="w-full px-4 py-2 bg-red-500 bg-opacity-20 text-red-400 rounded hover:bg-opacity-30 transition text-sm"
                >
                  Delete Task
                </button>
              </motion.div>
            ) : (
              <div className="flex-1 bg-surface-darker rounded-lg border border-border-subtle p-4 flex items-center justify-center text-secondary text-sm text-center">
                Select a task to edit
              </div>
            )}

            {/* Summary */}
            <div className="bg-surface-darker rounded-lg border border-border-subtle p-4 space-y-2">
              <h3 className="font-semibold text-primary">Summary</h3>
              <p className="text-sm text-secondary">
                Total Tasks: <span className="text-accent-primary">{nodes.length}</span>
              </p>
              <p className="text-sm text-secondary">
                Est. Time:{' '}
                <span className="text-accent-primary">
                  {nodes.reduce((sum, n) => sum + (n.data.estimateMinutes || 0), 0)} min
                </span>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
