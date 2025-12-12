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
  const [activeCards, setActiveCards] = useState(new Set());
  const worktableRef = useRef(null);

  const handleCardClick = (cardIdx) => {
    setActiveCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(cardIdx)) {
        newSet.delete(cardIdx);
      } else {
        newSet.add(cardIdx);
      }
      return newSet;
    });
  };

  const handleClickOutside = (e) => {
    if (worktableRef.current && !worktableRef.current.contains(e.target)) {
      setActiveCards(new Set());
    }
  };

  useEffect(() => {
    if (activeCards.size > 0) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [activeCards]);

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
              activeCards={activeCards}
              onCardClick={handleCardClick}
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
