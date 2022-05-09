import { useEffect, useRef, useState } from 'react'
import { PluginId } from '@masknet/plugin-infra'
import { useActivatedPlugin } from '@masknet/plugin-infra/dom'
import { useChainId, useChainIdValid, useCurrentWeb3NetworkPluginID } from '@masknet/plugin-infra/web3'
import type { ChainId } from '@masknet/web3-shared-evm'
import { DialogContent } from '@mui/material'
import { useCurrentWeb3NetworkPluginID } from '@masknet/plugin-infra/web3'
import { ChainId, useAccount, useChainId, useChainIdValid } from '@masknet/web3-shared-evm'
import { Button, DialogContent, IconButton } from '@mui/material'
import { useRemoteControlledDialog } from '@masknet/shared-base-ui'
import { InjectedDialog } from '@masknet/shared'
import { AllProviderTradeContext } from '../../trader/useAllProviderTradeContext'
import { TargetChainIdContext } from '@masknet/plugin-infra/web3-evm'
import { PluginTraderMessages } from '../../messages'
import { Trader, TraderRef, TraderProps } from './Trader'
import { useI18N } from '../../../../utils'
import { makeStyles } from '@masknet/theme'
import { NetworkTab } from '../../../../components/shared/NetworkTab'
import { useUpdateEffect } from 'react-use'
import { isDashboardPage } from '@masknet/shared-base'
import { NetworkPluginID } from '@masknet/web3-shared-base'
import { GearIcon, RefreshIcon } from '@masknet/icons'

const useStyles = makeStyles()((theme) => ({
    walletStatusBox: {
        width: 535,
        margin: '24px auto',
    },
    abstractTabWrapper: {
        width: '100%',
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(2),
    },
    tab: {
        height: 36,
        minHeight: 36,
    },
    tabPaper: {
        backgroundColor: 'inherit',
    },
    tabs: {
        width: 535,
        height: 36,
        minHeight: 36,
        margin: '0 auto',
        borderRadius: 4,
    },
    indicator: {
        display: 'none',
    },
    tabPanel: {
        marginTop: theme.spacing(3),
    },
    content: {
        paddingTop: 0,
        '&::-webkit-scrollbar': {
            display: 'none',
        },
    },
    tradeRoot: {
        width: 535,
        margin: 'auto',
    },
    tail: {
        display: 'flex',
        gap: 8,
        '& > button': {
            padding: 0,
            width: 24,
            height: 24,
        },
    },
    icon: {
        fontSize: 24,
        fill: theme.palette.text.primary,
        cursor: 'pointer',
    },
}))

interface TraderDialogProps {
    open?: boolean
    onClose?: () => void
}

export function TraderDialog({ open, onClose }: TraderDialogProps) {
    const tradeRef = useRef<TraderRef>(null)
    const pluginID = useCurrentWeb3NetworkPluginID()
    const account = useAccount()
    const traderDefinition = useActivatedPlugin(PluginId.Trader, 'any')
    const chainIdList = traderDefinition?.enableRequirement.web3?.[pluginID]?.supportedChainIds ?? []
    const { t } = useI18N()
    const { classes } = useStyles()
    const currentChainId = useChainId(NetworkPluginID.PLUGIN_EVM)
    const chainIdValid = useChainIdValid(NetworkPluginID.PLUGIN_EVM)
    const [traderProps, setTraderProps] = useState<TraderProps>()
    const [chainId, setChainId] = useState<ChainId>(currentChainId)

    const { open: remoteOpen, closeDialog } = useRemoteControlledDialog(
        PluginTraderMessages.swapDialogUpdated,
        (ev) => {
            if (ev?.traderProps) setTraderProps(ev.traderProps)
        },
    )

    useEffect(() => {
        if (!chainIdValid) closeDialog()
    }, [chainIdValid, closeDialog])

    useUpdateEffect(() => {
        if (currentChainId) {
            setChainId(currentChainId)
        }
    }, [currentChainId])

    return (
        <TargetChainIdContext.Provider>
            <AllProviderTradeContext.Provider>
                <InjectedDialog
                    open={open || remoteOpen}
                    onClose={() => {
                        onClose?.()
                        setTraderProps(undefined)
                        closeDialog()
                    }}
                    title={t('plugin_trader_swap')}
                    titleTail={
                        <div className={classes.tail}>
                            <IconButton onClick={() => tradeRef.current?.refresh()}>
                                <RefreshIcon className={classes.icon} />
                            </IconButton>
                            <IconButton>
                                <GearIcon className={classes.icon} />
                            </IconButton>
                        </div>
                    }>
                    <DialogContent className={classes.content}>
                        <div className={classes.abstractTabWrapper}>
                            <NetworkTab
                                chainId={chainId}
                                /* @ts-ignore */
                                setChainId={setChainId}
                                classes={classes}
                                chains={chainIdList}
                            />
                        </div>
                        <Trader
                            {...traderProps}
                            chainId={chainId}
                            classes={{ root: classes.tradeRoot }}
                            ref={tradeRef}
                        />
                        {!account ? <Button fullWidth>{t('plugin_wallet_on_connect')}</Button> : null}
                    </DialogContent>
                </InjectedDialog>
            </AllProviderTradeContext.Provider>
        </TargetChainIdContext.Provider>
    )
}
