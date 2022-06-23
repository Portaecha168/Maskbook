import { useEffect, useMemo, useState } from 'react'
import { useUpdateEffect } from 'react-use'
import { first } from 'lodash-unified'
import {
    createInjectHooksRenderer,
    PluginId,
    useActivatedPluginsSNSAdaptor,
    useIsMinimalMode,
    usePluginI18NField,
} from '@masknet/plugin-infra/content-script'
import { useSocialAddressListAll, useAvailablePlugins } from '@masknet/plugin-infra/web3'
import { ConcealableTabs } from '@masknet/shared'
import { EMPTY_LIST, NextIDPlatform } from '@masknet/shared-base'
import { makeStyles, useStylesExtends } from '@masknet/theme'
import { Box, CircularProgress, Typography } from '@mui/material'
import { activatedSocialNetworkUI } from '../../social-network'
import { isTwitter } from '../../social-network-adaptor/twitter.com/base'
import { MaskMessages, useI18N } from '../../utils'
import { useLocationChange } from '../../utils/hooks/useLocationChange'
import { useCurrentVisitingIdentity, useLastRecognizedIdentity } from '../DataSource/useActivatedUI'
import { useNextIDBoundByPlatform, usePersonaBoundPlatform } from '../DataSource/useNextID'
import { usePersonaConnectStatus } from '../DataSource/usePersonaConnectStatus'
import { ZERO_ADDRESS } from '@masknet/web3-shared-evm'
import { NetworkPluginID, SocialAddress, SocialAddressType } from '@masknet/web3-shared-base'

function getTabContent(tabId?: string) {
    return createInjectHooksRenderer(useActivatedPluginsSNSAdaptor.visibility.useAnyMode, (x) => {
        const tab = x.ProfileTabs?.find((x) => x.ID === tabId)
        return tab?.UI?.TabContent
    })
}

const useStyles = makeStyles()((theme) => ({
    root: {},
    content: {
        position: 'relative',
        padding: theme.spacing(2, 1),
    },
}))

export interface ProfileTabContentProps extends withClasses<'text' | 'button' | 'root'> {}

export function ProfileTabContent(props: ProfileTabContentProps) {
    const classes = useStylesExtends(useStyles(), props)

    const { t } = useI18N()
    const translate = usePluginI18NField()

    const [hidden, setHidden] = useState(true)
    const [selectedTab, setSelectedTab] = useState<string | undefined>()
    const [addressList, setAddressList] = useState<Array<SocialAddress<NetworkPluginID>>>([])
    const [profileOpen, setProfileOpen] = useState(false)

    const currentIdentity = useLastRecognizedIdentity()
    const identity = useCurrentVisitingIdentity()
    const { currentConnectedPersona } = usePersonaConnectStatus()

    const { value: socialAddressList = EMPTY_LIST, loading: loadingSocialAddressList } =
        useSocialAddressListAll(identity)
    const { value: personaList = EMPTY_LIST, loading: loadingPersonaList } = useNextIDBoundByPlatform(
        activatedSocialNetworkUI.configuration.nextIDConfig?.platform as NextIDPlatform | undefined,
        identity.identifier?.userId,
    )

    const { value: personaProof } = usePersonaBoundPlatform(
        currentConnectedPersona?.identifier?.publicKeyAsHex || ZERO_ADDRESS,
    )
    const wallets = personaProof?.proofs?.filter((proof) => proof?.platform === NextIDPlatform.Ethereum)
    const isOwn = currentIdentity?.identifier === identity?.identifier
    useEffect(() => {
        if (wallets?.length === 0 || !wallets || !isOwn) {
            setAddressList(socialAddressList)
        } else {
            const addresses = wallets.map((proof) => {
                return {
                    networkSupporterPluginID: NetworkPluginID.PLUGIN_EVM,
                    type: SocialAddressType.ADDRESS,
                    label: proof?.identity,
                    address: proof?.identity,
                }
            })
            setAddressList([...socialAddressList, ...addresses])
        }
    }, [socialAddressList, wallets?.length, isOwn])

    const activatedPlugins = useActivatedPluginsSNSAdaptor('any')
    const availablePlugins = useAvailablePlugins(activatedPlugins)
    const isWeb3ProfileDisable = useIsMinimalMode(PluginId.Web3Profile)
    const displayPlugins = useMemo(() => {
        return availablePlugins.flatMap((x) => x.ProfileTabs?.map((y) => ({ ...y, pluginID: x.ID })) ?? EMPTY_LIST)
        // .filter((z) => z.Utils?.shouldDisplay?.(identity, socialAddressList) ?? true)
    }, [identity, availablePlugins.map((x) => x.ID).join(), socialAddressList.map((x) => x.address).join()])
    console.log({
        addressList,
        currentConnectedPersona,
        personaList,
        socialAddressList,
        identity,
        activatedPlugins,
        isWeb3ProfileDisable,
    })

    const tabs = displayPlugins
        .sort((a, z) => {
            // order those tabs from next id first
            if (a.pluginID === PluginId.NextID) return -1
            if (z.pluginID === PluginId.NextID) return 1

            // order those tabs from collectible first
            if (a.pluginID === PluginId.Collectible) return -1
            if (z.pluginID === PluginId.Collectible) return 1

            // place those tabs from debugger last
            if (a.pluginID === PluginId.Debugger) return 1
            if (z.pluginID === PluginId.Debugger) return -1

            // place those tabs from dao before the last
            if (a.pluginID === PluginId.DAO) return 1
            if (z.pluginID === PluginId.DAO) return -1

            return a.priority - z.priority
        })
        .filter((z) => z.pluginID !== PluginId.NextID && z.pluginID !== PluginId.Web3Profile)
        .map((x) => ({
            id: x.ID,
            label: typeof x.label === 'string' ? x.label : translate(x.pluginID, x.label),
        }))

    const selectedTabId = selectedTab ?? first(tabs)?.id
    const componentTabId =
        isTwitter(activatedSocialNetworkUI) && ((isOwn && addressList?.length === 0) || isWeb3ProfileDisable)
            ? displayPlugins?.find((tab) => tab?.pluginID === PluginId.NextID)?.ID
            : selectedTabId

    const handleOpenDialog = () => {
        setSelectedTab(`${PluginId.Web3Profile}_web3_profile`)
        setProfileOpen(true)
    }
    const component = useMemo(() => {
        const Component = getTabContent(componentTabId)
        const Utils = displayPlugins.find((x) => x.ID === selectedTabId)?.Utils

        return (
            <Component
                identity={identity}
                personaList={personaList?.map((x) => x.persona)}
                socialAddressList={addressList.filter((x) => Utils?.filter?.(x) ?? true).sort(Utils?.sorter)}
                open={profileOpen}
                setOpen={setProfileOpen}
            />
        )
    }, [
        profileOpen,
        componentTabId,
        displayPlugins.map((x) => x.ID).join(),
        personaList.join(),
        socialAddressList.map((x) => x.address).join(),
    ])

    useLocationChange(() => {
        setSelectedTab(undefined)
    })

    useUpdateEffect(() => {
        setSelectedTab(undefined)
    }, [identity.identifier?.userId])

    useEffect(() => {
        return MaskMessages.events.profileTabHidden.on((data) => {
            if (data.hidden) setHidden(data.hidden)
        })
    }, [identity.identifier?.userId])

    useEffect(() => {
        return MaskMessages.events.profileTabUpdated.on((data) => {
            setHidden(!data.show)
        })
    }, [identity.identifier?.userId])

    if (hidden) return null

    if (!identity.identifier?.userId || loadingSocialAddressList || loadingPersonaList)
        return (
            <div className={classes.root}>
                <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    sx={{ paddingTop: 4, paddingBottom: 4 }}>
                    <CircularProgress />
                </Box>
            </div>
        )

    return (
        <div className={classes.root}>
            <div>
                {tabs.length ? (
                    <ConcealableTabs<string>
                        tabs={tabs}
                        selectedId={selectedTabId}
                        onChange={setSelectedTab}
                        openDialog={handleOpenDialog}
                    />
                ) : (
                    <Typography variant="body2" color="textPrimary" align="center" sx={{ paddingTop: 8 }}>
                        {t('web3_tab_hint')}
                    </Typography>
                )}
            </div>
            <div className={classes.content}>{component}</div>
        </div>
    )
}
