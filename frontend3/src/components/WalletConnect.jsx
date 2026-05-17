import { useState } from "react";
import { ethers } from "ethers";

const FoxIcon = () => (
  <svg className="fox-icon" viewBox="0 0 35 33" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M32.955.5L19.62 10.237l2.477-5.858L32.955.5z" fill="#E2761B" stroke="#E2761B" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2.032.5l13.22 9.831-2.358-5.952L2.032.5z" fill="#E4761B" stroke="#E4761B" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M28.13 23.624l-3.549 5.431 7.592 2.09 2.18-7.4-6.223-.12zM.67 23.745l2.168 7.4 7.58-2.09-3.537-5.43-6.211.12z" fill="#E4761B" stroke="#E4761B" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10.05 14.364l-2.12 3.205 7.557.335-.26-8.123-5.178 4.583zM24.937 14.364l-5.249-4.678-.173 8.218 7.545-.335-2.123-3.205zM10.418 29.055l4.55-2.208-3.92-3.063-.63 5.271zM20.019 26.847l4.562 2.208-.643-5.271-3.919 3.063z" fill="#E4761B" stroke="#E4761B" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M24.581 29.055l-4.562-2.208.369 2.993-.04 1.252 4.233-2.037zM10.418 29.055l4.245 2.037-.027-1.252.356-2.993-4.574 2.208z" fill="#D7C1B3" stroke="#D7C1B3" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M14.73 21.974l-3.779-1.11 2.668-1.223 1.111 2.333zM20.256 21.974l1.112-2.333 2.68 1.223-3.792 1.11z" fill="#233447" stroke="#233447" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10.418 29.055l.657-5.431-4.23.12 3.573 5.311zM23.912 23.624l.656 5.431 3.573-5.311-4.23-.12zM27.057 17.569l-7.545.335.7 3.87 1.112-2.333 2.68 1.223 3.053-3.095zM7.928 20.664l2.68-1.223 1.1 2.333.713-3.87-7.556-.335 3.063 3.095z" fill="#CD6116" stroke="#CD6116" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M7.928 20.664l3.194 6.22-.863-3.908-2.331-2.312zM24.725 22.976l-.875 3.908 3.207-6.22-2.332 2.312zM20.512 17.904l-.7-3.87-4.728 3.047 3.547.219 1.881.604zM14.45 17.904l1.87-.604 3.534-.219-4.716-3.047-.688 3.87z" fill="#E4751F" stroke="#E4751F" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M14.45 17.904l-.713 3.87.713-.604 4.538.604.713.604-.7-3.87-1.882-.604-4.669 0zM20.256 21.974l-4.538-.604-.713.604.7 3.87 1.882-1.882 2.793-1.988z" fill="#F6851B" stroke="#F6851B" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const CopyIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2"/>
    <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
  </svg>
);

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const WalletConnect = ({ onConnect, onDisconnect, account, setSigner }) => {
  const [connecting, setConnecting] = useState(false);
  const [copied, setCopied] = useState(false);

  const connectMetaMask = async () => {
    if (!window.ethereum) {
      alert("MetaMask not detected. Please install the extension.");
      return;
    }
    setConnecting(true);
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      setSigner(signer);
      onConnect(address);
    } catch (error) {
      console.error("Connection error:", error);
    }
    setConnecting(false);
  };

  const disconnect = () => {
    onDisconnect();
    setSigner(null);
  };

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(account);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Copy failed:", error);
    }
  };

  if (!account) {
    return (
      <button
        onClick={connectMetaMask}
        disabled={connecting}
        className="wallet-connect-btn"
      >
        {connecting ? (
          <>
            <span className="spinner" />
            Connecting
          </>
        ) : (
          <>
            <FoxIcon />
            Connect Wallet
          </>
        )}
      </button>
    );
  }

  return (
    <div className="wallet-connected">
      <span className="wallet-dot" />
      <div className="wallet-address-block">
        <span className="w-label">Connected</span>
        <span className="w-address">
          {account.slice(0, 6)}...{account.slice(-4)}
        </span>
      </div>
      <div className="wallet-action-btns">
        <button
          onClick={copyAddress}
          className={`w-icon-btn${copied ? " copied" : ""}`}
          title="Copy address"
        >
          {copied ? <CheckIcon /> : <CopyIcon />}
        </button>
        <button onClick={disconnect} className="w-disconnect-btn">
          Disconnect
        </button>
      </div>
    </div>
  );
};

export default WalletConnect;