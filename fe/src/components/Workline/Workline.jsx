import { Card } from '../Card/Card';
import './Workline.css';

export const Workline = ({ 
  workline,
  startIdx,
  activeCards,
  onCardClick,
  onNameChange,
  onEmailChange,
  onMemberAdd,
  onMemberRemove,
  onMemberChange,
  onTogglePick,
  onRemove
}) => {
  return (
    <div className="workline">
      <div className="workline-cards">
        {workline.map((group, cardIdx) => {
          const globalIdx = startIdx + cardIdx;
          return (
            <Card
              key={globalIdx}
              group={group}
              groupIdx={globalIdx}
              isActive={activeCards.has(globalIdx)}
              onCardClick={() => onCardClick(globalIdx)}
              onNameChange={onNameChange}
              onEmailChange={onEmailChange}
              onMemberAdd={onMemberAdd}
              onMemberRemove={onMemberRemove}
              onMemberChange={onMemberChange}
              onTogglePick={onTogglePick}
              onRemove={onRemove}
            />
          );
        })}
      </div>
    </div>
  );
};
