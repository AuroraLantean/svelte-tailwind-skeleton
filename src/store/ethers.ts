import { ethers, formatEther, formatUnits, Contract} from "ethers";
import goldcoin from "@contracts/goldcoin";

let signer = null;
let provider;

export const ethersInit = async () => {
  console.log("ethersInit()... goldcoin addr:", goldcoin.address);
  if (window.ethereum == null) {
    // If MetaMask is not installed, we use the default provider,
    // which is backed by a variety of third-party services (such
    // as INFURA). They do not have private keys installed so are
    // only have read-only access
    console.log("MetaMask not installed; using read-only defaults")
    provider = ethers.getDefaultProvider();
    return ['', ''];

  } else {
    // Connect to the MetaMask EIP-1193 object. This is a standard
    // protocol that allows Ethers access to make all read-only
    // requests through MetaMask.
    provider = new ethers.BrowserProvider(window.ethereum)

    // It also provides an opportunity to request access to write
    // operations, which will be performed by the private key
    // that MetaMask manages for the user.
    signer = await provider.getSigner();

    //https://docs.metamask.io/wallet/get-started/set-up-dev-environment/
    const chainId = await window.ethereum.request({ method: 'eth_chainId' }).catch((err) => {
      console.error('@eth_chainId:', err);
    });;
    console.log('detected chainId:', chainId);

    const accounts = await window.ethereum.request({ method: 'eth_accounts' }).catch((err) => {
      console.error('@eth_accounts:', err);
    });
    const account = handleAccountsChanged(accounts);
    console.log('detected account:', account);

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);

    return [chainId, account]
  }
}
const handleChainChanged = () => {
  window.location.reload();
}
function handleAccountsChanged(accounts) {
  let currentAccount = null;
  if (accounts.length === 0) {
    console.log('Please connect to MetaMask.');
  } else if (accounts[0] !== currentAccount) {
    currentAccount = accounts[0];
    console.log('currentAccount', currentAccount);
  }
  return currentAccount;
}

export async function getAccount() {
  const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
    .catch((err) => {
      if (err.code === 4001) {
        console.log('Please connect to MetaMask.');
      } else {
        console.error(err);
      }
    });
  const account = accounts[0];
  return account;
}

export const getBalanceEth = async (addr: string): string[] => {
  const balanceInWei = await provider.getBalance(addr)
  // 182334002436162568n

  const balanceInEth = formatEther(balanceInWei);
  // '0.182334002436162568'
  return [balanceInEth, balanceInWei + ''];
}

export const getTokenBalance = async (userAddr: string): string => {
  console.log('getTokenBalance()... userAddr: ' + userAddr);
  // Create a contract; connected to a Provider, so it may
  // only access read-only methods (like view and pure)
  const goldcoinInst = new Contract(goldcoin.address, goldcoin.abi, provider)

  const sym = await goldcoinInst.symbol()

  const decimals = await goldcoinInst.decimals()
  // 18n

  const tokenBalcRaw = await goldcoinInst.balanceOf(userAddr)

  // Format the balance for humans, such as in a UI
  const tokenBalc = formatUnits(tokenBalcRaw, decimals)

  console.log('success,', sym, decimals, tokenBalcRaw, tokenBalc);
  return tokenBalc;
}