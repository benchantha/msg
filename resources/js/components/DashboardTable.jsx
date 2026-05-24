import * as React from 'react';
import { IconCircleCheckFilled, IconDotsVertical, IconGripVertical, IconProgress, IconProgressAlert, IconProgressBolt, IconProgressX, IconViewportNarrow } from '@tabler/icons-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';

export function DashboardTable({ data }) {
    const [rowSelection, setRowSelection] = React.useState({});
    const selectedCount = Object.keys(rowSelection).filter(Boolean).length;

    const toggleAll = (checked) => {
        if (checked) {
            const all = {};
            data.forEach((_, i) => { all[i] = true; });
            setRowSelection(all);
        } else {
            setRowSelection({});
        }
    };

    const toggleRow = (index, checked) => {
        setRowSelection((prev) => (checked ? { ...prev, [index]: true } : { ...prev, [index]: false }));
    };

    return (
        <div className="rounded-xl border bg-card">
            <div className="flex flex-col gap-4 p-4 md:flex-row md:items-center md:justify-between">
                <Tabs defaultValue="outline" className="w-full md:w-auto">
                    <TabsList className="grid w-full grid-cols-4 md:inline-flex md:w-auto">
                        <TabsTrigger value="outline">Outline</TabsTrigger>
                        <TabsTrigger value="past">Past Performance (3)</TabsTrigger>
                        <TabsTrigger value="personnel">Key Personnel (2)</TabsTrigger>
                        <TabsTrigger value="focus">Focus Documents</TabsTrigger>
                    </TabsList>
                </Tabs>
                <div className="flex items-center gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                                Customize Columns
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem>Columns</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Header</DropdownMenuItem>
                            <DropdownMenuItem>Section Type</DropdownMenuItem>
                            <DropdownMenuItem>Status</DropdownMenuItem>
                            <DropdownMenuItem>Target</DropdownMenuItem>
                            <DropdownMenuItem>Limit</DropdownMenuItem>
                            <DropdownMenuItem>Reviewer</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Button size="sm">
                        <span className="size-4">+</span>
                        Add Section
                    </Button>
                </div>
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-8">
                            <IconGripVertical className="size-4 text-muted-foreground" />
                        </TableHead>
                        <TableHead className="w-12">
                            <Checkbox
                                checked={selectedCount === data.length && data.length > 0}
                                onCheckedChange={toggleAll}
                                aria-label="Select all"
                            />
                        </TableHead>
                        <TableHead>Header</TableHead>
                        <TableHead>Section Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Target</TableHead>
                        <TableHead>Limit</TableHead>
                        <TableHead>Reviewer</TableHead>
                        <TableHead className="w-12" />
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((row, index) => (
                        <TableRow key={row.id}>
                            <TableCell className="text-muted-foreground">
                                <IconGripVertical className="size-4" />
                            </TableCell>
                            <TableCell>
                                <Checkbox
                                    checked={!!rowSelection[index]}
                                    onCheckedChange={(checked) => toggleRow(index, !!checked)}
                                    aria-label="Select row"
                                />
                            </TableCell>
                            <TableCell className="font-medium">{row.header}</TableCell>
                            <TableCell>
                                <Badge variant="outline">{row.type}</Badge>
                            </TableCell>
                            <TableCell>
                                {row.status === 'Done' ? (
                                    <Badge variant="default" className="gap-1">
                                        <IconCircleCheckFilled className="size-3" />
                                        {row.status}
                                    </Badge>
                                ) : (
                                    <Badge variant="secondary">
                                         <IconProgress className="size-3" />
                                        {row.status}
                                    </Badge>
                                )}
                            </TableCell>
                            <TableCell>{row.target}</TableCell>
                            <TableCell>{row.limit}</TableCell>
                            <TableCell>{row.reviewer}</TableCell>
                            <TableCell>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="size-8">
                                            <IconDotsVertical className="size-4" />
                                            <span className="sr-only">Open menu</span>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem>Edit</DropdownMenuItem>
                                        <DropdownMenuItem>Make a copy</DropdownMenuItem>
                                        <DropdownMenuItem>Favorite</DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <div className="flex items-center justify-between px-4 py-2 text-sm text-muted-foreground">
                <span>
                    {selectedCount} of {data.length} row(s) selected.
                </span>
            </div>
        </div>
    );
}
