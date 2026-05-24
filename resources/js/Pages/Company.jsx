import { useEffect, useMemo, useState } from 'react';
import { useForm, usePage, router } from '@inertiajs/react';
import { AppLayout } from '@/Layouts/AppLayout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
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
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Pagination } from '@/components/Pagination';
import { ConfirmAlertDialog } from '@/components/ConfirmAlertDialog';
import { toast } from '@/components/AppSonner';
import { cn } from '@/lib/utils';
import {
    IconChevronDown,
    IconDots,
    IconFilter,
    IconFolder,
    IconPlus,
    IconRefresh,
    IconSearch,
    IconSparkles,
    IconTrash,
    IconUsers,
} from '@tabler/icons-react';

function CompanyHeaderActions({ onNewClick, search, onSearchChange }) {
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
                                placeholder="Search by company name"
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

export default function Company({ companies, search: initialSearch = '' }) {
    const { errors } = usePage().props;
    const [editingUuid, setEditingUuid] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [companyToDelete, setCompanyToDelete] = useState(null);
    const [requestError, setRequestError] = useState(null);

    const { data, setData, post, put, reset, processing } = useForm({
        code: '',
        name: '',
        description: '',
        is_public: false,
        is_active: true,
        logo_url: '',
    });

    const resetForm = () => {
        setEditingUuid(null);
        reset({
            code: '',
            name: '',
            description: '',
            is_public: false,
            is_active: true,
            logo_url: '',
        });
    };

    const startCreate = () => {
        resetForm();
    };

    const startEdit = (company) => {
        setEditingUuid(company.uuid);
        setData({
            code: company.code ?? '',
            name: company.name ?? '',
            description: company.description ?? '',
            is_public: company.is_public ?? false,
            is_active: company.is_active ?? true,
            logo_url: company.logo_url ?? '',
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setRequestError(null);

        const isEdit = !!editingUuid;

        const onSuccess = () => {
            resetForm();
            setDialogOpen(false);
            toast.success(
                isEdit ? 'Company updated successfully.' : 'Company created successfully.',
            );
        };

        const onError = (errors) => {
            // Handle different error types
            let message = 'Unable to save company. Please try again.';

            // Check if it's a network error
            if (errors?.message?.includes('Network Error') || errors?.message?.includes('Failed to fetch')) {
                message = 'Network error. Please check your connection and try again.';
            }
            // Check for HTTP status codes
            else if (errors?.status === 404) {
                message = 'Company not found. It may have been deleted.';
            }
            else if (errors?.status === 403) {
                message = 'You do not have permission to perform this action.';
            }
            else if (errors?.status === 500) {
                message = 'Server error. Please try again later.';
            }
            // Check for validation errors (422)
            else if (errors?.status === 422) {
                // Validation errors are already handled by Inertia's errors prop
                message = 'Please check the form for errors.';
            }
            // Check for custom error message from server
            else if (errors?.message) {
                message = errors.message;
            }

            setRequestError(message);
            toast.error(message);
        };

        if (editingUuid) {
            put(`/company/${editingUuid}`, {
                preserveScroll: true,
                onSuccess,
                onError,
            });
        } else {
            post('/company', {
                preserveScroll: true,
                onSuccess,
                onError,
            });
        }
    };

    const handleDelete = (company) => {
        setRequestError(null);

        if (!company) return;

        if (editingUuid === company.uuid) {
            resetForm();
            setDialogOpen(false);
        }

        router.delete(`/company/${company.uuid}`, {
            preserveScroll: true,
            onSuccess: () => {
                setDeleteDialogOpen(false);
                setCompanyToDelete(null);
            },
            onError: (errors) => {
                // Handle different error types
                let message = 'Unable to delete company. Please try again.';

                // Check if it's a network error
                if (errors?.message?.includes('Network Error') || errors?.message?.includes('Failed to fetch')) {
                    message = 'Network error. Please check your connection and try again.';
                }
                // Check for HTTP status codes
                else if (errors?.status === 404) {
                    message = 'Company not found. It may have already been deleted.';
                }
                else if (errors?.status === 403) {
                    message = 'You do not have permission to delete this company.';
                }
                else if (errors?.status === 500) {
                    message = 'Server error. Please try again later.';
                }
                // Check for custom error message from server
                else if (errors?.message) {
                    message = errors.message;
                }

                setRequestError(message);
                toast.error(message);
            },
        });
    };

    const [search, setSearch] = useState(initialSearch || '');

    const companyItems = useMemo(() => {
        if (!companies) return [];
        // Support both plain arrays and Laravel paginator objects
        return Array.isArray(companies) ? companies : companies.data ?? [];
    }, [companies]);

    const pagination = !Array.isArray(companies) ? companies : null;

    useEffect(() => {
        // Avoid refetching immediately on first render if value matches initial
        const normalizedInitial = initialSearch || '';
        if (search === normalizedInitial) return;

        const timeout = setTimeout(() => {
            router.get(
                '/company',
                { search },
                {
                    preserveState: true,
                    replace: true,
                    preserveScroll: true,
                },
            );
        }, 300);

        return () => clearTimeout(timeout);
    }, [search, initialSearch]);

    const headerActions = (
        <CompanyHeaderActions
            onNewClick={() => {
                startCreate();
                setDialogOpen(true);
            }}
            search={search}
            onSearchChange={setSearch}
        />
    );

    return (
        <AppLayout title="Company" subHeader={headerActions}>
            <div className="space-y-6">
                <Dialog
                    open={dialogOpen}
                    onOpenChange={(open) => {
                        setDialogOpen(open);
                        if (!open) {
                            resetForm();
                        }
                    }}
                >

                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>
                                {editingUuid ? 'Edit company' : 'Create company'}
                            </DialogTitle>
                            <DialogDescription>
                                {editingUuid
                                    ? 'Update the company details below and save your changes.'
                                    : 'Fill in the details below to create a new company.'}
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2 md:col-span-1">
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
                            <div className="space-y-2 md:col-span-1">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className={cn(errors?.name && 'border-destructive')}
                                />
                                {errors?.name && (
                                    <p className="text-sm text-destructive">{errors.name}</p>
                                )}
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="description">Description</Label>
                                <textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    className={cn(
                                        'min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
                                        errors?.description && 'border-destructive',
                                    )}
                                />
                                {errors?.description && (
                                    <p className="text-sm text-destructive">{errors.description}</p>
                                )}
                            </div>
                            <div className="space-y-2 md:col-span-1">
                                <Label htmlFor="logo_url">Logo URL</Label>
                                <Input
                                    id="logo_url"
                                    value={data.logo_url}
                                    onChange={(e) => setData('logo_url', e.target.value)}
                                    className={cn(errors?.logo_url && 'border-destructive')}
                                />
                                {errors?.logo_url && (
                                    <p className="text-sm text-destructive">{errors.logo_url}</p>
                                )}
                            </div>
                            <div className="flex flex-col gap-2 md:col-span-1">
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="is_public"
                                        checked={data.is_public}
                                        onCheckedChange={(checked) =>
                                            setData('is_public', checked === true)
                                        }
                                    />
                                    <Label
                                        htmlFor="is_public"
                                        className="text-sm font-normal text-muted-foreground cursor-pointer"
                                    >
                                        Public
                                    </Label>
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
                            </div>
                            <DialogFooter className="md:col-span-2 flex justify-end gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        setDialogOpen(false);
                                    }}
                                    disabled={processing}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    {processing
                                        ? editingUuid
                                            ? 'Saving...'
                                            : 'Creating...'
                                        : editingUuid
                                            ? 'Save changes'
                                            : 'Create company'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                <Card>
                    {/* <CardHeader>
                        <CardTitle>Companies</CardTitle>
                        <CardDescription>
                            List of all companies in the system. Click edit to update, or delete to
                            remove.
                        </CardDescription>
                    </CardHeader> */}
                        <CardContent>
                        {companyItems.length === 0 ? (
                            <p className="text-sm text-muted-foreground">
                                No companies found. Create your first company above.
                            </p>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Code</TableHead>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Description</TableHead>
                                        <TableHead>Public</TableHead>
                                        <TableHead>Active</TableHead>
                                        <TableHead>Logo</TableHead>
                                        <TableHead>Created</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {companyItems.map((company) => (
                                        <TableRow key={company.uuid}>
                                            <TableCell>{company.code}</TableCell>
                                            <TableCell>{company.name}</TableCell>
                                            <TableCell className="max-w-xs truncate">
                                                {company.description}
                                            </TableCell>
                                            <TableCell>
                                                <span
                                                    className={cn(
                                                        'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
                                                        company.is_public
                                                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                                            : 'bg-muted text-muted-foreground',
                                                    )}
                                                >
                                                    {company.is_public ? 'Yes' : 'No'}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <span
                                                    className={cn(
                                                        'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
                                                        company.is_active
                                                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                                            : 'bg-muted text-muted-foreground',
                                                    )}
                                                >
                                                    {company.is_active ? 'Yes' : 'No'}
                                                </span>
                                            </TableCell>
                                            <TableCell className="max-w-[160px] truncate">
                                                {company.logo_url}
                                            </TableCell>
                                            <TableCell>
                                                {company.created_at
                                                    ? new Date(company.created_at).toLocaleString()
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
                                                                startEdit(company);
                                                                setDialogOpen(true);
                                                            }}
                                                        >
                                                            Edit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            variant="destructive"
                                                            onSelect={(event) => event.preventDefault()}
                                                            onClick={() => {
                                                                setCompanyToDelete(company);
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
                            emptyCount={companyItems.length}
                            label="companies"
                        />
                    </CardContent>
                </Card>

                <ConfirmAlertDialog
                    open={deleteDialogOpen}
                    onOpenChange={(open) => {
                        setDeleteDialogOpen(open);
                        if (!open) {
                            setCompanyToDelete(null);
                        }
                    }}
                    title="Delete company"
                    icon={
                        <span className="flex size-7 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                            <IconTrash className="size-4" />
                        </span>
                    }
                    confirmLabel="Delete"
                    cancelLabel="Cancel"
                    confirmClassName="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    confirmDisabled={!companyToDelete}
                    onConfirm={() => handleDelete(companyToDelete)}
                >
                    This will permanently delete{' '}
                    <span className="font-semibold text-foreground">
                        {companyToDelete?.name ?? 'this company'}
                    </span>{' '}
                    and remove it from all lists. This action cannot be undone.
                </ConfirmAlertDialog>
            </div>
        </AppLayout>
    );
}

