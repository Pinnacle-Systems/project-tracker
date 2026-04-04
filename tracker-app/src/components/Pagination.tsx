'use client';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export function Pagination({ totalPages, currentPage, totalCount }: { totalPages: number, currentPage: number, totalCount: number }) {
    const pathname = usePathname();
    const { replace } = useRouter();
    const searchParams = useSearchParams();
    const currentLimit = searchParams.get('limit') || '25';
    const updateURL = (page: number, limit: any) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', page.toString());
        params.set('limit', limit);
        replace(`${pathname}?${params.toString()}`);
    };
    return (
        <div className="flex items-center gap-2 ml-[5px]">
            <div className="">Items per page : </div>
            <select className="mr-2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm p-[2px] border bg-white"
                value={currentLimit} onChange={(e) => updateURL(currentPage, e.target.value)}>
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
                <option value="200">200</option>
                <option value="all">All</option>
            </select>
            <button
                disabled={currentPage <= 1 || currentLimit === 'all'}
                onClick={() => updateURL(currentPage - 1, currentLimit)}
            >
                <div className="bg-gray-200 p-[5px] w-[30px] h-[30px] rounded-[50%] cursor-pointer">{'<'}</div>
            </button>
            <span>Page {currentPage} of {currentLimit === 'all' ? '1' :totalPages}</span>
            <span> | {totalCount} Entries</span>
            <button
                disabled={currentPage >= totalPages || currentLimit === 'all'}
                onClick={() => updateURL(currentPage + 1, currentLimit)}
            >
                <div className="bg-gray-200 p-[5px] w-[30px] h-[30px] rounded-[50%] cursor-pointer">{'>'}</div>
            </button>
        </div>
    );
}
