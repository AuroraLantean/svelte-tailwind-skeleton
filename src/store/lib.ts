import { EvmChain } from '@moralisweb3/common-evm-utils';

export const getChainObj = (chainIdStr) => {
  console.log('getChainObj()... chainIdStr:', chainIdStr);
  let chain;
  switch (chainIdStr) {
    case '0x1':
      chain = EvmChain.ETHEREUM;
      break;
    case '0xaa36a7':
      chain = EvmChain.SEPOLIA;
      break;
    case '0x5':
      chain = EvmChain.GOERLI;
      break;
    case '0x89':
      chain = EvmChain.POLYGON;
      break;
    default:
      chain = EvmChain.POLYGON;
  }
  return chain;
}
export const getChainStr = (chainObj: any) => {
  const chainStr = JSON.stringify(chainObj);
  const unquoted = chainStr.replace(/['"]+/g, '');
  console.log('chainStr unquoted: ', unquoted);
  return unquoted;
}
