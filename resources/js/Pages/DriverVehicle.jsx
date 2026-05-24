import { useEffect, useMemo, useState } from 'react';
import { useForm, usePage, router } from '@inertiajs/react';
import { AppLayout } from '@/Layouts/AppLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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
import { toast } from '@/components/AppSonner';
import { cn } from '@/lib/utils';
import {
    IconDots,
    IconFilter,
    IconPlus,
    IconSearch,
    IconTrash,
} from '@tabler/icons-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

function DriverVehicleHeaderActions({ onNewClick, search, onSearchChange, filterVehicleType, onFilterChange, filterOpen, onFilterOpenChange, vehicleTypeOptions }) {
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
                                placeholder="Search by plate, color, model, or driver"
                                value={search}
                                onChange={(e) => onSearchChange(e.target.value)}
                                className="h-8 rounded-full pl-9 text-sm"
                            />
                        </div>
                    </div>
                    <Popover open={filterOpen} onOpenChange={onFilterOpenChange}>
                        <PopoverTrigger asChild>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className={cn('rounded-full gap-1.5', filterVehicleType && 'border-primary')}
                            >
                                <IconFilter className="size-4" />
                                Filter
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80" align="end">
                            <div className="space-y-3">
                                <h4 className="text-sm font-medium border-b border-border pb-2">Filters</h4>
                                <div className="space-y-1.5">
                                    <Label className="text-sm">Vehicle</Label>
                                    <Select
                                        value={filterVehicleType || 'all'}
                                        onValueChange={(v) => onFilterChange(v === 'all' ? '' : v)}
                                    >
                                        <SelectTrigger size="sm" className="w-full">
                                            <SelectValue placeholder="All vehicles" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All</SelectItem>
                                            {(vehicleTypeOptions ?? []).map((vt) => (
                                                <SelectItem key={vt.id} value={vt.id}>
                                                    {vt.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </PopoverContent>
                    </Popover>
                    <Button size="sm" className="rounded-full px-4" onClick={onNewClick}>
                        <IconPlus className="mr-1 size-4" />
                        New
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default function DriverVehicle({
    driverVehicles,
    clients = [],
    vehicleTypes = [],
    search: initialSearch = '',
    filterVehicleType: initialFilterVehicleType = '',
}) {
    const { errors } = usePage().props;
    const [editingUuid, setEditingUuid] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [search, setSearch] = useState(initialSearch || '');
    const [filterVehicleType, setFilterVehicleType] = useState(initialFilterVehicleType || '');
    const [filterOpen, setFilterOpen] = useState(false);

    const { data, setData, post, put, reset, processing } = useForm({
        client_id: '',
        vehicle_type_id: '',
        plat_number: '',
        color: '',
        year: '',
        model: '',
        doc_vehicle_id_url: '',
        doc_vehicle_inspection_cert_url: '',
        is_active: true,
    });

    const driverVehicleItems = useMemo(() => {
        if (!driverVehicles) return [];
        return Array.isArray(driverVehicles) ? driverVehicles : driverVehicles.data ?? [];
    }, [driverVehicles]);

    const pagination = !Array.isArray(driverVehicles) ? driverVehicles : null;

    const clientOptions = useMemo(
        () =>
            (clients ?? []).map((c) => ({
                id: String(c.id),
                name: [c.first_name, c.last_name].filter(Boolean).join(' ') || c.account_code || `Client #${c.id}`,
            })),
        [clients],
    );

    const vehicleTypeOptions = useMemo(
        () =>
            (vehicleTypes ?? []).map((vt) => ({
                id: String(vt.id),
                name: vt.title || vt.code || `Vehicle Type #${vt.id}`,
            })),
        [vehicleTypes],
    );

    const resetForm = () => {
        setEditingUuid(null);
        reset({
            client_id: '',
            vehicle_type_id: '',
            plat_number: '',
            color: '',
            year: '',
            model: '',
            doc_vehicle_id_url: '',
            doc_vehicle_inspection_cert_url: '',
            is_active: true,
        });
    };

    const handleNewClick = () => {
        resetForm();
        setDialogOpen(true);
    };

    const startEdit = (item) => {
        setEditingUuid(item.uuid);
        setData({
            client_id: item.client_id ? String(item.client_id) : '',
            vehicle_type_id: item.vehicle_type_id ? String(item.vehicle_type_id) : '',
            plat_number: item.plat_number ?? '',
            color: item.color ?? '',
            year: item.year ? String(item.year) : '',
            model: item.model ?? '',
            doc_vehicle_id_url: item.doc_vehicle_id_url ?? '',
            doc_vehicle_inspection_cert_url: item.doc_vehicle_inspection_cert_url ?? '',
            is_active: item.is_active ?? true,
        });
        setDialogOpen(true);
    };

    useEffect(() => {
        const normalized = initialSearch || '';
        const filterNormalized = initialFilterVehicleType || '';
        const filtersChanged = filterVehicleType !== filterNormalized;
        if (search === normalized && !filtersChanged) return;
        const params = { search: search || undefined };
        if (filterVehicleType) params.filter_vehicle_type = filterVehicleType;
        const timeout = setTimeout(
            () =>
                router.get('/driver-vehicles', params, {
                    preserveState: true,
                    replace: true,
                    preserveScroll: true,
                }),
            search !== normalized ? 300 : 0,
        );
        return () => clearTimeout(timeout);
    }, [search, initialSearch, filterVehicleType, initialFilterVehicleType]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const isEdit = !!editingUuid;
        const onSuccess = () => {
            resetForm();
            setDialogOpen(false);
            toast.success(isEdit ? 'Driver vehicle updated.' : 'Driver vehicle created.');
        };
        if (editingUuid) {
            put(`/driver-vehicles/${editingUuid}`, { preserveScroll: true, onSuccess });
        } else {
            post('/driver-vehicles', { preserveScroll: true, onSuccess });
        }
    };

    const handleDelete = (item) => {
        if (!item) return;
        router.delete(`/driver-vehicles/${item.uuid}`, {
            preserveScroll: true,
            onSuccess: () => {
                setDeleteDialogOpen(false);
                setItemToDelete(null);
                toast.success('Driver vehicle deleted.');
            },
        });
    };

    const headerActions = (
        <DriverVehicleHeaderActions
            onNewClick={handleNewClick}
            search={search}
            onSearchChange={setSearch}
            filterVehicleType={filterVehicleType}
            onFilterChange={setFilterVehicleType}
            filterOpen={filterOpen}
            onFilterOpenChange={setFilterOpen}
            vehicleTypeOptions={vehicleTypeOptions}
        />
    );

    const getDriverName = (item) => {
        const c = item.client;
        if (!c) return '-';
        return [c.first_name, c.last_name].filter(Boolean).join(' ') || c.account_code || '-';
    };

    return (
        <AppLayout title="Driver Vehicles" subHeader={headerActions}>
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
                                {editingUuid ? 'Edit Driver Vehicle' : 'Create Driver Vehicle'}
                            </DialogTitle>
                            <DialogDescription>
                                {editingUuid
                                    ? 'Update the driver vehicle details below.'
                                    : 'Fill in the details to create a new driver vehicle.'}
                            </DialogDescription>
                        </DialogHeader>
                        <form key={editingUuid ?? 'new'} onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="client_id">Driver (Client)</Label>
                                <Combobox
                                    items={clientOptions}
                                    value={data.client_id}
                                    onValueChange={(v) => setData('client_id', v || '')}
                                    placeholder="Select driver"
                                    searchPlaceholder="Search driver..."
                                    emptyText="No driver found."
                                    itemToStringValue={(i) => i.name}
                                    itemToValue={(i) => i.id}
                                    triggerClassName={cn(errors?.client_id && 'border-destructive')}
                                />
                                {errors?.client_id && (
                                    <p className="text-sm text-destructive">{errors.client_id}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="vehicle_type_id">Vehicle Type</Label>
                                <Combobox
                                    items={vehicleTypeOptions}
                                    value={data.vehicle_type_id}
                                    onValueChange={(v) => setData('vehicle_type_id', v || '')}
                                    placeholder="Select vehicle type"
                                    searchPlaceholder="Search vehicle type..."
                                    emptyText="No vehicle type found."
                                    itemToStringValue={(i) => i.name}
                                    itemToValue={(i) => i.id}
                                    triggerClassName={cn(errors?.vehicle_type_id && 'border-destructive')}
                                />
                                {errors?.vehicle_type_id && (
                                    <p className="text-sm text-destructive">{errors.vehicle_type_id}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="plat_number">Plate Number</Label>
                                <Input
                                    id="plat_number"
                                    value={data.plat_number}
                                    onChange={(e) => setData('plat_number', e.target.value)}
                                    className={cn(errors?.plat_number && 'border-destructive')}
                                />
                                {errors?.plat_number && (
                                    <p className="text-sm text-destructive">{errors.plat_number}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="color">Color</Label>
                                <Input
                                    id="color"
                                    value={data.color}
                                    onChange={(e) => setData('color', e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="year">Year</Label>
                                <Input
                                    id="year"
                                    type="number"
                                    min={1900}
                                    max={2100}
                                    value={data.year}
                                    onChange={(e) => setData('year', e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="model">Model</Label>
                                <Input
                                    id="model"
                                    value={data.model}
                                    onChange={(e) => setData('model', e.target.value)}
                                />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="doc_vehicle_id_url">Vehicle ID Document URL</Label>
                                <Input
                                    id="doc_vehicle_id_url"
                                    value={data.doc_vehicle_id_url}
                                    onChange={(e) => setData('doc_vehicle_id_url', e.target.value)}
                                />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="doc_vehicle_inspection_cert_url">Inspection Certificate URL</Label>
                                <Input
                                    id="doc_vehicle_inspection_cert_url"
                                    value={data.doc_vehicle_inspection_cert_url}
                                    onChange={(e) => setData('doc_vehicle_inspection_cert_url', e.target.value)}
                                />
                            </div>
                            <div className="flex items-center space-x-2 md:col-span-2">
                                <Checkbox
                                    id="is_active"
                                    checked={data.is_active}
                                    onCheckedChange={(checked) => setData('is_active', !!checked)}
                                />
                                <Label htmlFor="is_active" className="font-normal cursor-pointer">
                                    Active
                                </Label>
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
                        {driverVehicleItems.length === 0 ? (
                            <p className="text-sm text-muted-foreground">
                                No driver vehicles found. Create one above.
                            </p>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Plate Number</TableHead>
                                        <TableHead>Driver</TableHead>
                                        <TableHead>Vehicle Type</TableHead>
                                        <TableHead>Color</TableHead>
                                        <TableHead>Year</TableHead>
                                        <TableHead>Model</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Created</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {driverVehicleItems.map((item) => (
                                        <TableRow key={item.uuid}>
                                            <TableCell className="font-medium">{item.plat_number}</TableCell>
                                            <TableCell className="max-w-xs truncate">
                                                {getDriverName(item)}
                                            </TableCell>
                                            <TableCell className="max-w-xs truncate">
                                                {item.vehicle_type?.title ?? item.vehicle_type?.code ?? '-'}
                                            </TableCell>
                                            <TableCell>{item.color ?? '-'}</TableCell>
                                            <TableCell>{item.year ?? '-'}</TableCell>
                                            <TableCell className="max-w-xs truncate">{item.model ?? '-'}</TableCell>
                                            <TableCell>
                                                <span
                                                    className={cn(
                                                        'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
                                                        item.is_active
                                                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                                            : 'bg-muted text-muted-foreground',
                                                    )}
                                                >
                                                    {item.is_active ? 'Yes' : 'No'}
                                                </span>
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
                            emptyCount={driverVehicleItems.length}
                            label="driver vehicles"
                        />
                    </CardContent>
                </Card>

                <ConfirmAlertDialog
                    open={deleteDialogOpen}
                    onOpenChange={(open) => {
                        setDeleteDialogOpen(open);
                        if (!open) setItemToDelete(null);
                    }}
                    title="Delete driver vehicle"
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
                        {itemToDelete?.plat_number ?? 'this driver vehicle'}
                    </span>{' '}
                    and remove it from all lists. This action cannot be undone.
                </ConfirmAlertDialog>
            </div>
        </AppLayout>
    );
}
