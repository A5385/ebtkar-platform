import { useCallback, useMemo, useSyncExternalStore } from 'react';

type ParamValue = string | number | boolean | null | undefined;
type ParamsInput = Record<string, ParamValue>;

type UpdateOptions = {
    replace?: boolean;
};

const SEARCH_PARAMS_CHANGE_EVENT = 'search-params-change';

const subscribe = (callback: () => void) => {
    window.addEventListener('popstate', callback);
    window.addEventListener(SEARCH_PARAMS_CHANGE_EVENT, callback);

    return () => {
        window.removeEventListener('popstate', callback);
        window.removeEventListener(SEARCH_PARAMS_CHANGE_EVENT, callback);
    };
};

const getSnapshot = () => window.location.search;
const getServerSnapshot = () => '';

const updateUrl = (
    update: (params: URLSearchParams) => void,
    { replace = true }: UpdateOptions = {},
) => {
    const url = new URL(window.location.href);

    update(url.searchParams);

    if (replace) {
        window.history.replaceState(window.history.state, '', url);
    } else {
        window.history.pushState(window.history.state, '', url);
    }

    window.dispatchEvent(new Event(SEARCH_PARAMS_CHANGE_EVENT));
};

export const useSearchParams = () => {
    const search = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

    const searchParams = useMemo(() => new URLSearchParams(search), [search]);

    const get = useCallback((key: string): string | null => searchParams.get(key), [searchParams]);

    const getMultiple = useCallback(
        <T extends readonly string[]>(keys: T): Record<T[number], string | null> => {
            return Object.fromEntries(keys.map((key) => [key, searchParams.get(key)])) as Record<
                T[number],
                string | null
            >;
        },
        [searchParams],
    );

    const getAll = useCallback((): Record<string, string> => {
        return Object.fromEntries(searchParams.entries());
    }, [searchParams]);

    const set = useCallback((values: ParamsInput, options?: UpdateOptions) => {
        updateUrl((params) => {
            Object.entries(values).forEach(([key, value]) => {
                if (value === null || value === undefined) {
                    params.delete(key);
                } else {
                    params.set(key, String(value));
                }
            });
        }, options);
    }, []);

    const remove = useCallback((keys: string | string[], options?: UpdateOptions) => {
        updateUrl((params) => {
            const keysToRemove = Array.isArray(keys) ? keys : [keys];

            keysToRemove.forEach((key) => params.delete(key));
        }, options);
    }, []);

    const clear = useCallback((options?: UpdateOptions) => {
        updateUrl((params) => {
            Array.from(params.keys()).forEach((key) => params.delete(key));
        }, options);
    }, []);

    return {
        get,
        getMultiple,
        getAll,
        set,
        remove,
        clear,
        searchParams,
    };
};
