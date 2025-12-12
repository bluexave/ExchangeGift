import './Member.css';

export const Member = ({ member, memberIdx, onMemberChange, onMemberRemove, groupIdx }) => {
  // Handle both string members and object members with index
  const memberName = typeof member === 'string' ? member : member.name || '';
  const memberIndex = typeof member === 'object' ? member.index : null;

  return (
    <div className="member">
      {memberIndex && (
        <span className="member-index">{memberIndex}</span>
      )}
      <input
        type="text"
        placeholder={`Member ${memberIdx + 1} name`}
        value={memberName}
        onChange={(e) => onMemberChange(groupIdx, memberIdx, e.target.value)}
        onClick={(e) => e.stopPropagation()}
        className="member-input"
      />
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onMemberRemove(groupIdx, memberIdx);
        }}
        className="btn-member-remove"
        title="Remove member"
        aria-label="Remove member"
      >
        ✕
      </button>
    </div>
  );
};
