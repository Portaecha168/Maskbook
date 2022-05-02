import { useDashboardI18N } from '../../locales'
import { memo } from 'react'
import { getMaskColor, makeStyles, MaskDialog } from '@masknet/theme'
import { Button, DialogActions, DialogContent, Stack, Typography } from '@mui/material'
import { Icon } from '@masknet/icons'

export interface ConfirmSynchronizePasswordDialogProps {
    open: boolean
    onClose(): void
    onConform(): void
}

const useStyles = makeStyles()((theme) => ({
    successIcon: {
        [theme.breakpoints.down('xs')]: {
            fontSize: 54,
        },
    },
}))

export const ConfirmSynchronizePasswordDialog = memo<ConfirmSynchronizePasswordDialogProps>(
    ({ open, onClose, onConform }) => {
        const t = useDashboardI18N()
        const { classes } = useStyles()

        return (
            <MaskDialog open={open} title={t.cloud_backup()} onClose={onClose} maxWidth="xs">
                <DialogContent>
                    <Stack alignItems="center" py={2}>
                        <Icon type="success" className={classes.successIcon} />
                        <Typography variant="caption" sx={{ color: (t) => getMaskColor(t).greenMain }} fontSize={24}>
                            {t.successful()}
                        </Typography>
                    </Stack>
                    <Typography variant="caption">
                        {t.sign_in_account_cloud_backup_synchronize_password_tip()}
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button color="secondary" onClick={onClose}>
                        {t.personas_cancel()}
                    </Button>
                    <Button onClick={onConform}>{t.personas_confirm()}</Button>
                </DialogActions>
            </MaskDialog>
        )
    },
)
