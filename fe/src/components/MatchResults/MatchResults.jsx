import './MatchResults.css';

export const MatchResults = ({ results, attempts, onReset }) => {
  if (!results || results.length === 0) {
    return null;
  }

  const downloadCSV = () => {
    const headers = ['Giver', 'Recipient'];
    const csv = [
      headers.join(','),
      ...results.map(m => `"${m.name}","${m.baby}"`),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gift-exchange-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="match-results">
      <div className="results-header">
        <h2>✓ Matches Created!</h2>
        <p>Attempt: {attempts}/3</p>
      </div>

      <div className="results-table-container">
        <table className="results-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Giver</th>
              <th>→</th>
              <th>Recipient</th>
            </tr>
          </thead>
          <tbody>
            {results.map((match, idx) => (
              <tr key={idx} className={idx % 2 === 0 ? 'even' : 'odd'}>
                <td className="index">{idx + 1}</td>
                <td className="giver">{match.name}</td>
                <td className="arrow">→</td>
                <td className="recipient">{match.baby}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="results-stats">
        <span>Total Matches: {results.length}</span>
        <span>Success Rate: 100%</span>
      </div>

      <div className="results-actions">
        <button onClick={downloadCSV} className="btn-download">
          📥 Download CSV
        </button>
        <button onClick={onReset} className="btn-new">
          Create New Matches
        </button>
      </div>
    </div>
  );
};
