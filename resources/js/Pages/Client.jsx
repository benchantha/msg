import { useEffect, useMemo, useState } from 'react';
import { router, useForm, usePage } from '@inertiajs/react';
import { AppLayout } from '@/Layouts/AppLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Pagination } from '@/components/Pagination';
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Combobox } from '@/components/ui/combobox';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { ConfirmAlertDialog } from '@/components/ConfirmAlertDialog';
import { IconCalendar, IconDots, IconFilter, IconKey, IconPlus, IconSearch, IconTrash } from '@tabler/icons-react';
import { cn } from '@/lib/utils';

function ClientHeaderActions({ search, onSearchChange, onNewClick, filterGender, filterType, filterStatus, onFilterChange, filterOpen, onFilterOpenChange }) {
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
                                placeholder="Search by code, name, phone, or type"
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
                                className={cn("rounded-full gap-1.5", (filterGender || filterType || filterStatus) && "border-primary")}
                            >
                                <IconFilter className="size-4" />
                                Filter
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80" align="end">
                            <div className="space-y-3">
                                <h4 className="text-sm font-medium border-b border-border pb-2">Filters</h4>
                                <div className="space-y-1.5">
                                    <Label className="text-sm">Type</Label>
                                    <Select value={filterType || 'all'} onValueChange={(v) => onFilterChange({ type: v === 'all' ? '' : v })}>
                                        <SelectTrigger size="sm" className="w-full">
                                            <SelectValue placeholder="All types" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All</SelectItem>
                                            <SelectItem value="driver">Driver</SelectItem>
                                            <SelectItem value="customer">Customer</SelectItem>
                                            <SelectItem value="staff">Staff</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-sm">Gender</Label>
                                    <Select value={filterGender || 'all'} onValueChange={(v) => onFilterChange({ gender: v === 'all' ? '' : v })}>
                                        <SelectTrigger size="sm" className="w-full">
                                            <SelectValue placeholder="All genders" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All</SelectItem>
                                            <SelectItem value="male">Male</SelectItem>
                                            <SelectItem value="female">Female</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-sm">Status</Label>
                                    <Select value={filterStatus || 'all'} onValueChange={(v) => onFilterChange({ status: v === 'all' ? '' : v })}>
                                        <SelectTrigger size="sm" className="w-full">
                                            <SelectValue placeholder="All statuses" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All</SelectItem>
                                            <SelectItem value="pending">Pending</SelectItem>
                                            <SelectItem value="approved">Approved</SelectItem>
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

export default function Client({ clients, search: initialSearch = '', companies = [], filterGender: initialFilterGender = '', filterType: initialFilterType = '', filterStatus: initialFilterStatus = '' }) {
    const { errors } = usePage().props;

    const [search, setSearch] = useState(initialSearch || '');
    const [filterGender, setFilterGender] = useState(initialFilterGender || '');
    const [filterType, setFilterType] = useState(initialFilterType || '');
    const [filterStatus, setFilterStatus] = useState(initialFilterStatus || '');
    const [filterOpen, setFilterOpen] = useState(false);
    const [sheetOpen, setSheetOpen] = useState(false);
    const [dobOpen, setDobOpen] = useState(false);
    const [editingClientUuid, setEditingClientUuid] = useState(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [clientToDelete, setClientToDelete] = useState(null);
    const [resetPasswordDialogOpen, setResetPasswordDialogOpen] = useState(false);
    const [resetPasswordValue, setResetPasswordValue] = useState('');

    const { data, setData, post, put, processing, reset } = useForm({
        account_code: '',
        company_id: '',
        phone: '',
        type: 'customer',
        password: '',
        first_name: '',
        last_name: '',
        gender: '',
        dob: '',
        place_of_birth: '',
        id_number: '',
        phone_1: '',
        phone_2: '',
        phone_3: '',
        phone_4: '',
        address: '',
        avatar_url: '',
        is_active: true,
        status: 'pending',
        work_status: 'offline',
        rank: 0,
        is_fixed_otp: false,
        otp: '',
        latitude: '',
        longitude: '',
        location_name: '',
        rotation: '',
        nick_name: '',
    });

    const resetForm = () => {
        setEditingClientUuid(null);
        reset({
            account_code: '',
            company_id: '',
            phone: '',
            type: 'customer',
            password: '',
            first_name: '',
            last_name: '',
            gender: '',
            dob: '',
            place_of_birth: '',
            id_number: '',
            phone_1: '',
            phone_2: '',
            phone_3: '',
            phone_4: '',
            address: '',
            avatar_url: '',
            is_active: true,
            status: 'pending',
            work_status: 'offline',
            rank: 0,
            is_fixed_otp: false,
            otp: '',
            latitude: '',
            longitude: '',
            location_name: '',
            rotation: '',
            nick_name: '',
        });
    };

    const clientItems = useMemo(() => {
        if (!clients) return [];
        return Array.isArray(clients) ? clients : clients.data ?? [];
    }, [clients]);

    const companyOptions = useMemo(
        () =>
            (companies ?? []).map((company) => ({
                id: String(company.id),
                name: company.name ?? `Company #${company.id}`,
            })),
        [companies],
    );

    const pagination = !Array.isArray(clients) ? clients : null;

    const applyFilters = (searchVal, genderVal, typeVal, statusVal) => {
        const params = { search: searchVal || undefined };
        if (genderVal) params.filter_gender = genderVal;
        if (typeVal) params.filter_type = typeVal;
        if (statusVal) params.filter_status = statusVal;
        router.get('/clients', params, { preserveState: true, replace: true, preserveScroll: true });
    };

    useEffect(() => {
        const normalizedInitial = initialSearch || '';
        const filtersChanged = filterGender !== initialFilterGender || filterType !== initialFilterType || filterStatus !== initialFilterStatus;
        if (search === normalizedInitial && !filtersChanged) return;

        const timeout = setTimeout(() => {
            applyFilters(search, filterGender, filterType, filterStatus);
        }, search !== normalizedInitial ? 300 : 0);

        return () => clearTimeout(timeout);
    }, [search, initialSearch, filterGender, filterType, filterStatus, initialFilterGender, initialFilterType, initialFilterStatus]);

    const startEdit = (client) => {
        setEditingClientUuid(client.uuid);
        setData({
            account_code: client.account_code ?? '',
            company_id: client.company_id ?? '',
            phone: client.phone ?? '',
            type: client.type ?? 'customer',
            password: '',
            first_name: client.first_name ?? '',
            last_name: client.last_name ?? '',
            gender: client.gender ?? '',
            dob: client.dob ?? '',
            place_of_birth: client.place_of_birth ?? '',
            id_number: client.id_number ?? '',
            phone_1: client.phone_1 ?? '',
            phone_2: client.phone_2 ?? '',
            phone_3: client.phone_3 ?? '',
            phone_4: client.phone_4 ?? '',
            address: client.address ?? '',
            avatar_url: client.avatar_url ?? '',
            is_active: client.is_active ?? true,
            status: client.status ?? 'pending',
            work_status: client.work_status ?? 'offline',
            rank: client.rank ?? 0,
            is_fixed_otp: client.is_fixed_otp ?? false,
            otp: client.otp ?? '',
            latitude: client.latitude ?? '',
            longitude: client.longitude ?? '',
            location_name: client.location_name ?? '',
            rotation: client.rotation ?? '',
            nick_name: client.nick_name ?? '',
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const onSuccess = () => {
            resetForm();
            setSheetOpen(false);
        };

        if (editingClientUuid) {
            put(`/clients/${editingClientUuid}`, {
                preserveScroll: true,
                onSuccess,
            });
        } else {
            post('/clients', {
                preserveScroll: true,
                onSuccess,
            });
        }
    };

    const handleDelete = (client) => {
        if (!client) return;

        if (editingClientUuid === client.uuid) {
            resetForm();
            setSheetOpen(false);
        }

        router.delete(`/clients/${client.uuid}`, {
            preserveScroll: true,
            onSuccess: () => {
                setDeleteDialogOpen(false);
                setClientToDelete(null);
            },
        });
    };

    const handleFilterChange = (updates) => {
        if ('gender' in updates) setFilterGender(updates.gender);
        if ('type' in updates) setFilterType(updates.type);
        if ('status' in updates) setFilterStatus(updates.status);
    };

    const headerActions = (
        <ClientHeaderActions
            search={search}
            onSearchChange={setSearch}
            onNewClick={() => {
                resetForm();
                setSheetOpen(true);
            }}
            filterGender={filterGender}
            filterType={filterType}
            filterStatus={filterStatus}
            onFilterChange={handleFilterChange}
            filterOpen={filterOpen}
            onFilterOpenChange={setFilterOpen}
        />
    );

    return (
        <AppLayout title="Client" subHeader={headerActions}>
            <div className="space-y-6">
                <Sheet
                    open={sheetOpen}
                    onOpenChange={(open) => {
                        setSheetOpen(open);
                        if (!open) {
                            resetForm();
                        }
                    }}
                >
                    <SheetContent side="right" className="w-full sm:max-w-xl md:max-w-3xl">
                        <SheetHeader>
                            <SheetTitle>{editingClientUuid ? 'Edit client' : 'New client'}</SheetTitle>
                            <SheetDescription>
                                {editingClientUuid
                                    ? 'Update the client details below and save your changes.'
                                    : 'Create a new client record by filling in the details below.'}
                            </SheetDescription>
                        </SheetHeader>
                        <form onSubmit={handleSubmit} className="flex flex-1 flex-col gap-4 px-4 pb-4">
                            <ScrollArea className="flex-1 pr-2">
                                <div className="grid gap-4 md:grid-cols-2 pb-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="account_code">Account code</Label>
                                        <Input
                                            id="account_code"
                                            value={data.account_code}
                                            onChange={(e) => setData('account_code', e.target.value)}
                                            className={errors?.account_code && 'border-destructive'}
                                        />
                                        {errors?.account_code && (
                                            <p className="text-sm text-destructive">
                                                {errors.account_code}
                                            </p>
                                        )}
                                    </div>
                                    {data.type !== 'customer' && (
                                        <div className="space-y-2">
                                            <Label htmlFor="company_id">Company</Label>
                                            <Combobox
                                                items={companyOptions}
                                                value={data.company_id ? String(data.company_id) : ''}
                                                onValueChange={(value) => setData('company_id', value || '')}
                                                placeholder="Select company"
                                                searchPlaceholder="Search company..."
                                                emptyText="No company found."
                                                itemToStringValue={(item) => item.name}
                                                itemToValue={(item) => item.id}
                                                triggerClassName={errors?.company_id ? 'border-destructive' : ''}
                                            />
                                            {errors?.company_id && (
                                                <p className="text-sm text-destructive">
                                                    {errors.company_id}
                                                </p>
                                            )}
                                        </div>
                                    )}
                                    <div className="space-y-2">
                                        <Label htmlFor="first_name">First name</Label>
                                        <Input
                                            id="first_name"
                                            value={data.first_name}
                                            onChange={(e) => setData('first_name', e.target.value)}
                                            className={errors?.first_name && 'border-destructive'}
                                        />
                                        {errors?.first_name && (
                                            <p className="text-sm text-destructive">
                                                {errors.first_name}
                                            </p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="last_name">Last name</Label>
                                        <Input
                                            id="last_name"
                                            value={data.last_name}
                                            onChange={(e) => setData('last_name', e.target.value)}
                                            className={errors?.last_name && 'border-destructive'}
                                        />
                                        {errors?.last_name && (
                                            <p className="text-sm text-destructive">
                                                {errors.last_name}
                                            </p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="nick_name">Nickname</Label>
                                        <Input
                                            id="nick_name"
                                            value={data.nick_name}
                                            onChange={(e) => setData('nick_name', e.target.value)}
                                            className={errors?.nick_name && 'border-destructive'}
                                        />
                                        {errors?.nick_name && (
                                            <p className="text-sm text-destructive">
                                                {errors.nick_name}
                                            </p>
                                        )}
                                    </div>
                                    {editingClientUuid ? (
                                        <div className="space-y-2">
                                            <Label htmlFor="password">Password</Label>
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => {
                                                        setResetPasswordValue('');
                                                        setResetPasswordDialogOpen(true);
                                                    }}
                                                >
                                                    Reset password
                                                </Button>
                                                {data.password && (
                                                    <span className="text-xs text-muted-foreground">
                                                        New password will be applied when you save.
                                                    </span>
                                                )}
                                            </div>
                                            {errors?.password && (
                                                <p className="text-sm text-destructive">
                                                    {errors.password}
                                                </p>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            <Label htmlFor="password">Password</Label>
                                            <Input
                                                id="password"
                                                type="password"
                                                value={data.password}
                                                onChange={(e) => setData('password', e.target.value)}
                                                className={errors?.password && 'border-destructive'}
                                            />
                                            {errors?.password && (
                                                <p className="text-sm text-destructive">
                                                    {errors.password}
                                                </p>
                                            )}
                                        </div>
                                    )}
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Phone</Label>
                                        <Input
                                            id="phone"
                                            value={data.phone}
                                            onChange={(e) => setData('phone', e.target.value)}
                                            className={errors?.phone && 'border-destructive'}
                                        />
                                        {errors?.phone && (
                                            <p className="text-sm text-destructive">
                                                {errors.phone}
                                            </p>
                                        )}
                                    </div>
                                <div className="space-y-2">
                                    <Label htmlFor="gender">Gender</Label>
                                    <Select
                                        value={data.gender || ''}
                                        onValueChange={(value) => setData('gender', value)}
                                    >
                                        <SelectTrigger
                                            id="gender"
                                            className={`w-full ${errors?.gender ? 'border-destructive' : ''}`}
                                        >
                                            <SelectValue placeholder="Select gender" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="male">Male</SelectItem>
                                            <SelectItem value="female">Female</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors?.gender && (
                                        <p className="text-sm text-destructive">
                                            {errors.gender}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="dob">Date of birth</Label>
                                    <div className="relative">
                                        <Input
                                            id="dob"
                                            type="text"
                                            value={data.dob || ''}
                                            onChange={(e) => setData('dob', e.target.value)}
                                            placeholder="YYYY-MM-DD"
                                            className={cn(
                                                "pr-10",
                                                errors?.dob && "border-destructive"
                                            )}
                                        />
                                        <Popover open={dobOpen} onOpenChange={setDobOpen}>
                                            <PopoverTrigger asChild>
                                                <button
                                                    type="button"
                                                    className="absolute right-0 top-0 flex h-full w-9 items-center justify-center text-muted-foreground hover:text-foreground"
                                                    aria-label="Open calendar"
                                                >
                                                    <IconCalendar className="size-4 shrink-0" />
                                                </button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto overflow-hidden p-0" align="end">
                                                <Calendar
                                                    mode="single"
                                                    selected={data.dob ? new Date(data.dob) : undefined}
                                                    defaultMonth={data.dob ? new Date(data.dob) : undefined}
                                                    captionLayout="dropdown"
                                                    onSelect={(date) => {
                                                        setDobOpen(false);
                                                        if (date) {
                                                            const year = date.getFullYear();
                                                            const month = String(date.getMonth() + 1).padStart(2, '0');
                                                            const day = String(date.getDate()).padStart(2, '0');
                                                            setData('dob', `${year}-${month}-${day}`);
                                                        } else {
                                                            setData('dob', '');
                                                        }
                                                    }}
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                    {errors?.dob && (
                                        <p className="text-sm text-destructive">
                                            {errors.dob}
                                        </p>
                                    )}
                                </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="place_of_birth">Place of birth</Label>
                                        <Input
                                            id="place_of_birth"
                                            type="text"
                                            value={data.place_of_birth || ''}
                                            onChange={(e) => setData('place_of_birth', e.target.value)}
                                            placeholder="Enter place of birth"
                                            className={errors?.place_of_birth && "border-destructive"}
                                        />
                                        {errors?.place_of_birth && (
                                            <p className="text-sm text-destructive">
                                                {errors.place_of_birth}
                                            </p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="id_number">ID number</Label>
                                        <Input
                                            id="id_number"
                                            value={data.id_number}
                                            onChange={(e) => setData('id_number', e.target.value)}
                                            className={errors?.id_number && 'border-destructive'}
                                        />
                                        {errors?.id_number && (
                                            <p className="text-sm text-destructive">
                                                {errors.id_number}
                                            </p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="phone_1">Phone 1</Label>
                                        <Input
                                            id="phone_1"
                                            value={data.phone_1}
                                            onChange={(e) => setData('phone_1', e.target.value)}
                                            placeholder="+855"
                                            className={errors?.phone_1 && 'border-destructive'}
                                        />
                                        {errors?.phone_1 && (
                                            <p className="text-sm text-destructive">
                                                {errors.phone_1}
                                            </p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="phone_2">Phone 2</Label>
                                        <Input
                                            id="phone_2"
                                            value={data.phone_2}
                                            onChange={(e) => setData('phone_2', e.target.value)}
                                            placeholder="+855"
                                            className={errors?.phone_2 && 'border-destructive'}
                                        />
                                        {errors?.phone_2 && (
                                            <p className="text-sm text-destructive">
                                                {errors.phone_2}
                                            </p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="phone_3">Phone 3</Label>
                                        <Input
                                            id="phone_3"
                                            value={data.phone_3}
                                            onChange={(e) => setData('phone_3', e.target.value)}
                                            placeholder="+855"
                                            className={errors?.phone_3 && 'border-destructive'}
                                        />
                                        {errors?.phone_3 && (
                                            <p className="text-sm text-destructive">
                                                {errors.phone_3}
                                            </p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="phone_4">Phone 4</Label>
                                        <Input
                                            id="phone_4"
                                            value={data.phone_4}
                                            onChange={(e) => setData('phone_4', e.target.value)}
                                            placeholder="+855"
                                            className={errors?.phone_4 && 'border-destructive'}
                                        />
                                        {errors?.phone_4 && (
                                            <p className="text-sm text-destructive">
                                                {errors.phone_4}
                                            </p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="rank">Rank</Label>
                                        <Input
                                            id="rank"
                                            type="number"
                                            value={data.rank}
                                            onChange={(e) => setData('rank', e.target.value)}
                                            className={errors?.rank && 'border-destructive'}
                                        />
                                        {errors?.rank && (
                                            <p className="text-sm text-destructive">
                                                {errors.rank}
                                            </p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                    <Label htmlFor="type">Type</Label>
                                    <Select
                                        value={data.type}
                                        onValueChange={(value) => setData('type', value)}
                                    >
                                        <SelectTrigger
                                            id="type"
                                            size="sm"
                                            className={cn("w-full", errors?.type && "border-destructive")}
                                        >
                                            <SelectValue placeholder="Select type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="driver">Driver</SelectItem>
                                            <SelectItem value="customer">Customer</SelectItem>
                                            <SelectItem value="staff">Staff</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors?.type && (
                                        <p className="text-sm text-destructive">{errors.type}</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="status">Status</Label>
                                    <Select
                                        value={data.status}
                                        onValueChange={(value) => setData('status', value)}
                                    >
                                        <SelectTrigger
                                            id="status"
                                            className={`w-full ${errors?.status ? 'border-destructive' : ''}`}
                                        >
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="pending">Pending</SelectItem>
                                            <SelectItem value="approved">Approved</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors?.status && (
                                        <p className="text-sm text-destructive">
                                            {errors.status}
                                        </p>
                                    )}
                                </div>
                                    <div className="space-y-2 md:col-span-2">
                                        <Label htmlFor="address">Address</Label>
                                        <Input
                                            id="address"
                                            value={data.address}
                                            onChange={(e) => setData('address', e.target.value)}
                                            className={errors?.address && 'border-destructive'}
                                        />
                                        {errors?.address && (
                                            <p className="text-sm text-destructive">
                                                {errors.address}
                                            </p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="avatar_url">Avatar URL</Label>
                                        <Input
                                            id="avatar_url"
                                            value={data.avatar_url}
                                            onChange={(e) => setData('avatar_url', e.target.value)}
                                            className={errors?.avatar_url && 'border-destructive'}
                                        />
                                        {errors?.avatar_url && (
                                            <p className="text-sm text-destructive">
                                                {errors.avatar_url}
                                            </p>
                                        )}
                                    </div>
                                    {(data.is_fixed_otp || data.is_fixed_otp != 0) && (
                                        <div className="space-y-2">
                                            <Label htmlFor="otp">OTP</Label>
                                            <Input
                                                id="otp"
                                                value={data.otp}
                                                onChange={(e) => setData('otp', e.target.value)}
                                                className={errors?.otp && 'border-destructive'}
                                            />
                                            {errors?.otp && (
                                                <p className="text-sm text-destructive">
                                                    {errors.otp}
                                                </p>
                                            )}
                                        </div>
                                    )}
                                    <div className="space-y-2">
                                        <Label htmlFor="latitude">Latitude</Label>
                                        <Input
                                            id="latitude"
                                            type="number"
                                            step="0.00000001"
                                            value={data.latitude}
                                            onChange={(e) => setData('latitude', e.target.value)}
                                            className={errors?.latitude && 'border-destructive'}
                                        />
                                        {errors?.latitude && (
                                            <p className="text-sm text-destructive">
                                                {errors.latitude}
                                            </p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="longitude">Longitude</Label>
                                        <Input
                                            id="longitude"
                                            type="number"
                                            step="0.00000001"
                                            value={data.longitude}
                                            onChange={(e) => setData('longitude', e.target.value)}
                                            className={errors?.longitude && 'border-destructive'}
                                        />
                                        {errors?.longitude && (
                                            <p className="text-sm text-destructive">
                                                {errors.longitude}
                                            </p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="location_name">Location name</Label>
                                        <Input
                                            id="location_name"
                                            value={data.location_name}
                                            onChange={(e) => setData('location_name', e.target.value)}
                                            className={errors?.location_name && 'border-destructive'}
                                        />
                                        {errors?.location_name && (
                                            <p className="text-sm text-destructive">
                                                {errors.location_name}
                                            </p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="rotation">Rotation</Label>
                                        <Input
                                            id="rotation"
                                            type="number"
                                            step="0.01"
                                            value={data.rotation}
                                            onChange={(e) => setData('rotation', e.target.value)}
                                            className={errors?.rotation && 'border-destructive'}
                                        />
                                        {errors?.rotation && (
                                            <p className="text-sm text-destructive">
                                                {errors.rotation}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="is_active"
                                        checked={data.is_active}
                                        onCheckedChange={(checked) =>
                                            setData('is_active', checked === true)
                                        }
                                    />
                                    <Label
                                        htmlFor="is_active"
                                        className="text-sm font-normal text-muted-foreground cursor-pointer"
                                    >
                                        Active
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="is_fixed_otp"
                                        checked={data.is_fixed_otp}
                                        onCheckedChange={(checked) =>
                                            setData('is_fixed_otp', checked === true)
                                        }
                                    />
                                    <Label
                                        htmlFor="is_fixed_otp"
                                        className="text-sm font-normal text-muted-foreground cursor-pointer"
                                    >
                                        Fixed OTP
                                    </Label>
                                </div>
                                <SheetFooter className="mt-4 pl-0 flex-row">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setSheetOpen(false)}
                                        disabled={processing}
                                    >
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={processing}>
                                        {processing ? 'Saving...' : 'Save'}
                                    </Button>
                                </SheetFooter>
                            </ScrollArea>
                        </form>
                    </SheetContent>
                </Sheet>

                <Card>
                    <CardContent>
                        {clientItems.length === 0 ? (
                            <p className="text-sm text-muted-foreground">
                                No clients found. Adjust your filters or create a new client.
                            </p>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Account code</TableHead>
                                        <TableHead>Company</TableHead>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Phone</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Work status</TableHead>
                                        <TableHead>Active</TableHead>
                                        <TableHead>Created</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                            <TableBody>
                                {clientItems.map((client) => (
                                    <TableRow key={client.uuid}>
                                        <TableCell>{client.account_code}</TableCell>
                                        <TableCell className="max-w-xs truncate">
                                            {client.company?.name ?? '-'}
                                        </TableCell>
                                        <TableCell className="max-w-xs truncate">
                                            {[client.first_name, client.last_name]
                                                .filter(Boolean)
                                                .join(' ')}
                                        </TableCell>
                                        <TableCell className="capitalize">
                                            {client.type}
                                        </TableCell>
                                        <TableCell>{client.phone}</TableCell>
                                        <TableCell>
                                            <span
                                                className={cn(
                                                    'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize',
                                                    client.status === 'approved'
                                                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                                        : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
                                                )}
                                            >
                                                {client.status}
                                            </span>
                                        </TableCell>
                                        <TableCell className="capitalize">
                                            {client.work_status ?? '-'}
                                        </TableCell>
                                        <TableCell>
                                            <span
                                                className={cn(
                                                    'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
                                                    client.is_active
                                                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                                        : 'bg-muted text-muted-foreground',
                                                )}
                                            >
                                                {client.is_active ? 'Yes' : 'No'}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            {client.created_at
                                                ? new Date(client.created_at).toLocaleString()
                                                : ''}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="size-8"
                                                    >
                                                        <IconDots className="size-3.5" />
                                                        <span className="sr-only">
                                                            Open actions
                                                        </span>
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent
                                                    align="end"
                                                    className="min-w-[140px] rounded-lg"
                                                >
                                                    <DropdownMenuItem
                                                        onClick={() => {
                                                            startEdit(client);
                                                            setSheetOpen(true);
                                                        }}
                                                    >
                                                        Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        variant="destructive"
                                                        onSelect={(e) => e.preventDefault()}
                                                        onClick={() => {
                                                            setClientToDelete(client);
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
                            emptyCount={clientItems.length}
                            label="clients"
                        />
                    </CardContent>
                </Card>

                <Dialog
                    open={resetPasswordDialogOpen}
                    onOpenChange={(open) => {
                        setResetPasswordDialogOpen(open);
                        if (!open) {
                            setResetPasswordValue('');
                        }
                    }}
                >
                    <DialogContent className="w-1/2 max-w-xl">
                        <DialogHeader>
                            <DialogTitle>
                                <span className="inline-flex items-center gap-3">
                                    <span className="flex size-7 items-center justify-center rounded-full bg-primary/10 text-primary">
                                        <IconKey className="size-4" />
                                    </span>
                                    <span>Reset password</span>
                                </span>
                            </DialogTitle>
                            <DialogDescription>
                                Enter a new password for this client. It will be updated when you save the form.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-3">
                            <Input
                                type="password"
                                value={resetPasswordValue}
                                onChange={(e) => setResetPasswordValue(e.target.value)}
                                autoFocus
                            />
                        </div>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    setResetPasswordDialogOpen(false);
                                    setResetPasswordValue('');
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="button"
                                disabled={!resetPasswordValue}
                                onClick={() => {
                                    setData('password', resetPasswordValue);
                                    setResetPasswordDialogOpen(false);
                                }}
                            >
                                Apply
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                <ConfirmAlertDialog
                    open={deleteDialogOpen}
                    onOpenChange={(open) => {
                        setDeleteDialogOpen(open);
                        if (!open) {
                            setClientToDelete(null);
                        }
                    }}
                    title="Delete client"
                    icon={
                        <span className="flex size-7 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                            <IconTrash className="size-4" />
                        </span>
                    }
                    confirmLabel="Delete"
                    cancelLabel="Cancel"
                    confirmClassName="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    confirmDisabled={!clientToDelete}
                    onConfirm={() => handleDelete(clientToDelete)}
                >
                    This will permanently delete{' '}
                    <span className="font-semibold text-foreground">
                        {clientToDelete ? [clientToDelete.first_name, clientToDelete.last_name].filter(Boolean).join(' ') || clientToDelete.account_code : 'this client'}
                    </span>{' '}
                    and remove it from all lists. This action cannot be undone.
                </ConfirmAlertDialog>
            </div>
        </AppLayout>
    );
}
