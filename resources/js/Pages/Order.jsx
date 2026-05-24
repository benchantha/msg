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
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Pagination } from '@/components/Pagination';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ConfirmAlertDialog } from '@/components/ConfirmAlertDialog';
import { Combobox } from '@/components/ui/combobox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { toast } from '@/components/AppSonner';
import { cn } from '@/lib/utils';
import {
    IconDots,
    IconPlus,
    IconSearch,
    IconTrash,
    IconTruck,
    IconFilter,
} from '@tabler/icons-react';

const STATUS_OPTIONS = [
    { value: '', label: 'All' },
    { value: 'pending', label: 'Pending' },
    { value: 'assigned', label: 'Assigned' },
    { value: 'driver_arrived', label: 'Driver Arrived' },
    { value: 'departed', label: 'Departed' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
];

const SERVICE_TYPE_OPTIONS = [
    { value: '', label: 'All' },
    { value: 'delivery', label: 'Delivery' },
    { value: 'taxi', label: 'Taxi' },
];

function getErrorMessage(err, fallback = 'Something went wrong.') {
    if (!err) return fallback;
    const data = err?.response?.data || err;
    if (data?.message && typeof data.message === 'string') return data.message;
    if (data?.message && typeof data.message === 'object') return data.message[0] || fallback;
    if (data?.errors && typeof data.errors === 'object') {
        const firstKey = Object.keys(data.errors)[0];
        const firstMsg = firstKey ? data.errors[firstKey]?.[0] : null;
        if (firstMsg) return firstMsg;
    }
    if (err?.message && typeof err.message === 'string') return err.message;
    return fallback;
}

function OrderHeaderActions({
    onNewClick,
    onAssignDriverClick,
    search,
    onSearchChange,
    filterStatus,
    filterServiceType,
    filterCompanyId,
    onFilterChange,
    filterOpen,
    onFilterOpenChange,
    selectedCount,
}) {
    return (
        <div className="border-0 shadow-none">
            <div className="flex flex-col gap-2 px-0 md:flex-row md:items-center md:justify-end">
                <div className="flex w-full flex-wrap justify-end gap-2">
                    <div className="relative w-full max-w-xs md:max-w-sm">
                        <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-muted-foreground">
                            <IconSearch className="size-4" />
                        </span>
                        <Input
                            type="search"
                            placeholder="Search by code or customer"
                            value={search}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="h-8 rounded-full pl-9 text-sm"
                        />
                    </div>
                    <Popover open={filterOpen} onOpenChange={onFilterOpenChange}>
                        <PopoverTrigger asChild>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className={cn(
                                    'rounded-full gap-1.5',
                                    (filterStatus || filterServiceType || filterCompanyId) && 'border-primary'
                                )}
                            >
                                <IconFilter className="size-4" />
                                Filter
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80" align="end">
                            <div className="space-y-3">
                                <h4 className="border-b border-border pb-2 text-sm font-medium">Filters</h4>
                                <div className="space-y-1.5">
                                    <Label className="text-sm">Status</Label>
                                    <Select
                                        value={filterStatus || 'all'}
                                        onValueChange={(v) => onFilterChange({ status: v === 'all' ? '' : v })}
                                    >
                                        <SelectTrigger size="sm" className="w-full">
                                            <SelectValue placeholder="All statuses" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {STATUS_OPTIONS.map((o) => (
                                                <SelectItem key={o.value || 'all'} value={o.value || 'all'}>
                                                    {o.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-sm">Service Type</Label>
                                    <Select
                                        value={filterServiceType || 'all'}
                                        onValueChange={(v) =>
                                            onFilterChange({ service_type: v === 'all' ? '' : v })
                                        }
                                    >
                                        <SelectTrigger size="sm" className="w-full">
                                            <SelectValue placeholder="All types" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {SERVICE_TYPE_OPTIONS.map((o) => (
                                                <SelectItem key={o.value || 'all'} value={o.value || 'all'}>
                                                    {o.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </PopoverContent>
                    </Popover>
                    <Button
                        size="sm"
                        variant="outline"
                        className="rounded-full px-4"
                        onClick={onAssignDriverClick}
                        disabled={selectedCount === 0}
                    >
                        <IconTruck className="mr-1 size-4" />
                        Assign Driver {selectedCount > 0 ? `(${selectedCount})` : ''}
                    </Button>
                    <Button size="sm" className="rounded-full px-4" onClick={onNewClick}>
                        <IconPlus className="mr-1 size-4" />
                        New
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default function Order({
    orders,
    companies = [],
    customers = [],
    drivers = [],
    vehicleTypes = [],
    search: initialSearch = '',
    filter_status: initialFilterStatus = '',
    filter_service_type: initialFilterServiceType = '',
    filter_company_id: initialFilterCompanyId = '',
}) {
    const { errors, flash } = usePage().props;
    const [editingUuid, setEditingUuid] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [assignDialogOpen, setAssignDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [orderToDelete, setOrderToDelete] = useState(null);
    const [filterOpen, setFilterOpen] = useState(false);
    const [selectedOrderIds, setSelectedOrderIds] = useState(new Set());

    const [search, setSearch] = useState(initialSearch || '');
    const [filterStatus, setFilterStatus] = useState(initialFilterStatus || '');
    const [filterServiceType, setFilterServiceType] = useState(initialFilterServiceType || '');
    const [filterCompanyId, setFilterCompanyId] = useState(initialFilterCompanyId || '');

    const { data, setData, post, put, reset, processing } = useForm({
        code: '',
        service_type: 'delivery',
        company_id: '',
        customer_id: '',
        distance: '',
        estimated_duration: '',
        estimated_price: '',
        final_price: '',
        payment_timing: 'postpaid',
        payment_status: 'unpaid',
        priority: 'normal',
        note: '',
        special_instructions: '',
        item_size: '',
        item_weight: '',
        item_type: '',
        item_description: '',
        is_fragile: false,
        requires_signature: false,
        requires_photo: false,
        locations: [
            { type: 'pickup', sequence: 1, latitude: '', longitude: '', address: '', contact_name: '', contact_phone: '', notes: '' },
            { type: 'dropoff', sequence: 1, latitude: '', longitude: '', address: '', contact_name: '', contact_phone: '', notes: '' },
        ],
    });

    const assignForm = useForm({
        order_ids: [],
        driver_id: '',
        company_id: '',
        vehicle_type_id: '',
    });

    const orderItems = useMemo(() => {
        if (!orders) return [];
        return Array.isArray(orders) ? orders : orders.data ?? [];
    }, [orders]);

    const pagination = !Array.isArray(orders) ? orders : null;

    const pendingOrders = useMemo(
        () => orderItems.filter((o) => o.status === 'pending'),
        [orderItems]
    );

    const toggleSelectOrder = (order) => {
        if (order.status !== 'pending') return;
        setSelectedOrderIds((prev) => {
            const next = new Set(prev);
            if (next.has(order.id)) next.delete(order.id);
            else next.add(order.id);
            return next;
        });
    };

    const toggleSelectAllPending = () => {
        if (selectedOrderIds.size === pendingOrders.length) {
            setSelectedOrderIds(new Set());
        } else {
            setSelectedOrderIds(new Set(pendingOrders.map((o) => o.id)));
        }
    };

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash?.success, flash?.error]);

    useEffect(() => {
        const params = { search, filter_status: filterStatus, filter_service_type: filterServiceType, filter_company_id: filterCompanyId };
        const timeout = setTimeout(() => {
            router.get('/orders', params, {
                preserveState: true,
                replace: true,
                preserveScroll: true,
            });
        }, 300);
        return () => clearTimeout(timeout);
    }, [search, filterStatus, filterServiceType, filterCompanyId]);

    const resetForm = () => {
        setEditingUuid(null);
        reset({
            code: '',
            service_type: 'delivery',
            company_id: '',
            customer_id: '',
            distance: '',
            estimated_duration: '',
            estimated_price: '',
            final_price: '',
            payment_timing: 'postpaid',
            payment_status: 'unpaid',
            priority: 'normal',
            note: '',
            special_instructions: '',
            item_size: '',
            item_weight: '',
            item_type: '',
            item_description: '',
            is_fragile: false,
            requires_signature: false,
            requires_photo: false,
            locations: [
                { type: 'pickup', sequence: 1, latitude: '', longitude: '', address: '', contact_name: '', contact_phone: '', notes: '' },
                { type: 'dropoff', sequence: 1, latitude: '', longitude: '', address: '', contact_name: '', contact_phone: '', notes: '' },
            ],
        });
    };

    const startCreate = () => {
        resetForm();
        setDialogOpen(true);
    };

    const startEdit = (order) => {
        setEditingUuid(order.uuid);
        const pickup = order.locations?.find((l) => l.type === 'pickup') ?? {};
        const dropoff = order.locations?.find((l) => l.type === 'dropoff') ?? {};
        setData({
            code: order.code ?? '',
            service_type: order.service_type ?? 'delivery',
            company_id: order.company_id ? String(order.company_id) : '',
            customer_id: order.customer_id ? String(order.customer_id) : '',
            distance: order.distance ?? '',
            estimated_duration: order.estimated_duration ?? '',
            estimated_price: order.estimated_price ?? '',
            final_price: order.final_price ?? '',
            payment_timing: order.payment_timing ?? 'postpaid',
            payment_status: order.payment_status ?? 'unpaid',
            priority: order.priority ?? 'normal',
            note: order.note ?? '',
            special_instructions: order.special_instructions ?? '',
            item_size: order.item_size ?? '',
            item_weight: order.item_weight ?? '',
            item_type: order.item_type ?? '',
            item_description: order.item_description ?? '',
            is_fragile: order.is_fragile ?? false,
            requires_signature: order.requires_signature ?? false,
            requires_photo: order.requires_photo ?? false,
            locations: [
                {
                    type: 'pickup',
                    sequence: 1,
                    latitude: pickup.latitude ?? '',
                    longitude: pickup.longitude ?? '',
                    address: pickup.address ?? '',
                    contact_name: pickup.contact_name ?? '',
                    contact_phone: pickup.contact_phone ?? '',
                    notes: pickup.notes ?? '',
                },
                {
                    type: 'dropoff',
                    sequence: 1,
                    latitude: dropoff.latitude ?? '',
                    longitude: dropoff.longitude ?? '',
                    address: dropoff.address ?? '',
                    contact_name: dropoff.contact_name ?? '',
                    contact_phone: dropoff.contact_phone ?? '',
                    notes: dropoff.notes ?? '',
                },
            ],
        });
        setDialogOpen(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const locations = data.locations
            .filter((l) => l.address)
            .map((l) => ({
                ...l,
                latitude: parseFloat(l.latitude) || 0,
                longitude: parseFloat(l.longitude) || 0,
            }));
        if (locations.length < 2) {
            toast.error('Pickup and dropoff addresses are required.');
            return;
        }
        const payload = {
            ...data,
            company_id: data.company_id ? parseInt(data.company_id, 10) : null,
            customer_id: data.customer_id ? parseInt(data.customer_id, 10) : null,
            locations,
        };
        if (editingUuid) {
            put(`/orders/${editingUuid}`, {
                data: payload,
                preserveScroll: true,
                onSuccess: () => {
                    resetForm();
                    setDialogOpen(false);
                    toast.success('Order updated.');
                },
                onError: (err) => toast.error(getErrorMessage(err, 'Failed to save order.')),
            });
        } else {
            post('/orders', {
                data: payload,
                preserveScroll: true,
                onSuccess: () => {
                    resetForm();
                    setDialogOpen(false);
                    toast.success('Order created.');
                },
                onError: (err) => toast.error(getErrorMessage(err, 'Failed to create order.')),
            });
        }
    };

    const handleAssignDriver = () => {
        const firstOrder = orderItems.find((o) => selectedOrderIds.has(o.id));
        const companyId = firstOrder?.company_id;
        if (!companyId) {
            toast.error('Could not determine company from selected orders.');
            return;
        }
        assignForm.setData({
            order_ids: Array.from(selectedOrderIds),
            company_id: String(companyId),
            driver_id: '',
            vehicle_type_id: '',
        });
        setAssignDialogOpen(true);
    };

    const submitAssignDriver = (e) => {
        e.preventDefault();
        if (!assignForm.data.driver_id || assignForm.data.order_ids.length === 0) {
            toast.error('Select a driver. At least one order must be selected.');
            return;
        }
        const payload = {
            ...assignForm.data,
            vehicle_type_id: assignForm.data.vehicle_type_id || undefined,
        };
        assignForm.post('/orders/assign-driver', {
            data: payload,
            preserveScroll: true,
            onSuccess: () => {
                setAssignDialogOpen(false);
                setSelectedOrderIds(new Set());
                assignForm.reset();
                toast.success('Orders assigned to driver.');
            },
            onError: (err) => toast.error(getErrorMessage(err, flash?.error || 'Failed to assign driver.')),
        });
    };

    const handleDelete = (order) => {
        if (!order) return;
        if (editingUuid === order.uuid) {
            resetForm();
            setDialogOpen(false);
        }
        router.delete(`/orders/${order.uuid}`, {
            preserveScroll: true,
            onSuccess: () => {
                setDeleteDialogOpen(false);
                setOrderToDelete(null);
                toast.success('Order deleted.');
            },
            onError: (err) => toast.error(getErrorMessage(err, 'Failed to delete order.')),
        });
    };

    const companyOptions = (companies ?? []).map((c) => ({ id: String(c.id), name: c.name ?? `#${c.id}` }));
    const customerOptions = (customers ?? []).map((c) => ({
        id: String(c.id),
        name: `${c.first_name || ''} ${c.last_name || ''}`.trim() || c.account_code || `#${c.id}`,
    }));
    const driverOptions = (drivers ?? []).map((d) => ({
        id: String(d.id),
        name: `${d.first_name || ''} ${d.last_name || ''}`.trim() || d.account_code || `#${d.id}`,
    }));

    const headerActions = (
        <OrderHeaderActions
            onNewClick={startCreate}
            onAssignDriverClick={handleAssignDriver}
            search={search}
            onSearchChange={setSearch}
            filterStatus={filterStatus}
            filterServiceType={filterServiceType}
            filterCompanyId={filterCompanyId}
            onFilterChange={({ status, service_type, company_id }) => {
                if (status !== undefined) setFilterStatus(status);
                if (service_type !== undefined) setFilterServiceType(service_type);
                if (company_id !== undefined) setFilterCompanyId(company_id);
            }}
            filterOpen={filterOpen}
            onFilterOpenChange={setFilterOpen}
            selectedCount={selectedOrderIds.size}
        />
    );

    return (
        <AppLayout title="Orders" subHeader={headerActions}>
            <div className="space-y-6">
                <Sheet
                    open={dialogOpen}
                    onOpenChange={(open) => {
                        setDialogOpen(open);
                        if (!open) resetForm();
                    }}
                >
                    <SheetContent side="right" className="w-full sm:max-w-xl md:max-w-2xl flex flex-col p-0 gap-0">
                        <SheetHeader className="shrink-0 px-6 pt-6 pb-4 border-b">
                            <SheetTitle>{editingUuid ? 'Edit order' : 'Create order'}</SheetTitle>
                            <SheetDescription>
                                {editingUuid
                                    ? 'Update order details and locations.'
                                    : 'Create a new order with pickup and dropoff locations.'}
                            </SheetDescription>
                        </SheetHeader>
                        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0 overflow-hidden">
                            <ScrollArea className="flex-1 min-h-0">
                                <div className="grid gap-4 px-6 py-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label>Code (optional, auto-generated if empty)</Label>
                                    <Input
                                        value={data.code}
                                        onChange={(e) => setData('code', e.target.value)}
                                        placeholder="Auto-generated"
                                        className={cn(errors?.code && 'border-destructive')}
                                    />
                                    {errors?.code && <p className="text-sm text-destructive">{errors.code}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label>Service Type</Label>
                                    <Select
                                        value={data.service_type}
                                        onValueChange={(v) => setData('service_type', v)}
                                    >
                                        <SelectTrigger className={cn('w-full', errors?.service_type && 'border-destructive')}>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="delivery">Delivery</SelectItem>
                                            <SelectItem value="taxi">Taxi</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors?.service_type && (
                                        <p className="text-sm text-destructive">{errors.service_type}</p>
                                    )}
                                </div>
                            </div>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label>Company</Label>
                                    <Combobox
                                        items={companyOptions}
                                        value={data.company_id ? String(data.company_id) : ''}
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
                                    <Label>Customer</Label>
                                    <Combobox
                                        items={customerOptions}
                                        value={data.customer_id ? String(data.customer_id) : ''}
                                        onValueChange={(v) => setData('customer_id', v || '')}
                                        placeholder="Select customer"
                                        searchPlaceholder="Search customer..."
                                        emptyText="No customer found."
                                        itemToStringValue={(i) => i.name}
                                        itemToValue={(i) => i.id}
                                        triggerClassName={cn(errors?.customer_id && 'border-destructive')}
                                    />
                                    {errors?.customer_id && (
                                        <p className="text-sm text-destructive">{errors.customer_id}</p>
                                    )}
                                </div>
                            </div>
                            <div className="grid gap-4 md:grid-cols-3">
                                <div className="space-y-2">
                                    <Label>Estimated Price</Label>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        value={data.estimated_price}
                                        onChange={(e) => setData('estimated_price', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Priority</Label>
                                    <Select value={data.priority} onValueChange={(v) => setData('priority', v)}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="normal">Normal</SelectItem>
                                            <SelectItem value="urgent">Urgent</SelectItem>
                                            <SelectItem value="express">Express</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex flex-wrap items-center gap-4 pt-8">
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="is_fragile"
                                            checked={data.is_fragile}
                                            onCheckedChange={(c) => setData('is_fragile', c === true)}
                                        />
                                        <Label htmlFor="is_fragile" className="text-sm font-normal cursor-pointer">
                                            Fragile
                                        </Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="requires_signature"
                                            checked={data.requires_signature}
                                            onCheckedChange={(c) => setData('requires_signature', c === true)}
                                        />
                                        <Label htmlFor="requires_signature" className="text-sm font-normal cursor-pointer">
                                            Signature
                                        </Label>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Note</Label>
                                <textarea
                                    value={data.note}
                                    onChange={(e) => setData('note', e.target.value)}
                                    className="min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                />
                            </div>
                            <div className="border-t pt-4 mt-2">
                                <h4 className="mb-3 text-sm font-medium">Locations</h4>
                                <div className="space-y-4">
                                    {data.locations.map((loc, idx) => (
                                        <div key={idx} className="rounded-lg border bg-muted/20 p-4 space-y-3">
                                            <span className={cn(
                                                "inline-flex rounded-md px-2 py-0.5 text-xs font-medium",
                                                loc.type === 'pickup' && "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
                                                loc.type === 'dropoff' && "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300"
                                            )}>
                                                {loc.type === 'pickup' ? 'Pickup' : 'Dropoff'}
                                            </span>
                                            <div className="grid gap-2 md:grid-cols-2">
                                                <Input
                                                    placeholder="Address *"
                                                    value={loc.address}
                                                    onChange={(e) => {
                                                        const next = [...data.locations];
                                                        next[idx] = { ...next[idx], address: e.target.value };
                                                        setData('locations', next);
                                                    }}
                                                />
                                                <Input
                                                    placeholder="Contact name"
                                                    value={loc.contact_name}
                                                    onChange={(e) => {
                                                        const next = [...data.locations];
                                                        next[idx] = { ...next[idx], contact_name: e.target.value };
                                                        setData('locations', next);
                                                    }}
                                                />
                                            </div>
                                            <div className="grid gap-2 md:grid-cols-2">
                                                <Input
                                                    type="number"
                                                    step="any"
                                                    placeholder="Latitude"
                                                    value={loc.latitude}
                                                    onChange={(e) => {
                                                        const next = [...data.locations];
                                                        next[idx] = { ...next[idx], latitude: e.target.value };
                                                        setData('locations', next);
                                                    }}
                                                />
                                                <Input
                                                    type="number"
                                                    step="any"
                                                    placeholder="Longitude"
                                                    value={loc.longitude}
                                                    onChange={(e) => {
                                                        const next = [...data.locations];
                                                        next[idx] = { ...next[idx], longitude: e.target.value };
                                                        setData('locations', next);
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                {(errors?.['locations.0.address'] || errors?.['locations.1.address']) && (
                                    <p className="mt-1 text-sm text-destructive">
                                        Pickup and dropoff addresses are required.
                                    </p>
                                )}
                            </div>
                            <SheetFooter className="mt-4 pl-0 flex-row">
                                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Saving...' : editingUuid ? 'Save' : 'Create'}
                                </Button>
                                </SheetFooter>
                                </div>

                            </ScrollArea>
                        </form>
                    </SheetContent>
                </Sheet>

                <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Assign driver to orders</DialogTitle>
                            <DialogDescription>
                                Assign {selectedOrderIds.size} pending order(s) to a driver. A new trip will be created.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={submitAssignDriver} className="space-y-4">
                            <div className="space-y-2">
                                <Label>Driver</Label>
                                <Combobox
                                    items={driverOptions}
                                    value={assignForm.data.driver_id ? String(assignForm.data.driver_id) : ''}
                                    onValueChange={(v) => assignForm.setData('driver_id', v || '')}
                                    placeholder="Select driver"
                                    searchPlaceholder="Search driver..."
                                    emptyText="No driver found."
                                    itemToStringValue={(i) => i.name}
                                    itemToValue={(i) => i.id}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Vehicle Type (optional)</Label>
                                <Select
                                    value={assignForm.data.vehicle_type_id || '__none__'}
                                    onValueChange={(v) => assignForm.setData('vehicle_type_id', v === '__none__' ? '' : v)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select vehicle type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="__none__">None</SelectItem>
                                        {(vehicleTypes ?? []).map((vt) => (
                                            <SelectItem key={vt.id} value={String(vt.id)}>
                                                {vt.title || vt.code}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setAssignDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={assignForm.processing}>
                                    {assignForm.processing ? 'Assigning...' : 'Assign'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                <Card>
                    <CardContent className="pt-6">
                        {orderItems.length === 0 ? (
                            <p className="text-sm text-muted-foreground">No orders found. Create your first order above.</p>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-10">
                                            {pendingOrders.length > 0 && (
                                                <Checkbox
                                                    checked={
                                                        selectedOrderIds.size > 0 &&
                                                        selectedOrderIds.size === pendingOrders.length
                                                    }
                                                    onCheckedChange={toggleSelectAllPending}
                                                />
                                            )}
                                        </TableHead>
                                        <TableHead>Code</TableHead>
                                        <TableHead>Customer</TableHead>
                                        <TableHead>Service</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Driver/Trip</TableHead>
                                        <TableHead>Created</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {orderItems.map((order) => (
                                        <TableRow key={order.uuid}>
                                            <TableCell>
                                                {order.status === 'pending' && (
                                                    <Checkbox
                                                        checked={selectedOrderIds.has(order.id)}
                                                        onCheckedChange={() => toggleSelectOrder(order)}
                                                    />
                                                )}
                                            </TableCell>
                                            <TableCell>{order.code}</TableCell>
                                            <TableCell>
                                                {order.customer
                                                    ? `${order.customer.first_name || ''} ${order.customer.last_name || ''}`.trim() ||
                                                      order.customer.account_code
                                                    : '-'}
                                            </TableCell>
                                            <TableCell className="capitalize">{order.service_type}</TableCell>
                                            <TableCell>
                                                <span
                                                    className={cn(
                                                        'inline-flex rounded-full px-2 py-0.5 text-xs font-medium capitalize',
                                                        order.status === 'pending' && 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
                                                        order.status === 'assigned' && 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
                                                        order.status === 'completed' && 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
                                                        order.status === 'cancelled' && 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
                                                        !['pending', 'assigned', 'completed', 'cancelled'].includes(order.status) && 'bg-muted text-muted-foreground'
                                                    )}
                                                >
                                                    {order.status?.replace('_', ' ')}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                {order.trip?.driver
                                                    ? `${order.trip.driver.first_name || ''} ${order.trip.driver.last_name || ''}`.trim()
                                                    : '-'}
                                            </TableCell>
                                            <TableCell>
                                                {order.created_at
                                                    ? new Date(order.created_at).toLocaleString()
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
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onClick={() => startEdit(order)}>
                                                            Edit
                                                        </DropdownMenuItem>
                                                        {['pending', 'cancelled'].includes(order.status) && (
                                                            <DropdownMenuItem
                                                                className="text-destructive"
                                                                onSelect={(e) => {
                                                                    e.preventDefault();
                                                                    setOrderToDelete(order);
                                                                    setDeleteDialogOpen(true);
                                                                }}
                                                            >
                                                                Delete
                                                            </DropdownMenuItem>
                                                        )}
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
                            emptyCount={orderItems.length}
                            label="orders"
                        />
                    </CardContent>
                </Card>

                <ConfirmAlertDialog
                    open={deleteDialogOpen}
                    onOpenChange={(open) => {
                        setDeleteDialogOpen(open);
                        if (!open) setOrderToDelete(null);
                    }}
                    title="Delete order"
                    icon={
                        <span className="flex size-7 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                            <IconTrash className="size-4" />
                        </span>
                    }
                    confirmLabel="Delete"
                    cancelLabel="Cancel"
                    confirmClassName="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    confirmDisabled={!orderToDelete}
                    onConfirm={() => handleDelete(orderToDelete)}
                >
                    This will permanently delete order{' '}
                    <span className="font-semibold">{orderToDelete?.code ?? ''}</span>. This action cannot be undone.
                </ConfirmAlertDialog>
            </div>
        </AppLayout>
    );
}
