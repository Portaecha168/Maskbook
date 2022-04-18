import type { Web3Plugin } from '../web3-types'
import type { NetworkPluginID } from '../entry-web3'
import { usePluginWeb3StateContext } from './Context'

export function useFungibleTokenList<T extends Web3Plugin.FungibleToken[]>(pluginID?: NetworkPluginID) {
    return usePluginWeb3StateContext(pluginID).fungibleTokenList as T
}