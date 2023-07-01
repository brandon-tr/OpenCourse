export function CheckAndThrowError(e: unknown) {
    if (e instanceof Error) {
        throw new Error(e.message);
    } else if (e instanceof String) {
        throw new Error(e.toString());
    } else {
        throw new Error('An unknown error occurred');
    }
}