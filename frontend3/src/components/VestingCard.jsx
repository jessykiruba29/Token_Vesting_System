const VestingCard = ({ schedule, claimableAmount, progress, onClaim, loading }) => {
  if (!schedule || schedule.totalAmount === "0.0") {
    return (
      <div className="card vesting-card">
        <div className="card-label">Vesting Schedule</div>
        <div className="no-schedule">
          <div className="no-schedule-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="3"/>
              <path d="M9 9h6M9 12h4"/>
            </svg>
          </div>
          <h4>No Schedule Found</h4>
          <p>No active vesting schedule is associated with this address.</p>
        </div>
      </div>
    );
  }

  const total = parseFloat(schedule.totalAmount);
  const released = parseFloat(schedule.releasedAmount);
  const claimable = parseFloat(claimableAmount);
  const remaining = total - released;

  return (
    <div className="card vesting-card">
      <div className="card-label">Vesting Schedule</div>

      {/* Main amount */}
      <div className="amount-display">
        <span className="amount-label">Total Allocation</span>
        <div>
          <span className="amount-value">{total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          <span className="amount-ticker">SCAI</span>
        </div>
      </div>

      {/* Stats */}
      <div style={{ padding: "8px 0" }}>
        <div className="stat-row">
          <span className="stat-label">Released</span>
          <span className="stat-value highlight">
            {released.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} SCAI
          </span>
        </div>
        <div className="stat-row">
          <span className="stat-label">Remaining</span>
          <span className="stat-value">
            {remaining.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} SCAI
          </span>
        </div>
      </div>

      {/* Progress */}
      <div className="progress-section">
        <div className="progress-header">
          <span>Vesting Progress</span>
          <span className="progress-pct">{Math.round(progress)}%</span>
        </div>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${Math.min(progress, 100)}%` }} />
        </div>
      </div>

      {/* Dates */}
      <div className="dates-grid">
        <div className="date-item">
          <div className="d-label">Cliff End</div>
          <div className="d-value">{schedule.cliffEndTime}</div>
        </div>
        <div className="date-item">
          <div className="d-label">Fully Vested</div>
          <div className="d-value">{schedule.vestingEndTime}</div>
        </div>
      </div>

      {/* Claim */}
      <div className="claim-section">
        <div className="claimable-display">
          <span className="claimable-label">Available to Claim</span>
          <span className="claimable-amount">
            {claimable.toFixed(4)} SCAI
          </span>
        </div>
        <button
          onClick={onClaim}
          disabled={loading || claimable === 0}
          className="btn-teal"
        >
          {loading ? (
            <>
              <span className="spinner" />
              Processing
            </>
          ) : (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14M5 12l7 7 7-7"/>
              </svg>
              Claim {claimable.toFixed(4)} SCAI
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default VestingCard;