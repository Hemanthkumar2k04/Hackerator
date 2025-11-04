import { motion, useMotionValue } from 'framer-motion';
import { useState } from 'react';

export interface WorkspaceNodeData {
    phase_no: number;
    phase_name: string;
    todos: { id: string; name: string; completed: boolean }[];
    est_time_minutes: number;
    prev_phase_id?: string;
    next_phase_id?: string;
}

interface WorkspaceNodeProps {
    data: WorkspaceNodeData;
    isSelected?: boolean;
    onSelect?: (phaseId: string) => void;
    phaseId: string;
    initialPosition?: { x: number; y: number };
    onPositionChange?: (phaseId: string, position: { x: number; y: number }) => void;
}

export function WorkspaceNode({
    data,
    isSelected = false,
    onSelect,
    phaseId,
    initialPosition = { x: 0, y: 0 },
    onPositionChange,
}: WorkspaceNodeProps) {
    const x = useMotionValue(initialPosition.x);
    const y = useMotionValue(initialPosition.y);
    const [isDragging, setIsDragging] = useState(false);

    const handleDragEnd = () => {
        setIsDragging(false);
        onPositionChange?.(phaseId, {
            x: x.get(),
            y: y.get(),
        });
    };

    return (
        <motion.div
            drag
            dragElastic={0}
            dragMomentum={false}
            onDragStart={() => setIsDragging(true)}
            onDragEnd={handleDragEnd}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: isDragging ? 1.05 : 1.02 }}
            whileDrag={{ scale: 1.05 }}
            onClick={() => onSelect?.(phaseId)}
            style={{ x, y, willChange: isDragging ? 'transform' : 'auto' }}
            className={`w-64 px-6 py-4 rounded-lg border-2 cursor-grab active:cursor-grabbing absolute ${isDragging ? '' : 'transition-colors'
                } ${isSelected
                    ? 'bg-surface-darker border-accent-primary shadow-lg shadow-accent-primary/50'
                    : 'bg-surface-dark border-border-subtle hover:border-accent-secondary'
                }`}
        >
            <div className="flex flex-col items-center text-center">
                <span className="text-xs font-semibold text-secondary mb-1">Phase {data.phase_no}</span>
                <h3 className="text-lg font-bold text-primary">{data.phase_name}</h3>
            </div>
        </motion.div>
    );
}
