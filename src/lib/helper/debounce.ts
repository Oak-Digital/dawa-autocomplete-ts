export function debounce<A = unknown, R = void>(
    fn: (args: A) => R,
    ms: number,
    maxWait: number
): [(args: A) => Promise<R>, () => void] {
    let timer: number | undefined;
    let lastInvokeTime: number | undefined;

    const debouncedFunc = (args: A): Promise<R> =>
        new Promise((resolve) => {
            if (lastInvokeTime && Date.now() < lastInvokeTime + maxWait) {
                if (timer) {
                    window.clearTimeout(timer);
                }
                timer = window.setTimeout(() => {
                    lastInvokeTime = Date.now();
                    resolve(fn(args));
                }, ms);
            } else {
                lastInvokeTime = Date.now();
                resolve(fn(args));
            }
        });

    const teardown = () => {
        if (timer) {
            window.clearTimeout(timer);
        }
    };

    return [debouncedFunc, teardown];
}
