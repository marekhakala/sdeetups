import { Wallet } from '@dynamic-labs/sdk-react-core'
import { SC_CASM } from './casm'
import { SC_SIERRA } from './sierra'
import { RpcProvider, CallData, stark, Contract } from 'starknet'

const strip0x = (s: string) => (s.startsWith('0x') ? s.slice(2) : s)
const PROVIDER_SEPOLIA = new RpcProvider({ nodeUrl: "https://starknet-mainnet-rpc.dwellir.com" })

function createByteArray(itemString: string) {
    const ps = []
    const itemBytes = itemString

    for (let i = 0; i < itemBytes.length; i += 31) {
        ps.push(itemBytes.slice(i, i + 31))
    }

    const pending_word_len = itemBytes.length;
    return {
        pending_word_len: pending_word_len,
        pending_word: pending_word_len % 31,
        data: ps
    }
}

export async function deployContract(account: Wallet, ownerAddress: string, name: string, time_at: string, description: string) {
    const sierraCode = SC_SIERRA
    const casmCode = SC_CASM
    const myCallData = new CallData(sierraCode.abi)
    const args = {
        name: name,
        time_at: `${time_at}`,
        description: createByteArray(description),
        owner: createByteArray(strip0x(ownerAddress)),
    }
    console.log("name: ", name);
    console.log("time_at: ", time_at);
    console.log("description", description);

    const constructor = myCallData.compile("constructor", args)

    console.log("Deploying Smart Contract...", args);
    const deployer = await account.connector.getSigner()
    const deployResponse = await deployer.deployContract({
        classHash: "0x0479a27eef90e2d2cab7f65a21dd495729578895612d642d869dbfd08b0f372c", // pre-declared class hash on Sepolia
        constructorCalldata: constructor
    })

    const sContract = new Contract(sierraCode.abi, deployResponse.deploy.contract_address, PROVIDER_SEPOLIA);
    console.log("[DONE] Contract has been deploy with the address: ", sContract.address);

    const classHash = deployResponse.declare.class_hash
    const contractAddress = deployResponse.deploy.contract_address
    console.log("Smart Contract deployed...", name, classHash, contractAddress, sContract.address);

    return sContract.address
}
