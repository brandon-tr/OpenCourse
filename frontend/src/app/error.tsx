'use client'

import CenteredLayout from "@/components/ui/layout/Container";
import Alert from "@/components/ui/Surfaces/Alerts/Alert";
import {useUiStore} from "@/components/store/Store";
import {useEffect} from "react";
import MaterialButton from "@/components/ui/inputs/MaterialButton";

export default function Error({
                                  error,
                                  reset,
                              }: {
    error: Error
    reset: () => void
}) {
    const {alert, hideAlert, showAlert} = useUiStore((state) => ({
        alert: state.alert,
        hideAlert: state.hideAlert,
        showAlert: state.showAlert,
    }));
    useEffect(() => {
        showAlert(error.message, "error")
    }, []);


    return (
        <CenteredLayout>
            <Alert alwaysShow={true}/>
            <div className={'mt-3 w-100'}>
                <MaterialButton onClick={
                    () => reset()
                } size={'full'}>Reset</MaterialButton>
            </div>

        </CenteredLayout>
    )
}