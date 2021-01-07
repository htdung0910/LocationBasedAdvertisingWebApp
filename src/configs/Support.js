import { ethers } from "ethers";
import EnvConfig from "./env";
import { Keccak } from 'sha3';


export default class EtherService {
  constructor() {
    this.provider = new ethers.providers.JsonRpcProvider(EnvConfig.RPC_ENDPOINT);
    this.signer = this.provider.getSigner();
  }

  async getBalance() {
    let balance;
    if (this.wallet != undefined) {
      balance = await this.provider.getBalance(this.wallet.address);
    }
    return ethers.utils.formatEther(balance);
  }

  async createAccount() {
    if (this.wallet == undefined) {
      this.wallet = await ethers.Wallet.createRandom();
      this.wallet = this.wallet.connect(this.provider);
    }
  }

  async createKeyStoreJson(password) {
    const json = await this.wallet.encrypt(password, {
      scrypt: {
        N: 2 ** 16,
      },
    });
    return json;
  }

  async readKeyStoreJson(json, password) {
    this.wallet = await ethers.Wallet.fromEncryptedJson(json, password);
    this.wallet = this.wallet.connect(this.provider);
  }

  async readPrivateKey(privateKey) {
    this.wallet = await ethers.Wallet( privateKey );
    this.wallet = this.wallet.connect(this.provider);
  }

  async initContracts() {
    this.token = new ethers.Contract(
      EnvConfig.TOKEN_ADDRESS,
      EnvConfig.TOKEN_ABI,
      this.wallet
    );
    this.signdocument = new ethers.Contract(
      EnvConfig.SIGNDOCUMENT_ADDRESS,
      EnvConfig.SIGNDOCUMENT_ABI,
      this.wallet
    );
  }

  async addDocument(url) {
    const hash = new Keccak(256);
    hash.update(url)
    let ifps_hex = '0x'+hash.digest('hex');
    hash.update(Date.now().toString());
    let id = '0x'+hash.digest('hex');
    var callPromise = this.signdocument.addDocument(id, ifps_hex);
    console.log(callPromise);
    callPromise.then(function(result) {
      console.log("Result: " + result);
    });
  }

  async signDocument(id) {
    var callPromise = this.signdocument.signDocument(id);
    console.log(callPromise);
    callPromise.then(function(result) {
      console.log(result);
    });
  }

  async getSignature(id) {
    var callPromise = this.signdocument.getSignatures(id);
    callPromise.then(function(signatures) {
      signatures.forEach(function(sig) {
        console.log(sig);
      });
    });
  }

  async sendToken() {
    var callPromise = this.token.transfer("0x3Bb6e7cdeB061c98cc43d2dCD0E68dd5a7dd8fe0", 20);
    callPromise.then(function(result) {
      console.log(result);
    });
  }

}
