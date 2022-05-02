import type { ReactNode } from 'react'
import { Icon } from '@masknet/icons'
import { EnhanceableSite } from '@masknet/shared-base'

export const SOCIAL_MEDIA_ICON_MAPPING: Record<string, ReactNode> = {
    [EnhanceableSite.Twitter]: <Icon type="twitterColored" />,
    [EnhanceableSite.Facebook]: <Icon type="facebookColored" />,
    [EnhanceableSite.Minds]: <Icon type="minds" />,
    [EnhanceableSite.Instagram]: <Icon type="instagramColored" />,
    [EnhanceableSite.OpenSea]: <Icon type="openSeaColoredIcon" />,
    [EnhanceableSite.Localhost]: null,
}

export const SOCIAL_MEDIA_ROUND_ICON_MAPPING: Record<string, ReactNode> = {
    [EnhanceableSite.Twitter]: <Icon type="twitterRound" />,
    [EnhanceableSite.Facebook]: <Icon type="facebookRound" />,
    [EnhanceableSite.Minds]: <Icon type="mindsRound" />,
    [EnhanceableSite.Instagram]: <Icon type="instagramRound" />,
    [EnhanceableSite.OpenSea]: <Icon type="openSeaColoredIcon" />,
    [EnhanceableSite.Localhost]: null,
}

export const SOCIAL_MEDIA_NAME: Record<string, string> = {
    [EnhanceableSite.Twitter]: 'Twitter',
    [EnhanceableSite.Facebook]: 'Facebook',
    [EnhanceableSite.Minds]: 'Mind',
    [EnhanceableSite.Instagram]: 'Instagram',
    [EnhanceableSite.OpenSea]: 'OpenSea',
    [EnhanceableSite.Localhost]: 'Localhost',
}

export const SOCIAL_MEDIA_SUPPORTING_NEXT_DOT_ID = [EnhanceableSite.Twitter]

export const mediaViewerUrl = 'https://media-viewer.r2d2.to/index.html'

export const MAX_WALLET_LIMIT = 100
