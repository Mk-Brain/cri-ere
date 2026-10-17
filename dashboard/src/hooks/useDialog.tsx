import React from "react";

export function useDialog(){
    const [dialogs, setDialogs] = React.useState<Dialog[]>([]);

    const openDialog = React.useCallback((dialog: Dialog) => {
        setDialogs((prevDialogs) => [...prevDialogs, dialog]);
    }, []);

    const closeDialog = React.useCallback((id: string) => {
        setDialogs((prevDialogs) =>
            prevDialogs.filter((dialog) => dialog.id !== id)
        );
    }, []);

    return {
        dialogs,
        openDialog,
        closeDialog,
    };
}