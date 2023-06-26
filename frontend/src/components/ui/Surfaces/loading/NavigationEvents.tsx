'use client'

import {Suspense, useEffect} from 'react'
import {usePathname, useSearchParams} from 'next/navigation'
import LoadingBar from "@/components/ui/Surfaces/loading/LoadingBar";
import {useUiStore} from "@/components/store/Store";

export function NavigationEvents() {
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const {loadingState, setLoadingState} = useUiStore(state => ({
        loadingState: state.loadingState,
        setLoadingState: state.setLoadingState
    }))

    useEffect(() => {
        setLoadingState(true)
    }, []);

    useEffect(() => {
        setLoadingState(false)
    }, [pathname, searchParams])

    return (
        <Suspense>{loadingState ? <LoadingBar/> : null}</Suspense>
    )
}