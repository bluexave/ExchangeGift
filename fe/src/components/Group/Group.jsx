import './Group.css';

export const Group = ({ group, onNameChange, onEmailChange, onTogglePick, groupIdx }) => {
  return (
    <div className="group">
      <input
        type="text"
        placeholder="Name"
        value={group.name}
        onChange={(e) => onNameChange(groupIdx, e.target.value)}
        onClick={(e) => e.stopPropagation()}
        className="form-input"
      />

      <input
        type="email"
        placeholder="Email"
        value={group.email}
        onChange={(e) => onEmailChange(groupIdx, e.target.value)}
        onClick={(e) => e.stopPropagation()}
        className="form-input"
      />

      <label className="form-checkbox">
        <input
          type="checkbox"
          checked={group.isPickAtLeastOnePerGroup || false}
          onChange={() => onTogglePick(groupIdx)}
          onClick={(e) => e.stopPropagation()}
          className="checkbox-input"
        />
        <span className="checkbox-label-text">All Pick</span>
      </label>
    </div>
  );
};
