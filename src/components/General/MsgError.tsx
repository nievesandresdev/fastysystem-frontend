import { ExclamationCircleIcon } from '@heroicons/react/24/solid'

export default function MsgError({ message }: { message: string }) {
    if (!message) return null;
    return (
        <div className="mt-2 border-2 border-red-500 bg-red-100 p-1 rounded-md flex items-center gap-1">
            <ExclamationCircleIcon className="size-5 text-red-400" />
            <p className="text-red-500 text-sm font-semibold">
                {message}
            </p>
        </div>
    );
}