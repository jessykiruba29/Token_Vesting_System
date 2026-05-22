# 🏛️ Token Vesting Platform

A decentralized token vesting platform that allows project owners to lock SCAI tokens and release them gradually to beneficiaries over time.

---

##  Overview

The Token Vesting Platform enables secure, time-based release of tokens to beneficiaries. It's designed for:

- **Project Teams** - Lock team tokens with cliff periods
- **Investors** - Schedule investor token releases
- **Advisors** - Set up advisor vesting schedules
- **Employees** - Implement employee token incentives

### How It Works

Admin creates vesting schedule → Tokens locked in smart contract → Cliff period (no tokens released) → Linear vesting over time → Beneficiaries claim tokens periodically

---

##  Features

### Smart Contract Features
- Cliff Period - No tokens released before cliff ends
- Linear Vesting - Gradual token release over time
- Time-Locked Claims - Beneficiaries claim only vested amount
- Owner Controls - Only contract owner can create schedules
- Revocable Option - Owner can revoke with remaining tokens returned
- Reentrancy Protection - Secure against attacks
- SafeERC20 - Secure token transfers

### Frontend Features
- Wallet Connection - MetaMask support
- Dashboard View - See all vesting schedules
- Claim Tokens - One-click claiming
- Create Vesting - Admin interface
- Progress Tracking - Visual progress bar
- Real-time Updates - Auto-refreshes claimable amounts
- Mobile Responsive - Works on all devices

---

##  Tech Stack

| Component | Technology | Version |
|-----------|------------|---------|
| Smart Contracts | Solidity | 0.8.20 |
| Development Framework | Hardhat | Latest |
| Token Standard | OpenZeppelin ERC20 | 4.9.x |
| Frontend | React | 18.2.0 |
| Web3 Library | Ethers.js | 5.7.2 |
| Styling | CSS3 | - |
| Wallet Integration | MetaMask | - |
| Deployment | Vercel | - |
| Network | Sepolia | 11155111 |

---

##  Usage Guide

### For Admin (Contract Owner)

1. Connect your wallet (must be owner)
2. Click "Create Vesting Schedule"
3. Enter beneficiary address and amount
4. Set cliff and vesting duration (in days)
5. Submit transaction
6. Tokens are locked in contract

### For Beneficiaries

1. Connect your wallet
2. Dashboard shows your vesting schedule
3. Check claimable amount
4. Click "Claim Tokens"
5. Tokens appear in your wallet

### Example Schedule

- Total amount: 10,000 SCAI
- Cliff period: 6 months (180 days)
- Vesting period: 24 months (730 days)
- Result: No tokens for 6 months, then linear release over 24 months

---

##  Smart Contract Functions

| Function | Access | Description |
|----------|--------|-------------|
| createVesting() | Owner | Creates new vesting schedule |
| claim() | Beneficiary | Claims vested tokens |
| getClaimableAmount() | Public | Returns claimable tokens |
| getSchedule() | Public | Returns schedule details |
| revoke() | Owner | Revokes vesting |
| pause() | Owner | Emergency pause |
| unpause() | Owner | Resume operations |

### Vesting Math Formula

```
vestedAmount = (totalAmount × timeElapsed) / vestingDuration
claimableAmount = vestedAmount - releasedAmount
```
---
