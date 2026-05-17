import { useState, useEffect } from "react";
import "./App.css";
import WalletConnect from "./components/WalletConnect";
import VestingCard from "./components/VestingCard";
import CreateVestingForm from "./components/CreateVestingForm";
import { useVesting } from "./hooks/useVesting";
import contractData from "./contracts/TokenVesting.json";

const VESTING_ADDRESS =
  process.env.REACT_APP_VESTING_CONTRACT_ADDRESS || "0xYourContractAddress";

const RefreshIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 2v6h-6M3 12a9 9 0 0115-6.7L21 8M3 22v-6h6M21 12a9 9 0 01-15 6.7L3 16"/>
  </svg>
);

const ShieldIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);

const WalletIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z"/>
    <path d="M16 3H8L4 7h16l-4-4z"/>
    <circle cx="17" cy="13" r="1" fill="currentColor"/>
  </svg>
);

function App() {
  const [account, setAccount] = useState(null);
  const [signer, setSigner] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const {
    schedule,
    claimableAmount,
    progress,
    loading,
    loadSchedule,
    claimTokens,
    createVesting,
  } = useVesting(signer, account, VESTING_ADDRESS, contractData.abi);

  useEffect(() => {
    if (!account) return;
    loadSchedule();
    setIsAdmin(true);
  }, [account]);

  const handleConnect = (address) => setAccount(address);
  const handleDisconnect = () => {
    setAccount(null);
    setSigner(null);
    setIsAdmin(false);
  };

  return (
    <div className="app">
      <header className="header">
        <div className="header-brand">
          <div className="header-logo">
            <ShieldIcon />
          </div>
          <div>
            <h1>Vest</h1>
            <div className="header-subtitle">Token Vesting Protocol</div>
          </div>
        </div>

        <WalletConnect
          onConnect={handleConnect}
          onDisconnect={handleDisconnect}
          account={account}
          setSigner={setSigner}
        />
      </header>

      <main className="container">
        {account ? (
          <>
            <div className="dashboard-header">
              <h2>Overview</h2>
              <p>{account}</p>
            </div>

            <div className="dashboard">
              <VestingCard
                schedule={schedule}
                claimableAmount={claimableAmount}
                progress={progress}
                onClaim={claimTokens}
                loading={loading}
              />

              {isAdmin && (
                <CreateVestingForm
                  onCreateVesting={createVesting}
                  loading={loading}
                />
              )}
            </div>

            <button onClick={loadSchedule} className="refresh-btn">
              <RefreshIcon />
              Refresh data
            </button>
          </>
        ) : (
          <div className="connect-prompt">
            <div className="connect-prompt-icon">
              <WalletIcon />
            </div>
            <h2>Connect your wallet</h2>
            <p>Connect your MetaMask wallet to view and manage your token vesting schedules.</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;