import "../styles/globals.css";
import { WebBundlr } from "@bundlr-network/client";
import { MainContext } from "../context";
import { useState, useRef } from "react";
import { providers, utils } from "ethers";

function MyApp({ Component, pageProps }) {
  const [bundlrInstance, setBundlrInstance] = useState();
  const [balance, setBalance] = useState();
  const [provider, setProvider] = useState();
  const [account, setAccount] = useState();
  const bundlrRef = useRef();
  async function initialiseBundlr() {
    const provider = new providers.Web3Provider(window.ethereum);
    await provider._ready();
    const signer = provider.getSigner();
    setProvider(provider);

    let accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
      params: [],
    });
    const account = utils.getAddress(accounts[0]).toLowerCase();
    setAccount(account);

    const bundlr = new WebBundlr(
      "https://node1.bundlr.network",
      "matic",
      provider
    );
    await bundlr.ready();

    setBundlrInstance(bundlr);
    bundlrRef.current = bundlr;
    fetchBalance();
  }

  async function fetchBalance() {
    const bal = await bundlrRef.current.getLoadedBalance();
    console.log("bal: ", utils.formatEther(bal.toString()));
    setBalance(utils.formatEther(bal.toString()));
  }

  return (
    <div style={containerStyle}>
      <MainContext.Provider
        value={{
          initialiseBundlr,
          bundlrInstance,
          balance,
          fetchBalance,
        }}
      >
        <Component {...pageProps} />
      </MainContext.Provider>
    </div>
  );
}

const containerStyle = {
  width: "900px",
  margin: "0 auto",
  padding: "40px",
};

export default MyApp;
