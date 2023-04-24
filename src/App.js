import "./App.css";
import { useState, useEffect } from "react";
import { ethers, formatUnits, Contract, parseUnits } from "ethers";
import abi from "./erc20.abi.json";

const USDC = "0xD87Ba7A50B2E7E660f678A895E4B72E7CB4CCd9C";

const getAccount = () =>
  window.ethereum.request({ method: "eth_accounts" }).catch((err) => {
    console.error(err);
  });

const connect = async () =>
  window.ethereum.request({ method: "eth_requestAccounts" }).catch((err) => {
    if (err.code === 4001) {
      console.log("Please connect to MetaMask.");
    } else {
      console.error(err);
    }
  });

function App() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);

  useEffect(() => {
    getAccount().then((accs) => {
      if (accs.length) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        setProvider(provider);
        provider.getSigner().then((signer) => setSigner(signer));
      }
    });
  }, []);

  return (
    <div className="App">
      {provider && signer ? (
        <Details provider={provider} signer={signer} />
      ) : (
        <button onClick={connect}>connect</button>
      )}
    </div>
  );
}

function Details({ provider, signer }) {
  const [balance, setBalance] = useState(-1);
  const [contract, setContract] = useState();
  const [usdc, setUsdc] = useState(-1);
  const [block, setBlock] = useState(1);

  useEffect(() => {
    if (provider && signer) {
      provider.getBalance(signer.address).then(setBalance);
    }
  }, [provider, signer, block]);

  useEffect(() => {
    if (provider && signer) {
      setContract(new Contract(USDC, abi, signer));
    }
  }, [provider, signer]);

  useEffect(() => {
    if (contract) {
      Promise.all([
        contract.balanceOf(signer.address),
        contract.decimals(),
      ]).then(([balance, decimals]) =>
      setUsdc(formatUnits(balance, decimals))
      );
    }
  }, [contract, signer?.address, block]);

  useEffect(() => {
    provider.on("block", setBlock);
    return () => {
      provider.off("block", setBlock);
    };
  }, [provider]);

  const send = async () => {
    const MY_OTHER_ACCOUNT = '0x14Ec154AD6D8c87cBd699fb8AB68c3a2F0BB6BA1'

    const tx = await contract.transfer(MY_OTHER_ACCOUNT, parseUnits('1', 6))
    const result = await tx.wait()
    console.log('done', result)
  }

  return (
    <div>
      <div>account: {signer.address}</div>
      {balance !== -1 ? <div>ETH balance: {formatUnits(balance)}</div> : null}
      {usdc !== -1 ? <div>USDC Balance: {usdc}</div> : null}
      <button onClick={send}>send 1 USDC</button>
    </div>
  );
}

export default App;
