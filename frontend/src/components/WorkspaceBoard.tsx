import { useEffect } from 'react';
import ReactFlow, {
  Background,
  Controls,
  type Edge,
  type Node,
  ConnectionMode,
  useNodesState,
  useEdgesState,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { PhaseNode } from './PhaseNode';

const nodeTypes = {
  phase: PhaseNode,
};

interface WorkspaceBoardProps {
  initialNodes: Node[];
  initialEdges: Edge[];
  projectId: string;
}

export function WorkspaceBoard({ initialNodes, initialEdges, projectId }: WorkspaceBoardProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  useEffect(() => {
    console.log('WorkspaceBoard - Initial Nodes:', initialNodes);
    console.log('WorkspaceBoard - Initial Edges:', initialEdges);
    // Set initial horizontal positions only on first load
    const positionedNodes = initialNodes.map((node, index) => ({
      ...node,
      data: { ...node.data, projectId },
      position: { x: index * 400 + 40, y: 50 }
    }));
    setNodes(positionedNodes);
    setEdges(initialEdges);
  }, []);

  useEffect(() => {
    console.log('WorkspaceBoard - Current Nodes State:', nodes);
    console.log('WorkspaceBoard - Current Edges State:', edges);
  }, [nodes, edges]);

  return (
    <div style={{ width: '100%', height: '100%', backgroundColor: '#030712', position: 'relative' }}>
      <div style={{ position: 'absolute', top: '16px', left: '16px', zIndex: 50, background: 'rgba(0,0,0,0.9)', padding: '10px 16px', borderRadius: '4px', color: '#00d4ff', fontSize: '12px', border: '1px solid #00d4ff' }}>
        Total: {nodes.length} Phases | {edges.length} Connections
      </div>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        connectionMode={ConnectionMode.Loose}
        minZoom={0.1}
        maxZoom={2}
        defaultViewport={{ x: 0, y: 0, zoom: 1 }}
        style={{ width: '100%', height: '100%', backgroundColor: '#030712' }}
        nodesDraggable={true}
        nodesConnectable={true}
        elementsSelectable={true}
      >
        <Background color="#16213e" gap={20} />
        <Controls style={{ backgroundColor: '#1a1a2e', borderColor: '#16213e' }} />
      </ReactFlow>
    </div>
  );
}
