import { useState, useEffect, useRef } from 'react';
import { Group } from '../Group/Group';
import { Member } from '../Member/Member';
import './Card.css';

export const Card = ({ 
  group, 
  groupIdx, 
  isActive,
  onCardClick,
  onNameChange, 
  onEmailChange, 
  onMemberAdd, 
  onMemberRemove, 
  onMemberChange, 
  onTogglePick, 
  onRemove 
}) => {
  const cardRef = useRef(null);
  const memberCount = group.members.filter(m => {
    const name = typeof m === 'string' ? m : m.name || '';
    return name.trim();
  }).length;
  const isValid = group.name.trim() && group.email.trim();

  const handleCardClick = (e) => {
    e.stopPropagation();
    onCardClick();
  };

  const handleClickOutside = (e) => {
    if (cardRef.current && !cardRef.current.contains(e.target)) {
      onCardClick?.();
    }
  };

  useEffect(() => {
    if (isActive) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isActive]);

  return (
    <div 
      ref={cardRef}
      className={`card ${isActive ? 'active' : 'inactive'}`}
      onClick={handleCardClick}
      style={{ cursor: 'pointer' }}
    >
      <div className="card-header">
        <h3 className="card-title">{group.name || '(Unnamed)'}</h3>
        {!isActive && (
          <div className="card-preview">
            <span className="member-count-inactive">{memberCount} members</span>
          </div>
        )}
        {isActive && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRemove(groupIdx);
            }}
            className="btn-card-remove"
            title="Remove group"
            aria-label="Remove group"
          >
            ✕
          </button>
        )}
      </div>

      {isActive ? (
        <div className="card-edit">
          <Group 
            group={group}
            groupIdx={groupIdx}
            onNameChange={onNameChange}
            onEmailChange={onEmailChange}
            onTogglePick={onTogglePick}
          />

          {isValid && (
            <div className="members-section">
              <div className="members-header">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onMemberAdd(groupIdx);
                  }}
                  className="btn-add-member"
                  disabled={group.members.some(m => {
                    const name = typeof m === 'string' ? m : m.name || '';
                    return !name.trim();
                  })}
                >
                  + Add Member
                </button>
                <span className="member-count">{memberCount}</span>
              </div>
              <div className="members-list">
                {group.members.map((member, memberIdx) => (
                  <Member
                    key={memberIdx}
                    member={member}
                    memberIdx={memberIdx}
                    groupIdx={groupIdx}
                    onMemberChange={onMemberChange}
                    onMemberRemove={onMemberRemove}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};
