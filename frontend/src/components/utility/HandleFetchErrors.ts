import {redirect} from "next/navigation";

export function CheckErrors(response: any) {
    switch (response.status) {
        case 429:
            throw new Error('Too many requests')
        case 404:
            throw new Error('Not found')
        case 500:
            throw new Error('Server error')
        case 403:
            return redirect(
                `/login?errors=${process.env.NEXT_PUBLIC_ERRORS_UNAUTHORIZED}`
            );
        case 401:
            return redirect(
                `/login?errors=${process.env.NEXT_PUBLIC_ERRORS_NOT_LOGGED_IN}`
            );
    }
}