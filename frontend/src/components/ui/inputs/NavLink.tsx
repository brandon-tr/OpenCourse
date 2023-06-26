import {forwardRef} from "react";
import NextLink from "next/link";
import {useUiStore} from "@/components/store/Store";

function isModifiedEvent(event: React.MouseEvent): boolean {
    const eventTarget = event.currentTarget as HTMLAnchorElement | SVGAElement;
    const target = eventTarget.getAttribute("target");
    return (
        (target && target !== "_self") ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey || // triggers resource download
        (event.nativeEvent && event.nativeEvent.which === 2)
    );
}

const Link = forwardRef<HTMLAnchorElement, React.ComponentProps<"a">>(function Link(
    {href, onClick, ...rest},
    ref,
) {
    const {loadingState, setLoadingState} = useUiStore(state => ({
        loadingState: state.loadingState,
        setLoadingState: state.setLoadingState
    }))
    const useLink = href && href.startsWith("/");
    if (!useLink) return <a href={href} onClick={onClick} {...rest} />;

    return (
        <NextLink
            href={href}
            onClick={(event) => {
                if (!isModifiedEvent(event)) {
                    const {pathname, search, hash} = window.location;
                    if (href !== pathname + search + hash) setLoadingState(true);
                }
                if (onClick) onClick(event);
            }}
            {...rest}
            ref={ref}
        />
    );
});

export default Link;