import { useState } from "react";

const CreateVestingForm = ({ onCreateVesting, loading }) => {
  const [beneficiary, setBeneficiary] = useState("");
  const [amount, setAmount] = useState("");
  const [cliffDays, setCliffDays] = useState("30");
  const [vestingDays, setVestingDays] = useState("365");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!beneficiary || !amount) {
      alert("Please fill all required fields.");
      return;
    }
    const startTime = Math.floor(Date.now() / 1000);
    const cliffDuration = parseInt(cliffDays) * 86400;
    const vestingDuration = parseInt(vestingDays) * 86400;
    await onCreateVesting(beneficiary, amount, startTime, cliffDuration, vestingDuration);
    setBeneficiary("");
    setAmount("");
  };

  return (
    <div className="card">
      <div className="card-label">New Schedule</div>
      <h3>Create Vesting Schedule</h3>

      <form onSubmit={handleSubmit} className="form-grid">
        <div className="form-group">
          <label>Beneficiary Address</label>
          <div className="input-suffix">
            <input
              type="text"
              value={beneficiary}
              onChange={(e) => setBeneficiary(e.target.value)}
              placeholder="0x0000...0000"
              spellCheck={false}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label>Token Amount</label>
          <div className="input-suffix">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              step="any"
              min="0"
              required
              style={{ paddingRight: "58px" }}
            />
            <span className="input-suffix-label">SCAI</span>
          </div>
        </div>

        <div className="form-divider" />

        <div className="form-row">
          <div className="form-group">
            <label>Cliff Period</label>
            <div className="input-suffix">
              <input
                type="number"
                value={cliffDays}
                onChange={(e) => setCliffDays(e.target.value)}
                placeholder="30"
                min="0"
                style={{ paddingRight: "46px" }}
              />
              <span className="input-suffix-label">days</span>
            </div>
          </div>
          <div className="form-group">
            <label>Vesting Period</label>
            <div className="input-suffix">
              <input
                type="number"
                value={vestingDays}
                onChange={(e) => setVestingDays(e.target.value)}
                placeholder="365"
                min="1"
                style={{ paddingRight: "46px" }}
              />
              <span className="input-suffix-label">days</span>
            </div>
          </div>
        </div>

        <button type="submit" disabled={loading} className="btn-primary" style={{ marginTop: "8px" }}>
          {loading ? (
            <>
              <span className="spinner" />
              Creating Schedule
            </>
          ) : (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14M5 12h14"/>
              </svg>
              Create Schedule
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default CreateVestingForm;