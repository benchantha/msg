import { router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';

export function Pagination({ pagination, emptyCount = 0, label = 'items' }) {
    if (!pagination || !pagination.links || pagination.links.length === 0) {
        return null;
    }

    const perPageOptions = [10, 25, 50, 100];
    const from = pagination.from ?? (emptyCount === 0 ? 0 : 1);
    const to = pagination.to ?? emptyCount;
    const total = pagination.total ?? emptyCount;
    const currentPerPage = pagination.per_page ?? perPageOptions[0];
    const currentPage = pagination.current_page ?? 1;
    const lastPage = pagination.last_page ?? 1;
    const prevUrl = pagination.prev_page_url;
    const nextUrl = pagination.next_page_url;

    // Build a map of pageNumber -> link (for numeric labels) from Laravel's paginator links.
    const numericLinkMap = (pagination.links || []).reduce((acc, link) => {
        const label = String(link.label).trim();
        if (/^\d+$/.test(label)) {
            acc[Number(label)] = link;
        }
        return acc;
    }, {});

    // Decide which page numbers and ellipses to show, similar to the reference UI.
    const displayItems = [];

    if (lastPage <= 5) {
        // Few pages: show all numbers.
        for (let page = 1; page <= lastPage; page += 1) {
            displayItems.push({ type: 'page', page });
        }
    } else {
        if (currentPage <= 3) {
            // Near the start: 1 2 3 ... (optionally 4), then ellipsis.
            for (let page = 1; page <= 3; page += 1) {
                displayItems.push({ type: 'page', page });
            }
            displayItems.push({ type: 'ellipsis' });
        } else if (currentPage >= lastPage - 2) {
            // Near the end: ... last-2 last-1 last
            displayItems.push({ type: 'ellipsis' });
            for (let page = lastPage - 2; page <= lastPage; page += 1) {
                displayItems.push({ type: 'page', page });
            }
        } else {
            // In the middle: 1 ... (current-1) current (current+1) ... last
            displayItems.push({ type: 'page', page: 1 });
            displayItems.push({ type: 'ellipsis' });
            for (let page = currentPage - 1; page <= currentPage + 1; page += 1) {
                displayItems.push({ type: 'page', page });
            }
            displayItems.push({ type: 'ellipsis' });
        }
    }

    const handlePerPageChange = (value) => {
        if (typeof window === 'undefined') return;

        const searchParams = new URLSearchParams(window.location.search);
        searchParams.set('per_page', value);
        searchParams.set('page', '1');

        const url = `${pagination.path}?${searchParams.toString()}`;

        router.get(url, {}, {
            preserveScroll: true,
            preserveState: true,
        });
    };

    const goTo = (url) => {
        if (!url) return;
        router.get(url, {}, {
            preserveScroll: true,
            preserveState: true,
        });
    };

    return (
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>Rows per page</span>
                <Select
                    value={String(currentPerPage)}
                    onValueChange={handlePerPageChange}
                >
                    <SelectTrigger size="sm" className="h-7 px-2 text-xs">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent align="end">
                        {perPageOptions.map((option) => (
                            <SelectItem key={option} value={String(option)}>
                                {option}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground sm:justify-end">
                <span>
                    {from}-{to} of {total} {label}
                </span>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                        {displayItems.map((item, index) => {
                            if (item.type === 'ellipsis') {
                                return (
                                    <span
                                        key={`ellipsis-${index}`}
                                        className="px-1 text-xs text-muted-foreground"
                                    >
                                        ...
                                    </span>
                                );
                            }

                            const page = item.page;
                            const link = numericLinkMap[page] || {};
                            const isActive = page === currentPage;

                            return (
                                <Button
                                    key={`page-${page}`}
                                    variant={isActive ? 'default' : 'ghost'}
                                    size="sm"
                                    className="h-7 w-7 px-0 text-xs"
                                    disabled={isActive || !link.url}
                                    onClick={() => {
                                        if (!link.url || isActive) return;
                                        goTo(link.url);
                                    }}
                                >
                                    {page}
                                </Button>
                            );
                        })}
                    </div>
                    <div className="flex items-center gap-1">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2 text-xs"
                            disabled={!prevUrl}
                            onClick={() => goTo(prevUrl)}
                        >
                            <IconChevronLeft className="mr-1 size-3.5" />
                            Previous
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2 text-xs"
                            disabled={!nextUrl}
                            onClick={() => goTo(nextUrl)}
                        >
                            Next
                            <IconChevronRight className="ml-1 size-3.5" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

