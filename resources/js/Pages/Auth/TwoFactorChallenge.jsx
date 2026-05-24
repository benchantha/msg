import { useForm } from '@inertiajs/react';

export default function TwoFactorChallenge() {
    const { data, setData, post, processing, errors } = useForm({
        code: '',
        recovery_code: '',
    });

    const submitCode = (e) => {
        e.preventDefault();
        post('/two-factor-challenge', { data: { code: data.code } });
    };

    const submitRecovery = (e) => {
        e.preventDefault();
        post('/two-factor-challenge', { data: { recovery_code: data.recovery_code } });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
            <div className="max-w-md w-full space-y-6">
                <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
                    Two-factor authentication
                </h2>
                <form onSubmit={submitCode} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow space-y-4">
                    <div>
                        <label htmlFor="code" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Code
                        </label>
                        <input
                            id="code"
                            type="text"
                            value={data.code}
                            onChange={(e) => setData('code', e.target.value)}
                            className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white"
                            autoFocus
                        />
                        {errors.code && (
                            <p className="mt-1 text-sm text-red-600">{errors.code}</p>
                        )}
                    </div>
                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
                    >
                        Verify
                    </button>
                </form>
                <form onSubmit={submitRecovery} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow space-y-4">
                    <div>
                        <label htmlFor="recovery_code" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Recovery code
                        </label>
                        <input
                            id="recovery_code"
                            type="text"
                            value={data.recovery_code}
                            onChange={(e) => setData('recovery_code', e.target.value)}
                            className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 disabled:opacity-50"
                    >
                        Use recovery code
                    </button>
                </form>
            </div>
        </div>
    );
}
