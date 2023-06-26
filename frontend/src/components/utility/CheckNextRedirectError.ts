import {redirect} from "next/navigation";

export default function HandleRouteRedirectError(e: any) {
    if (e?.digest?.includes("NEXT_REDIRECT")) {
        return redirect(e.digest.split(";")[2]);
    } else {
        return redirect(`/login?errors=unknown`);
    }
}