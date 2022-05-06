import type { NextIDPlatform } from '@masknet/shared-base'

export enum PageTags {
    WalletTag = 'Wallets',
    NFTTag = 'NFTs',
    DonationTag = 'Donations',
    FootprintTag = 'Footprints',
    DAOTag = 'DAO',
}

export interface Asset {
    chain: string
}

export interface GeneralAsset {
    platform: string
    identity: string
    id: string // contractAddress-id or admin_address
    type: string
    info: {
        collection?: string
        collection_icon?: string
        image_preview_url?: string | null
        animation_url?: string | null
        animation_original_url?: string | null
        title?: string
        total_contribs?: number
        token_contribs?: {
            token: string
            amount: string
        }[]
        start_date?: string
        end_date?: string
        country?: string
        city?: string
    }
}

export interface GeneralAssetWithTags extends GeneralAsset {
    tags?: string[]
}

export interface RSS3Profile {
    avatar: string[]
    bio: string
    name: string
}

export enum AssetType {
    GitcoinDonation = 'Gitcoin-Donation',
    POAP = 'POAP',
}

export interface patch {
    unListedCollections: Record<
        string,
        {
            NFTS: string[]
            Donations: string[]
            Footprints: string[]
        }
    >
}
export interface kvType {
    persona: string
    proofs: proof[]
}
export interface proof {
    platform: NextIDPlatform
    identity: string
    content?: Record<string, patch>
}
