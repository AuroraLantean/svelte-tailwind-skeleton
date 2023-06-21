import { EvmChain } from '@moralisweb3/common-evm-utils';

export const getChainObj = (chainIdStr) => {
  console.log('getChainObj()... chainIdStr:', chainIdStr);
  let chain;
  let chainStr = '';
  switch (chainIdStr) {
    case 'ethereum':
    case '0x1':
      chain = EvmChain.ETHEREUM;
      chainStr = 'ethereum';
      break;
    case 'sepolia':
    case '0xaa36a7':
      chain = EvmChain.SEPOLIA;
      chainStr = 'sepolia';
      break;
    case 'goerli':
    case '0x5':
      chain = EvmChain.GOERLI;
      chainStr = 'goerli';
      break;
    case 'polygon':
    case '0x89':
      chain = EvmChain.POLYGON;
      chainStr = 'polygon';
      break;
    case 'mumbai':
    case '0x13881':
      chain = EvmChain.MUMBAI;
      chainStr = 'mumbai';
      break;
    case 'bsc':
    case '0x38':
      chain = EvmChain.BSC;
      chainStr = 'bsc';
      break;
    case 'bsc_testnet':
    case '0x61':
      chain = EvmChain.BSCTESTNET;
      chainStr = 'bsc_testnet';
      break;
    case 'avalanche':
    case '0xa86a':
      chain = EvmChain.AVALANCHE;
      chainStr = 'avalanche';
      break;
    case 'fantom':
    case '0xfa':
      chain = EvmChain.FANTOM;
      chainStr = 'fantom';
      break;
    case 'cronos':
    case '0x19':
      chain = EvmChain.CRONOS;
      chainStr = 'cronos';
      break;
    case 'palm':
    case '0x2a15c308d':
      chain = EvmChain.PALM;
      chainStr = 'palm';
      break;
    case 'arbitrum':
    case '0xa4b1':
      chain = EvmChain.ARBITRUM;
      chainStr = 'arbitrum';
      break;
    default:
      chain = EvmChain.POLYGON;
      chainStr = 'polygon';
  }
  return [chain, chainStr];
}
export const getChainStr = (chainObj: any) => {
  const chainStr = JSON.stringify(chainObj);
  const unquoted = chainStr.replace(/['"]+/g, '');
  console.log('chainStr unquoted: ', unquoted);
  return unquoted;
}
export const capitalizeFirst = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export const isEmpty = (value) =>
  value === undefined ||
  value === null ||
  (typeof value === 'object' && Object.keys(value).length === 0) ||
  (typeof value === 'string' && value.trim().length === 0) ||
  (typeof value === 'string' && value === 'undefined');