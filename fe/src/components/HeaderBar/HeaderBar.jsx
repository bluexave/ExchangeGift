import './HeaderBar.css';

export const HeaderBar = ({ 
  groupCount, 
  totalMembers, 
  isValid,
  onAddGroup, 
  onSave, 
  onLoad,
  onPickOrderDraft,
  onSantaBabyDraft,
  loading 
}) => {
  return (
    <div className="header-bar">
      <div className="header-bar-top">
        <h2 className="header-title">Setup Groups</h2>
      </div>
      
      <div className="header-controls">
        <button 
          onClick={onAddGroup}
          className="btn-header btn-add"
          disabled={loading}
        >
          + Add Group
        </button>
        <button 
          onClick={onSave}
          className="btn-header btn-save"
          disabled={loading}
        >
          💾 Save
        </button>
        <button 
          onClick={onLoad}
          className="btn-header btn-load"
          disabled={loading}
        >
          📂 Load
        </button>
        <button 
          onClick={onPickOrderDraft}
          className="btn-header btn-pick-order"
          disabled={!isValid || loading}
        >
          🎲 PickOrderDraft
        </button>
        <button 
          onClick={onSantaBabyDraft}
          className="btn-header btn-santa-baby"
          disabled={!isValid || loading}
        >
          {loading ? '⏳ Creating Matches...' : '🎯 SantaBabyDraft'}
        </button>
      </div>

      <div className="header-info">
        <div className="info-item">
          <span className="info-label">Groups:</span>
          <span className="info-value">{groupCount}</span>
        </div>
        <div className="info-item">
          <span className="info-label">Members:</span>
          <span className="info-value">{totalMembers}</span>
        </div>
        <div className="info-item">
          <span className="info-label">Status:</span>
          <span className={`info-value ${isValid ? 'valid' : 'invalid'}`}>
            {isValid ? '✓ Ready' : '⚠ Incomplete'}
          </span>
        </div>
      </div>
    </div>
  );
};
