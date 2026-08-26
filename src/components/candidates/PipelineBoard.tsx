import { useDrag, useDrop } from 'react-dnd';
import Avatar from '../ui/Avatar';
import MatchScore from './MatchScore';

interface PipelineCandidate {
  id: string;
  name: string;
  matchScore: number;
  jobTitle: string;
  appliedAt: string;
}

interface PipelineColumn {
  id: string;
  title: string;
  color: string;
  candidates: PipelineCandidate[];
}

interface PipelineBoardProps {
  columns: PipelineColumn[];
  onMoveCandidate: (candidateId: string, fromColumn: string, toColumn: string) => void;
}

const COLUMN_COLORS: Record<string, string> = {
  applied: 'border-blue-500',
  'under-review': 'border-yellow-400',
  shortlisted: 'border-hiero-green',
  interview: 'border-purple-400',
  selected: 'border-emerald-400',
  rejected: 'border-red-400',
};

function DraggableCandidate({ candidate, columnId }: { candidate: PipelineCandidate; columnId: string }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'CANDIDATE',
    item: { id: candidate.id, columnId },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  }));

  return (
    <div
      ref={drag}
      className={`bg-hiero-dark-2 border border-hiero-border rounded-lg p-3 cursor-grab active:cursor-grabbing transition-all ${isDragging ? 'opacity-50 scale-95' : 'hover:border-hiero-border-light'}`}
    >
      <div className="flex items-center gap-3">
        <Avatar name={candidate.name} size="sm" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white truncate">{candidate.name}</p>
          <p className="text-xs text-hiero-muted truncate">{candidate.jobTitle}</p>
        </div>
        <div className="text-xs font-bold text-hiero-green">{candidate.matchScore}%</div>
      </div>
    </div>
  );
}

function DroppableColumn({ column }: { column: PipelineColumn }) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'CANDIDATE',
    drop: () => ({ columnId: column.id }),
    collect: (monitor) => ({ isOver: monitor.isOver() }),
  }));

  return (
    <div
      ref={drop}
      className={`flex-1 min-w-[240px] ${isOver ? 'bg-hiero-green/5' : ''} rounded-xl transition-colors`}
    >
      <div className={`flex items-center gap-2 px-4 py-3 border-t-2 ${COLUMN_COLORS[column.id] || 'border-hiero-border'}`}>
        <h3 className="text-sm font-semibold text-white">{column.title}</h3>
        <span className="text-xs bg-hiero-dark-2 px-2 py-0.5 rounded-full text-hiero-muted">{column.candidates.length}</span>
      </div>
      <div className="space-y-2 p-2">
        {column.candidates.map(c => (
          <DraggableCandidate key={c.id} candidate={c} columnId={column.id} />
        ))}
        {column.candidates.length === 0 && (
          <div className="text-center py-8 text-xs text-hiero-muted/50">No candidates</div>
        )}
      </div>
    </div>
  );
}

export default function PipelineBoard({ columns }: PipelineBoardProps) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {columns.map(col => (
        <DroppableColumn key={col.id} column={col} />
      ))}
    </div>
  );
}
