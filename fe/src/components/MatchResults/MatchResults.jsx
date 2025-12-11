import './MatchResults.css';

export const MatchResults = ({ results, families, attempts, onReset }) => {
  if (!results || results.length === 0) {
    return null;
  }

  const totalMembers = families?.reduce((sum, family) => {
    return sum + family.members.filter(m => m.trim()).length;
  }, 0) || 0;

  return (
    <div className="match-results">
      <div className="confirmation-container">
        <div className="confirmation-icon">✓</div>
        <h2>Matches Created Successfully!</h2>
        <p className="confirmation-message">
          All gift assignments have been completed and confirmation emails have been sent.
        </p>
      </div>

      <div className="details-section">
        <div className="details-header">
          <h3>Email Notifications Sent</h3>
        </div>
        <div className="families-list">
          {families?.map((family, idx) => {
            const memberCount = family.members.filter(m => m.trim()).length;
            return (
              <div key={idx} className="family-notification">
                <div className="family-name">{family.name}</div>
                <div className="family-email">📧 {family.email}</div>
                <div className="member-count">
                  {memberCount} member{memberCount !== 1 ? 's' : ''} matched
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="summary-stats">
        <div className="stat">
          <span className="stat-label">Total Families:</span>
          <span className="stat-value">{families?.length || 0}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Total Members Matched:</span>
          <span className="stat-value">{totalMembers}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Attempts Required:</span>
          <span className="stat-value">{attempts}</span>
        </div>
      </div>

      <div className="confirmation-actions">
        <button onClick={onReset} className="btn-new-matches">
          Create New Matches
        </button>
      </div>
    </div>
  );
};
