import { useEffect, useMemo, useState } from 'react';
import { useForm, usePage, router } from '@inertiajs/react';
import { AppLayout } from '@/Layouts/AppLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Pagination } from '@/components/Pagination';
import { ConfirmAlertDialog } from '@/components/ConfirmAlertDialog';
import { Combobox } from '@/components/ui/combobox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/AppSonner';
import { cn } from '@/lib/utils';
import {
    IconDots,
    IconPlus,
    IconSearch,
    IconTrash,
} from '@tabler/icons-react';

function VehicleTypeHeaderActions({ onNewClick, search, onSearchChange }) {
    return (
        <div className="border-0 shadow-none">
            <div className="flex flex-col gap-2 px-0 md:flex-row md:items-center md:justify-end">
                <div className="flex w-full justify-end gap-2">
                    <div className="flex items-center">
                        <div className="relative w-full max-w-xs md:max-w-sm">
                            <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-muted-foreground">
                                <IconSearch className="size-4" />
                            </span>
                            <Input
                                type="search"
                                placeholder="Search by code or title"
                                value={search}
                                onChange={(e) => onSearchChange(e.target.value)}
                                className="h-8 rounded-full pl-9 text-sm"
                            />
                        </div>
                    </div>
                    <Button size="sm" className="rounded-full px-4" onClick={onNewClick}>
                        <IconPlus className="mr-1 size-4" />
                        New
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default function VehicleType({
    vehicleTypes,
    companies = [],
    search: initialSearch = '',
}) {
    const { errors } = usePage().props;
    const [editingUuid, setEditingUuid] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [search, setSearch] = useState(initialSearch || '');

    const { data, setData, post, put, reset, processing } = useForm({
        code: '',
        company_id: '',
        title: '',
        title_1: '',
        title_2: '',
        picture_url: '',
        order: 0,
        capacity_unit: 'seat',
        capacity: '1',
    });

    const vehicleTypeItems = useMemo(() => {
        if (!vehicleTypes) return [];
        return Array.isArray(vehicleTypes) ? vehicleTypes : vehicleTypes.data ?? [];
    }, [vehicleTypes]);

    const pagination = !Array.isArray(vehicleTypes) ? vehicleTypes : null;

    const companyOptions = useMemo(
        () =>
            (companies ?? []).map((c) => ({
                id: String(c.id),
                name: c.name ?? `Company #${c.id}`,
            })),
        [companies],
    );

    const resetForm = () => {
        setEditingUuid(null);
        reset({
            code: '',
            company_id: '',
            title: '',
            title_1: '',
            title_2: '',
            picture_url: '',
            order: 0,
            capacity_unit: 'seat',
            capacity: '1',
        });
    };

    const handleNewClick = () => {
        resetForm();
        setDialogOpen(true);
    };

    const startEdit = (item) => {
        setEditingUuid(item.uuid);
        setData({
            code: item.code ?? '',
            company_id: item.company_id ? String(item.company_id) : '',
            title: item.title ?? '',
            title_1: item.title_1 ?? '',
            title_2: item.title_2 ?? '',
            picture_url: item.picture_url ?? '',
            order: item.order ?? 0,
            capacity_unit: item.capacity_unit ?? 'seat',
            capacity: String(item.capacity ?? '1'),
        });
        setDialogOpen(true);
    };

    useEffect(() => {
        const normalized = initialSearch || '';
        if (search === normalized) return;
        const timeout = setTimeout(() => {
            router.get('/vehicle-types', { search }, {
                preserveState: true,
                replace: true,
                preserveScroll: true,
            });
        }, 300);
        return () => clearTimeout(timeout);
    }, [search, initialSearch]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const isEdit = !!editingUuid;
        const onSuccess = () => {
            resetForm();
            setDialogOpen(false);
            toast.success(isEdit ? 'Vehicle type updated.' : 'Vehicle type created.');
        };
        if (editingUuid) {
            put(`/vehicle-types/${editingUuid}`, { preserveScroll: true, onSuccess });
        } else {
            post('/vehicle-types', { preserveScroll: true, onSuccess });
        }
    };

    const handleDelete = (item) => {
        if (!item) return;
        router.delete(`/vehicle-types/${item.uuid}`, {
            preserveScroll: true,
            onSuccess: () => {
                setDeleteDialogOpen(false);
                setItemToDelete(null);
                toast.success('Vehicle type deleted.');
            },
        });
    };

    const headerActions = (
        <VehicleTypeHeaderActions
            onNewClick={handleNewClick}
            search={search}
            onSearchChange={setSearch}
        />
    );

    return (
        <AppLayout title="Vehicle Type" subHeader={headerActions}>
            <div className="space-y-6">
                <Dialog
                    open={dialogOpen}
                    onOpenChange={(open) => {
                        setDialogOpen(open);
                        if (!open) resetForm();
                    }}
                >
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>
                                {editingUuid ? 'Edit Vehicle Type' : 'Create Vehicle Type'}
                            </DialogTitle>
                            <DialogDescription>
                                {editingUuid
                                    ? 'Update the vehicle type details below.'
                                    : 'Fill in the details to create a new vehicle type.'}
                            </DialogDescription>
                        </DialogHeader>
                        <form key={editingUuid ?? 'new'} onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="code">Code</Label>
                                <Input
                                    id="code"
                                    value={data.code}
                                    onChange={(e) => setData('code', e.target.value)}
                                    className={cn(errors?.code && 'border-destructive')}
                                />
                                {errors?.code && (
                                    <p className="text-sm text-destructive">{errors.code}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="company_id">Company</Label>
                                <Combobox
                                    items={companyOptions}
                                    value={data.company_id}
                                    onValueChange={(v) => setData('company_id', v || '')}
                                    placeholder="Select company"
                                    searchPlaceholder="Search company..."
                                    emptyText="No company found."
                                    itemToStringValue={(i) => i.name}
                                    itemToValue={(i) => i.id}
                                    triggerClassName={cn(errors?.company_id && 'border-destructive')}
                                />
                                {errors?.company_id && (
                                    <p className="text-sm text-destructive">{errors.company_id}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="title">Title</Label>
                                <Input
                                    id="title"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    className={cn(errors?.title && 'border-destructive')}
                                />
                                {errors?.title && (
                                    <p className="text-sm text-destructive">{errors.title}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="title_1">Title 1</Label>
                                <Input
                                    id="title_1"
                                    value={data.title_1}
                                    onChange={(e) => setData('title_1', e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="title_2">Title 2</Label>
                                <Input
                                    id="title_2"
                                    value={data.title_2}
                                    onChange={(e) => setData('title_2', e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="capacity_unit">Capacity unit</Label>
                                <Select
                                    value={data.capacity_unit}
                                    onValueChange={(v) => setData('capacity_unit', v)}
                                >
                                    <SelectTrigger id="capacity_unit" className="w-full">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="seat">Seat</SelectItem>
                                        <SelectItem value="ton">Ton</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="order">Order</Label>
                                <Input
                                    id="order"
                                    type="number"
                                    min={0}
                                    value={data.order}
                                    onChange={(e) => setData('order', parseInt(e.target.value, 10) || 0)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="capacity">Capacity</Label>
                                <Input
                                    id="capacity"
                                    type="number"
                                    min={0}
                                    step="0.01"
                                    value={data.capacity}
                                    onChange={(e) => setData('capacity', e.target.value)}
                                    className={cn(errors?.capacity && 'border-destructive')}
                                />
                                {errors?.capacity && (
                                    <p className="text-sm text-destructive">{errors.capacity}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="picture_url">Picture URL</Label>
                                <Input
                                    id="picture_url"
                                    value={data.picture_url}
                                    onChange={(e) => setData('picture_url', e.target.value)}
                                />
                            </div>
                            <DialogFooter className="md:col-span-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setDialogOpen(false)}
                                    disabled={processing}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    {processing
                                        ? (editingUuid ? 'Saving...' : 'Creating...')
                                        : (editingUuid ? 'Save changes' : 'Create')}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                <Card>
                    <CardContent>
                        {vehicleTypeItems.length === 0 ? (
                            <p className="text-sm text-muted-foreground">
                                No vehicle types found. Create one above.
                            </p>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Code</TableHead>
                                        <TableHead>Company</TableHead>
                                        <TableHead>Title</TableHead>
                                        <TableHead>Capacity</TableHead>
                                        <TableHead>Unit</TableHead>
                                        <TableHead>Created</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {vehicleTypeItems.map((item) => (
                                        <TableRow key={item.uuid}>
                                            <TableCell>{item.code}</TableCell>
                                            <TableCell className="max-w-xs truncate">
                                                {item.company?.name ?? '-'}
                                            </TableCell>
                                            <TableCell className="max-w-xs truncate">
                                                {item.title}
                                            </TableCell>
                                            <TableCell>{item.capacity}</TableCell>
                                            <TableCell className="capitalize">
                                                {item.capacity_unit}
                                            </TableCell>
                                            <TableCell>
                                                {item.created_at
                                                    ? new Date(item.created_at).toLocaleString()
                                                    : ''}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
                                                        >
                                                            <IconDots className="size-3.5" />
                                                            <span className="sr-only">Open actions</span>
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="min-w-[140px] rounded-lg">
                                                        <DropdownMenuItem
                                                            onClick={() => startEdit(item)}
                                                        >
                                                            Edit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            variant="destructive"
                                                            onSelect={(e) => e.preventDefault()}
                                                            onClick={() => {
                                                                setItemToDelete(item);
                                                                setDeleteDialogOpen(true);
                                                            }}
                                                        >
                                                            Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                        <Pagination
                            pagination={pagination}
                            emptyCount={vehicleTypeItems.length}
                            label="vehicle types"
                        />
                    </CardContent>
                </Card>

                <ConfirmAlertDialog
                    open={deleteDialogOpen}
                    onOpenChange={(open) => {
                        setDeleteDialogOpen(open);
                        if (!open) setItemToDelete(null);
                    }}
                    title="Delete vehicle type"
                    icon={
                        <span className="flex size-7 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                            <IconTrash className="size-4" />
                        </span>
                    }
                    confirmLabel="Delete"
                    cancelLabel="Cancel"
                    confirmClassName="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    confirmDisabled={!itemToDelete}
                    onConfirm={() => handleDelete(itemToDelete)}
                >
                    This will permanently delete{' '}
                    <span className="font-semibold text-foreground">
                        {itemToDelete?.title ?? 'this vehicle type'}
                    </span>{' '}
                    and remove it from all lists. This action cannot be undone.
                </ConfirmAlertDialog>
            </div>
        </AppLayout>
    );
}
