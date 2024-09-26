import { sepolia } from '@starknet-react/chains'
import { argent, braavos } from '@starknet-react/core'

export const CHAINS = [sepolia]
export const WALLETS = [braavos(), argent()]
export const SEPOLIA_NETWORK = {
    id: BigInt("0x534e5f5345504f4c4941"),
    name: "Starknet Sepolia Testnet",
    network: "sepolia",
    nativeCurrency: {
        name: "Ether",
        symbol: "ETH",
        decimals: 18,
        address: "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7"
    },
    testnet: true,
    rpcUrls: {
        public: {
            http: [
                'https://starknet-mainnet-rpc.dwellir.com',
                'https://free-rpc.nethermind.io/sepolia-juno',
            ],
        },
    },
    explorers: {
        starkscan: ['https://sepolia.starkscan.co']
    }
}