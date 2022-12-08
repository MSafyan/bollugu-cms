import { Icon } from '@iconify/react';
import { Button } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { ErrorDialogIcon, SuccessDialogIcon, WarningDialogIcon } from 'src/config/icons';
import palette from 'src/theme/palette';


export default ({ warning, error, buttonText, buttonText2, openDialog, handleButton, handleButton2, children, icon, disabledButton1, disabledButton2 }) => {

    let ico = SuccessDialogIcon;
    let color = palette.success.dialog;
    if (error) {
        ico = ErrorDialogIcon;
        color = palette.error.dialog;
    }

    if (warning) {
        ico = WarningDialogIcon;
        color = palette.warning.dialog;
    }
    if (icon)
        ico = icon;
    return (
        <Dialog
            maxWidth='xl'
            open={openDialog}
            onClose={handleButton}
            aria-labelledby="alert-dialog-title"
            PaperProps={{
                style: {
                    overflow: "visible",
                    width: 280
                },
            }}
        >
            <DialogTitle id="alert-dialog-title" style={{ overflow: "visible" }}>
                <div style={{ color, justifyContent: "center", display: 'flex' }}>
                    <Icon style={{ marginTop: -40, overflow: "visible" }} icon={ico} width={80} height={80} />
                </div>
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    <div style={{ color: "black", textAlign: "center" }}>
                        {children}
                    </div>
                </DialogContentText>
            </DialogContent>
            <DialogActions style={{ padding: 10 }}>
                <Button disabled={disabledButton1} onClick={handleButton} variant="contained" autoFocus>
                    {buttonText}
                </Button>
                {
                    buttonText2 && <Button disabled={disabledButton2} onClick={handleButton2} variant="contained" autoFocus>
                        {buttonText2}
                    </Button>
                }
            </DialogActions>
        </Dialog>
    );
};
