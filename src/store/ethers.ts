import { ethers, formatEther, formatUnits, parseUnits, Contract } from "ethers";
import goldcoin from "@contracts/goldcoin.json";
import dragonNft from "@contracts/erc721Dragon.json";
import { isEmpty } from "@store/lib";

let signer = null;
let provider;
let isInitialized = false;
const lg = console.log;
let mesg = '';

export const ethersInit = async (): Promise<Web3InitOutput> => {
  lg("ethersInit()...");
  if (window.ethereum == null) {
    // If MetaMask is not installed, we use the default provider, which is backed by a variety of third-party services (such as INFURA). They do not have private keys installed so are only have read-only access
    mesg = "MetaMask not installed; using read-only defaults";
    console.warn(mesg)
    provider = ethers.getDefaultProvider();
    return {
      warn: mesg,
    };
  } else {
    // Connect to the MetaMask EIP-1193 object. This is a standard protocol that allows Ethers access to make all read-only requests through MetaMask.
    provider = new ethers.BrowserProvider(window.ethereum)

    // It also provides an opportunity to request access to write operations, which will be performed by the private key that MetaMask manages for the user.
    signer = await provider.getSigner();

    //https://docs.metamask.io/wallet/get-started/set-up-dev-environment/
    const chainId = await window.ethereum.request({ method: 'eth_chainId' }).catch((err) => {
      mesg = '@eth_chainId:'+ err;
      console.error(mesg);
      return {err: mesg};
    });
    lg('detected chainId:', chainId);

    const accounts = await window.ethereum.request({ method: 'eth_accounts' }).catch((err) => {
      mesg = '@eth_accounts:'+ err;
      console.error(mesg);
      return {err: mesg};
    });
    lg('detected accounts:', accounts);//same as account with only one item in the array
    const out = handleAccountsChanged(accounts);
    if(out.warn){
      return {warn: out.warn}
    }
    const account = out.account;
    lg('detected account:', account);

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);

    return {
      chainId,
      account,
    };
  }
}
const handleChainChanged = () => {
  window.location.reload();
}
function handleAccountsChanged(accounts): Web3InitOutput {
  let currentAccount = null;
  if (accounts.length === 0) {
    mesg = 'Please connect to MetaMask';
    console.warn(mesg);
    return {warn: mesg};
  } else if (accounts[0] !== currentAccount) {
    currentAccount = accounts[0];
    lg('currentAccount', currentAccount);
    if(isInitialized){
      window.location.reload();
    }
    isInitialized = true;
  }
  return {account: currentAccount};
}

export async function getAccount(): Promise<Web3InitOutput>{
  const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
    .catch((err) => {
      if (err.code === 4001) {
        mesg = 'Please connect to MetaMask';
        console.warn(mesg);
        return {warn: mesg};
      } else {
        console.error(err);
        return {err};
      }
    });
  const account = accounts[0];
  lg('getAccount() success. account:', account);
  return {account};
}

export const getBalanceEth = async (addr: string): Promise<ReadOutput> => {
  lg('getBalanceEth()... addr:', addr);
  if(isEmpty(addr)){
    return {err: 'input invalid'};
  }
  const balanceInWei = await provider.getBalance(addr)
  // 182334002436162568n

  const balanceInEth = formatEther(balanceInWei);
  // '0.182334002436162568'
  lg('success:', balanceInWei, balanceInEth);
  return {
    str: balanceInEth,
    str2: balanceInWei + '',
  };
}

export const erc20BalanceOf = async (input: TxnInput): Promise<ReadOutput> => {
  const userAddr = input.addr1;
  lg('erc20BalanceOf()... userAddr:', userAddr);
  if(isEmpty(userAddr) || isEmpty(input.ctrtAddr)){
    return {err: 'input invalid'};
  }
  const goldcoinInst = new Contract(input.ctrtAddr, goldcoin.abi, provider);

  const sym = await goldcoinInst.symbol();
  const decimals = await goldcoinInst.decimals();// 18n
  const tokenBalcInWei = await goldcoinInst.balanceOf(userAddr);
  const tokenBalc = formatUnits(tokenBalcInWei, decimals);

  lg('success:', sym, decimals, tokenBalcInWei, tokenBalc);
  return {str: tokenBalc};
}

export const erc20Allowance = async (input: TxnInput): Promise<ReadOutput> => {
  const addr1 = input.addr1;
  const addr2 = input.addr2;
  lg('erc20Allowance()... addr1:', addr1, ', addr2:', addr2);
  if(isEmpty(addr1) || isEmpty(addr2) || isEmpty(input.ctrtAddr)){
    return {err: 'input invalid'};
  }
  const goldcoinInst = new Contract(input.ctrtAddr, goldcoin.abi, provider);

  const allowanceInWei = await goldcoinInst.allowance(addr1, addr2);
  const decimals = await goldcoinInst.decimals();// 18n
  const allowanceInEth = formatUnits(allowanceInWei, decimals);

  lg('success,', allowanceInWei, allowanceInEth);
  return {str: allowanceInEth};
}

export const erc20Transfer = async (input: TxnInput): Promise<TxnOutput> => {
  const addrTo = input.addr2;
  const amt = input.amount1;
  lg('erc20Transfer()... addrTo:', addrTo, ', amt:', amt);
  if(isEmpty(addrTo) || isEmpty(amt) || isEmpty(input.ctrtAddr)){
    return {err: 'input invalid'};
  }
  const goldcoinInst = new Contract(input.ctrtAddr, goldcoin.abi, signer);
  const amountInWei = parseUnits(amt, 18);
  const tx = await goldcoinInst.transfer(addrTo, amountInWei);
  const receipt = await tx.wait();
  lg('success... txnHash:', receipt, receipt.hash);
  //blockNumber, cumulativeGasUsed, gasPrice, gasUsed
  return {txnHash: receipt.hash};
}

export const erc20Approve = async (input: TxnInput): Promise<TxnOutput> => {
  const addr2 = input.addr2;
  const amt = input.amount1;
  lg('erc20Approve()... addr2:', addr2, ', amt:', amt);
  if(isEmpty(addr2) || isEmpty(amt) || isEmpty(input.ctrtAddr)){
    return {err: 'input invalid'};
  }
  const goldcoinInst = new Contract(input.ctrtAddr, goldcoin.abi, signer);
  const amountInWei = parseUnits(amt, 18);
  const tx = await goldcoinInst.transfer(addr2, amountInWei);
  const receipt = await tx.wait();
  lg('success... txnHash:', receipt, receipt.hash);
  //blockNumber, cumulativeGasUsed, gasPrice, gasUsed
  return {txnHash: receipt.hash};
}

//----------------== ERC721
export const erc721Transfer = async (input: TxnInput): Promise<TxnOutput> => {
  const addr1 = input.addr1;
  const addr2 = input.addr2;
  const tokenId = input.amount1;
  lg('erc20Allowance()... addr1:', addr1, ', addr2:', addr2, ', tokenId:', tokenId);
  if(isEmpty(addr1) || isEmpty(addr2) || isEmpty(tokenId) || isEmpty(input.ctrtAddr)){
    return {err: 'input invalid'};
  }
  try {
    const dragonNftInst = new Contract(input.ctrtAddr, dragonNft.abi, signer);
    const sym = await dragonNftInst.name();
    lg('symbol', sym);
    if(sym !== 'Dragons'){
      return {err: 'invalid contract'};
    }
    const tx = await dragonNftInst.safeTransferFrom(addr1, addr2, tokenId);
    const receipt = await tx.wait();
    lg('success... txnHash:', receipt, receipt.hash);
    //blockNumber, cumulativeGasUsed, gasPrice, gasUsed
    return {txnHash: receipt.hash};
  } catch (error) {
    console.error('@erc721Transfer:', error);
    return {err: 'invocation failed'};
  }

}

export const erc721BalanceOf = async (input: TxnInput): Promise<ReadOutput> => {
  const userAddr = input.addr1;
  lg('erc20BalanceOf()... userAddr:', userAddr);
  if(isEmpty(userAddr) || isEmpty(input.ctrtAddr)){
    return {err: 'input invalid'};
  }
  const dragonNftInst = new Contract(input.ctrtAddr, dragonNft.abi, provider);
  const sym = await dragonNftInst.name();
  lg('symbol', sym);
  if(sym !== 'Dragons'){
    return {err: 'invalid contract'};
  }
  const tokenBalcInWei = await dragonNftInst.balanceOf(userAddr);
  lg('success,', tokenBalcInWei);
  return {str: tokenBalcInWei};
}