# trust⚡

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE) [![GitHub issues](https://img.shields.io/github/issues/yourusername/trust)](https://github.com/yourusername/trust/issues) [![Aptos](https://img.shields.io/badge/Blockchain-Aptos-blueviolet)](https://aptoslabs.com/)

*trust⚡* is a decentralized platform that automatically rewards open-source contributors using *Aptos + Move* smart contracts. Contributors get paid instantly when their pull requests are merged, while maintainers can ensure payments are secure and automated.

---
## 🌟 Branch Overview

- *main* — GitHub webhooks & backend logic for call actions  
- *jitin* — Frontend implementation with React/Next.js  
- *ujesh* — Aptos smart contracts written in Move  

---
## LOGO
<p align="center">
  <img src="logo.png" alt="Description" width="300"/>
</p>


## 🚀 Quick Start

### 1. Clone the repository
bash
git clone https://github.com/yourusername/trust.git


### 2. Frontend Setup (branch jitin)
bash
cd trust/jitin
npm install
npm run dev


### 3. Backend Setup (branch main)
bash
cd trust/main
npm install
npm start


### 4. Deploy Move Smart Contracts (branch ujesh)
Follow the official Aptos Move documentation: [Aptos Move](https://aptos.dev/en/build/smart-contracts)

---

## 💡 How It Works

### Login & Wallet Connection
Contributors log in via GitHub and connect their crypto wallet.

### Task Creation & Reward Locking
Repo owners add repositories, create tasks, and lock token rewards upfront in a Move smart contract.

### Task Completion & PR Submission
Contributors browse tasks, pick one, and submit a pull request (PR).

### Instant Payout via Webhooks
When the PR is merged, GitHub Webhooks trigger the Move smart contract, releasing tokens directly into the contributor's wallet.

This process guarantees instant, trustless payments for accepted contributions.

---

## 🌈 Key Benefits

- *Instant, trustless payments* through Aptos + Move
- *Transparent contributor reputation tracking*
- *Automated AI quality checks* (future) to enforce code style, test coverage, and documentation standards before human review
- *Secure and scalable* due to Aptos blockchain

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React / Next.js (dashboard & task management) |
| Backend | Node.js (GitHub API & Webhooks management) |
| Blockchain | Aptos + Move smart contracts (escrow & payouts) |
| AI (future) | Automated task verification for quality checks |

---

## 🔮 Vision

- Eliminate trust issues in open-source contribution
- Guarantee instant payments to contributors
- Build a verifiable record of contributions and reputation
- Streamline task review with AI for faster, smarter approvals

*Principle:* Merge the PR → Get paid instantly → Build your reputation.

---

## 📂 Directory / Branch Guide

bash
main/    # Backend & GitHub webhooks
jitin/   # Frontend: React / Next.js
ujesh/   # Aptos Move smart contracts


---

## ⚡ Why Aptos + Move?

- *High performance & scalability* compared to Ethereum
- *Strong security guarantees* via Move smart contracts
- *Unique positioning* in the blockchain ecosystem
- *Low transaction fees* and fast processing for instant payouts

---

## 📢 Get Involved

Contribute, suggest features, or report issues:

- *GitHub Issues:* https://github.com/yourusername/trust/issues
- *Pull Requests:* https://github.com/yourusername/trust/pulls
- *Discussions:* https://github.com/yourusername/trust/discussions

Join the revolution in open-source contribution!

---

*trust⚡* — merge the PR, get paid instantly, build your reputation.
