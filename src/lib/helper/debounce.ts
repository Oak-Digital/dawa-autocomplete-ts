export function debounce<A = unknown, R = void>(
    fn: (args: A) => R,
    ms = 300,
    maxWait = 500
): [(args: A) => Promise<R>, () => void] {
    let timer: NodeJS.Timeout;
    let lastInvokeTime: number | undefined;

    const debouncedFunc = (args: A): Promise<R> =>
        new Promise((resolve) => {
            if (lastInvokeTime && Date.now() < lastInvokeTime + maxWait) {
                if (timer) {
                    clearTimeout(timer);
                }
                timer = setTimeout(() => {
                    lastInvokeTime = Date.now();
                    resolve(fn(args));
                }, ms);
            } else {
                lastInvokeTime = Date.now();
                resolve(fn(args));
            }
        });

    const teardown = () => clearTimeout(timer);

    return [debouncedFunc, teardown];
}
