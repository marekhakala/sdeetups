'use client'

import { type State } from 'wagmi'
import type { ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { StarknetWalletConnectors } from '@dynamic-labs/starknet'
import { StarknetConfig, publicProvider } from '@starknet-react/core'
import { DynamicContextProvider } from '@dynamic-labs/sdk-react-core'
import { CHAINS, WALLETS } from '@/libs/config'

const queryClient = new QueryClient()
type Props = { children: ReactNode, initialState?: State | undefined }

export function Providers({ children }: Props) {
    return (
        <StarknetConfig chains={CHAINS} connectors={WALLETS} provider={publicProvider()}>
            <DynamicContextProvider
                settings={{ environmentId: process.env.NEXT_PUBLIC_DYNAMIC_ENV_ID || '',
                    walletConnectors: [StarknetWalletConnectors]
                }}>
                <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
            </DynamicContextProvider>
        </StarknetConfig>
    )
}
