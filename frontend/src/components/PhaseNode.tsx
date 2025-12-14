import { memo } from 'react';
import { Handle, Position, useReactFlow } from 'reactflow';

interface Task {
  id: number;
  title: string;
  assigned_to: string;
  completed: boolean;
}

interface PhaseNodeData {
  label: string;
  description: string;
  estimated_time: string;
  phaseId: number;
  projectId?: string;
  tasks?: Task[];
}

export const PhaseNode = memo(({ data }: { data: PhaseNodeData }) => {
  const { setNodes } = useReactFlow();

  const handleTaskClick = async (taskId: number) => {
    // Update local state
    setNodes((nds) =>
      nds.map((node) => {
        if (node.data.phaseId === data.phaseId) {
          const updatedTasks = (node.data.tasks || []).map((task: Task) =>
            task.id === taskId ? { ...task, completed: !task.completed } : task
          );
          return {
            ...node,
            data: { ...node.data, tasks: updatedTasks }
          };
        }
        return node;
      })
    );

    // Save to database immediately
    if (data.projectId) {
      try {
        const response = await fetch(`http://localhost:3000/api/workspace/${data.projectId}/task-complete`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ taskId }),
        });

        if (!response.ok) {
          console.error('Failed to save task completion:', response.statusText);
        }
      } catch (error) {
        console.error('Error saving task completion:', error);
      }
    }
  };

  return (
    <div 
      style={{ 
        width: '340px', 
        minHeight: '180px',
        backgroundColor: '#1a1a2e',
        border: '2px solid #16213e',
        borderRadius: '12px',
        padding: '16px',
        color: '#ffffff',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.5)',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative'
      }}
    >
      <Handle type="target" position={Position.Left} style={{ background: '#00d4ff', width: '12px', height: '12px' }} />
      <Handle type="source" position={Position.Right} style={{ background: '#00d4ff', width: '12px', height: '12px' }} />
      
      <div style={{ marginBottom: '12px', borderBottom: '1px solid #16213e', paddingBottom: '8px' }}>
        <h3 style={{ fontSize: '15px', fontWeight: 'bold', color: '#00d4ff', margin: '0 0 4px 0' }}>
          {data.label || 'Untitled Phase'}
        </h3>
        <p style={{ fontSize: '11px', color: '#9ca3af', margin: '0', maxHeight: '32px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {data.description || 'No description'}
        </p>
        <div style={{ marginTop: '8px' }}>
          <span style={{ 
            backgroundColor: '#16213e', 
            padding: '2px 8px', 
            borderRadius: '12px', 
            fontSize: '10px',
            color: '#00d4ff',
            display: 'inline-block',
            border: '1px solid #00d4ff'
          }}>
            {data.estimated_time || 'N/A'}
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1, overflow: 'auto' }}>
        {data.tasks && data.tasks.length > 0 ? (
          data.tasks.map((task) => (
            <div 
              key={task.id} 
              onClick={() => handleTaskClick(task.id)}
              style={{ 
                display: 'flex', 
                alignItems: 'flex-start', 
                gap: '8px', 
                backgroundColor: '#0f3460', 
                padding: '8px', 
                borderRadius: '6px',
                fontSize: '11px',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
                borderLeft: `3px solid ${task.completed ? '#10b981' : '#00d4ff'}`
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#16213e';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#0f3460';
              }}
            >
              <div style={{ 
                width: '8px', 
                height: '8px', 
                borderRadius: '50%',
                backgroundColor: task.completed ? '#10b981' : '#ffffff',
                flexShrink: 0,
                marginTop: '3px'
              }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ 
                  margin: 0, 
                  color: task.completed ? '#10b981' : '#ffffff', 
                  overflow: 'hidden', 
                  textOverflow: 'ellipsis', 
                  whiteSpace: 'nowrap',
                  textDecoration: task.completed ? 'line-through' : 'none'
                }}>
                  {task.title}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p style={{ fontSize: '11px', color: '#6b7280', fontStyle: 'italic', margin: 0 }}>No tasks</p>
        )}
      </div>
    </div>
  );
});
