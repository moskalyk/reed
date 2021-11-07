const {
  AssetId,
  BridgeId,
  createWalletSdk,
  EthAddress,
  TxType,
  WalletProvider,
  EthersAdapter,
} = require('@aztec/sdk');
const { JsonRpcProvider } = require('@ethersproject/providers');
const ethers = require('ethers');
const { randomBytes } = require('crypto');

const ROLLUP_HOST = 'https://api.aztec.network/falafel-defi-bridge';
const ETHEREUM_HOST ='https://goerli.infura.io/v3/6a04b7c89c5b421faefde663f787aa35';

class Aztec {
  constructor(){

    this.AZTEC_PRIVATE_KEY = randomBytes(32); // STORE THIS as hex
    this.userId = null
    this.sdk = null

    this.ETHEREUM_ADDRESS = '';
    this.ETHEREUM_PRIVATE_KEY = '';

    this.ethersProvider = new JsonRpcProvider(ETHEREUM_HOST);
    this.ethereumProvider = new EthersAdapter(this.ethersProvider);
    this.walletProvider = new WalletProvider(this.ethereumProvider);
    this.walletProvider.addAccount(this.ETHEREUM_PRIVATE_KEY);

    // uniswap bridge
    this.defiBridge = EthAddress.fromString('0xC4528eDC0F2CaeA2b9c65D05aa9A460891C5f2d4');
  }

  async shield(){
    if(!this.userId){
      let assetId = AssetId.ETH;
      const value = this.sdk.toBaseUnits(assetId, '0.2');
      const balance = this.sdk.getBalance(assetId, this.userId);
      assetId = AssetId.DAI;

        const inputAssetId = AssetId.ETH;

      const signer = this.sdk.createSchnorrSigner(this.AZTEC_PRIVATE_KEY);
      const depositor = EthAddress.fromString(this.ETHEREUM_ADDRESS);
      const txFee = await this.sdk.getFee(inputAssetId, TxType.DEFI_DEPOSIT);

      const proofOutput = await this.sdk.createDepositProof(
        assetId,
        depositor,
        this.userId,
        value,
        txFee,
        signer
      );

      const signature = await this.sdk.signProof(proofOutput, depositor);

      await this.sdk.depositFundsToContract(assetId, depositor, value + txFee);

      const txHash = await this.sdk.sendProof(proofOutput, signature);
      await this.sdk.awaitSettlement(txHash, 10000);
    } else{
      throw Error('User id not set')
    }
  }

  async getBalance() {
    const assetId = AssetId.DAI;
    const balance = this.sdk.getBalance(this.assetId, this.userId);
    return balance
  }

  async getEntropy() {
    // experimental and probably too out there
    const assetId = AssetId.DAI;
    const balance = this.sdk.getBalance(assetId, this.userId);
    return this.sdk.fromBaseUnits(assetId, balance)
  }

  async defiInteraction(amount){

    const inputAssetId = AssetId.ETH;
    const outputAssetIdA = AssetId.DAI;

    const outputAssetIdB = 0;

    const bridgeId = new BridgeId(
      this.defiBridge,
      1,
      inputAssetId,
      outputAssetIdA,
      outputAssetIdB
    );
    const txFee = await this.sdk.getFee(inputAssetId, TxType.DEFI_DEPOSIT);

    const depositValue = this.sdk.toBaseUnits(inputAssetId, amount);
    const initialBalance = this.sdk.getBalance(inputAssetId, this.userId);

    const signer = this.sdk.createSchnorrSigner(this.AZTEC_PRIVATE_KEY);

    const proofOutput = await this.sdk.createDefiProof(
      bridgeId,
      this.userId,
      depositValue,
      txFee,
      signer
    );

    const txHash = await this.sdk.sendProof(proofOutput);

    await this.sdk.awaitSettlement(txHash, 10000);

    const defiTxs = await this.sdk.getDefiTxs(this.userId);

    return defiTxs
  }

  async init(){
    this.sdk = await createWalletSdk(this.walletProvider, ROLLUP_HOST, {
      syncInstances: false,
      saveProvingKey: false,
      clearDb: true,
      dbPath: ':memory:',
      minConfirmation: 1,
      debug: true,
      minConfirmationEHW: 1,
    });

    await this.sdk.init();
    await this.sdk.awaitSynchronised();
  }

  async runSwap(amount) {
    await this.init()

    const user = await this.sdk.addUser(this.AZTEC_PRIVATE_KEY);
    this.userId = user.id;

    await this.shield();
    return await this.defiInteraction(amount);
  }
}

export default Aztec
