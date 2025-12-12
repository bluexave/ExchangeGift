import { useState, useEffect, useRef } from 'react';
import { Workline } from '../Workline/Workline';
import './Worktable.css';

export const Worktable = ({ 
  groups,
  onNameChange,
  onEmailChange,
  onMemberAdd,
  onMemberRemove,
  onMemberChange,
  onTogglePick,
  onRemove,
  onActiveWorklineChange
}) => {
  const [activeWorkline, setActiveWorkline] = useState(null);
  const [activeCard, setActiveCard] = useState(null);
  const worktableRef = useRef(null);

  const handleClick = (lineIdx, e) => {
    e.stopPropagation();
    setActiveWorkline(lineIdx);
    setActiveCard(null);
    onActiveWorklineChange?.(lineIdx);
  };

  const handleCardClick = (cardIdx) => {
    setActiveCard(activeCard === cardIdx ? null : cardIdx);
  };

  const handleClickOutside = (e) => {
    if (worktableRef.current && !worktableRef.current.contains(e.target)) {
      setActiveWorkline(null);
      onActiveWorklineChange?.(null);
    }
  };

  useEffect(() => {
    if (activeWorkline !== null) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [activeWorkline]);

  // Organize groups into worklines of 3 cards each
  const worklines = [];
  for (let i = 0; i < groups.length; i += 3) {
    worklines.push(groups.slice(i, i + 3));
  }

  return (
    <div className="worktable" ref={worktableRef}>
      {groups.length === 0 ? (
        <div className="worktable-empty">
          <p>No groups yet. Click "Add Group" to get started</p>
        </div>
      ) : (
        <div className="worklines-container">
          {worklines.map((workline, lineIdx) => (
            <Workline
              key={lineIdx}
              workline={workline}
              startIdx={lineIdx * 3}
              isActive={activeWorkline === lineIdx}
              activeCard={activeCard}
              onCardClick={handleCardClick}
              onClick={(e) => handleClick(lineIdx, e)}
              onNameChange={onNameChange}
              onEmailChange={onEmailChange}
              onMemberAdd={onMemberAdd}
              onMemberRemove={onMemberRemove}
              onMemberChange={onMemberChange}
              onTogglePick={onTogglePick}
              onRemove={onRemove}
            />
          ))}
        </div>
      )}
    </div>
  );
};
