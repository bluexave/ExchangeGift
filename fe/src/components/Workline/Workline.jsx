import { Card } from '../Card/Card';
import './Workline.css';

export const Workline = ({ 
  workline,
  startIdx,
  isActive,
  activeCard,
  onCardClick,
  onClick,
  onNameChange,
  onEmailChange,
  onMemberAdd,
  onMemberRemove,
  onMemberChange,
  onTogglePick,
  onRemove
}) => {
  const getWorklineStats = (cards) => {
    const groupCount = cards.length;
    const totalMembers = cards.reduce((sum, group) => {
      return sum + group.members.filter(m => {
        const name = typeof m === 'string' ? m : m.name || '';
        return name.trim();
      }).length;
    }, 0);
    return { groupCount, totalMembers };
  };

  const stats = getWorklineStats(workline);

  return (
    <div 
      className={`workline ${isActive ? 'active' : 'inactive'}`}
      onClick={onClick}
      style={{ cursor: 'pointer' }}
    >
      {!isActive ? (
        <div className="workline-summary">
          <div className="summary-content">
            <span className="summary-groups">{stats.groupCount} Groups</span>
            <span className="summary-separator">•</span>
            <span className="summary-members">{stats.totalMembers} Members</span>
          </div>
        </div>
      ) : (
        <div className="workline-cards">
          {workline.map((group, cardIdx) => {
            const globalIdx = startIdx + cardIdx;
            return (
              <Card
                key={globalIdx}
                group={group}
                groupIdx={globalIdx}
                isActive={activeCard === globalIdx}
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
      )}
    </div>
  );
};
