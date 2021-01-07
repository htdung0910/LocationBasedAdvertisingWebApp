import * as dhttrc21 from './abis/DHTTRC21.json';
import * as signDuocument from './abis/SignDocument.json';

const EnvConfig = {

  RPC_ENDPOINT: 'https://testnet.tomochain.com',
  NETWORK_ID: 89,
  TOKEN_ABI: dhttrc21.abi,
  TOKEN_ADDRESS:'0x3278C78EA5295F9C6B0C39bE0D0394ED896a17C4',
  SIGNDOCUMENT_ABI: signDuocument.abi,
  SIGNDOCUMENT_ADDRESS: '0x5C4E980c34E4375D42731a3EF7f2A2314fC3d073',
  TOKENS: [
    {
      "name": 'DungHuynh',
      "symbol": 'DHT',
      "decimals": 18
    }
  ]
};

export default EnvConfig;
