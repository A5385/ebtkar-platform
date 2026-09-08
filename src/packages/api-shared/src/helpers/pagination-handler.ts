import { RequestKeys } from '@org/constants';
import { endOfDay, parse, startOfDay } from 'date-fns';

type SortDirection = 'asc' | 'desc';
export type QueryParams = Record<string, string | string[] | undefined>;

export type OrderedByType<T> = Partial<Record<keyof T, SortDirection>>;

export type FilterType<T> = keyof T;

export type ExtractedFilters<T, K extends keyof T> = Partial<Record<K, string>>;

export type ExtractRequestQueriesReturnType<T, K extends keyof T = keyof T> = {
    startDate?: string;
    endDate?: string;

    pagination: {
        skip: number;
        take: number;
    };

    orderBy?: OrderedByType<T>[];

    filters: ExtractedFilters<T, K>;
};

export type ExtractRequestQueriesProps<T, K extends keyof T = keyof T> = {
    query: QueryParams;

    page?: number;
    pageSize?: number;
    maxPageSize?: number;

    orderBy?: OrderedByType<T>[];

    filters?: readonly K[];
};

export function extractRequestQueries<T, K extends keyof T = keyof T>({
    query,
    page = 1,
    pageSize = 10,
    maxPageSize = 100,
    orderBy,
    filters,
}: ExtractRequestQueriesProps<T, K>): ExtractRequestQueriesReturnType<T, K> {
    const rawPage = Number(query[RequestKeys.page]);

    const rawPageSize = Number(query[RequestKeys.pageSize]);

    const queryPage = Number.isInteger(rawPage) && rawPage > 0 ? rawPage : page;

    const requestedPageSize =
        Number.isInteger(rawPageSize) && rawPageSize > 0 ? rawPageSize : pageSize;

    const pageSizeQuery = Math.min(requestedPageSize, maxPageSize);

    const rawStartDate = query[RequestKeys.startDate];

    const rawEndDate = query[RequestKeys.endDate];

    const startDate =
        typeof rawStartDate === 'string' && rawStartDate.trim() ? rawStartDate : undefined;

    const endDate = typeof rawEndDate === 'string' && rawEndDate.trim() ? rawEndDate : undefined;

    const extractedFilters = {} as ExtractedFilters<T, K>;

    filters?.forEach((filter) => {
        const value = query[String(filter)];

        if (typeof value === 'string' && value.trim() !== '') {
            extractedFilters[filter] = value;
        }
    });

    return {
        startDate,
        endDate,

        pagination: {
            take: pageSizeQuery,
            skip: (queryPage - 1) * pageSizeQuery,
        },

        orderBy,

        filters: extractedFilters,
    };
}

export const convertToStartDate = (value: string): Date | undefined => {
    const parsedDate = parse(value, 'dd/MM/yyyy', new Date());

    if (Number.isNaN(parsedDate.getTime())) {
        return undefined;
    }

    return startOfDay(parsedDate);
};

export const convertToEndDate = (value: string): Date | undefined => {
    const parsedDate = convertToStartDate(value);

    return parsedDate ? endOfDay(parsedDate) : undefined;
};
