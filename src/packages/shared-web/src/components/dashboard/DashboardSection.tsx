import { colors } from '@org/constants';
import React, { JSX } from 'react';
import { cn } from '../../lib';
export type DashboardSectionProps = {
    children?: React.ReactNode;
    className?: string;
    pageTitle?: string;
    pageIcon?: JSX.Element;
    sectionTitle?: string;
    sectionIcon?: JSX.Element;
};

export const DashboardSection = ({
    children,
    className,
    sectionTitle,
    sectionIcon,
    pageTitle,
    pageIcon,
}: DashboardSectionProps) => {
    const icon = pageIcon
        ? React.cloneElement(pageIcon, { color: colors.main, size: 50 })
        : undefined;
    return (
        <section
            className={cn(
                'bg-background text-foreground shadow-md rounded-xl py-6 px-4',
                className,
            )}
        >
            {(pageIcon || pageTitle) && (
                <div className='flex items-center gap-2 text-4xl font-semibold'>
                    {icon && icon}
                    {pageTitle && <h1>{pageTitle}</h1>}
                </div>
            )}
            {(sectionIcon || sectionTitle) && (
                <div className='flex items-center gap-2 text-4xl font-semibold'>
                    {sectionIcon && sectionIcon}
                    {sectionTitle && <h1>{sectionTitle}</h1>}
                </div>
            )}
            {children && children}
        </section>
    );
};
