import { ReactNode } from 'react';
import { cn } from '../lib/utils';

export type ColsType = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
export const GridMapper = {
    1: 'grid-cols-1', // Single column (full width)
    2: 'grid-cols-2', // 1 → 2 columns
    3: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3', // 1 → 2 → 3
    4: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4', // 1 → 2 → 3 → 4
    5: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5', // 1 → 2 → 3 → 5
    6: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6', // 1 → 2 → 3 → 6
    7: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7', // 1 → 2 → 3 → 4 → 7
    8: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8', // 1 → 2 → 4 → 6 → 8
    9: 'grid-cols-1 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 xl:grid-cols-9', // 1 → 3 → 5 → 7 → 9
    10: 'grid-cols-1 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-8 xl:grid-cols-10', // 1 → 3 → 5 → 8 → 10
    11: 'grid-cols-1 sm:grid-cols-3 md:grid-cols-6 lg:grid-cols-9 xl:grid-cols-11', // 1 → 3 → 6 → 9 → 11
    12: 'grid-cols-1 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-12', // 1 → 4 → 6 → 8 → 12
} satisfies Record<ColsType, string>;

export type GridWrapperProps = {
    children?: ReactNode;
    cols?: ColsType;
    className?: string;
};
const GridWrapper = ({ children, cols = 1, className }: GridWrapperProps) => {
    return <div className={cn(className, 'grid gap-4', GridMapper[cols])}>{children}</div>;
};

export default GridWrapper;
