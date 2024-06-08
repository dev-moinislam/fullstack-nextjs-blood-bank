'use client'
import React, { useState, useEffect } from 'react';
import moment from 'moment';
import toast from 'react-hot-toast';

const DonarListContent = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [recordedData, setRecordedData] = useState([] as any);
    const [loading, setLoading] = useState(false);
    const [deletingItemId, setDeletingItemId] = useState(null);

    const getDonarRecord = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/inventory/donar-list');
            if (!response.ok) {
                console.log('Network response was not ok');
                setIsLoading(false);
                return;
            }
            const data = await response.json();
            setRecordedData(data.donarData);
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getDonarRecord();
    }, []);

    const handleDelete = async (id: any) => {
        try {
            setDeletingItemId(id);
            setLoading(true);
            const response = await fetch(
                '/api/user/delete',
                {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(id),
                }
            );

            if (!response.ok) {
                toast.error('Delete request failed');
                setLoading(false);
                return;
            }
            const data = await response.json();
            toast.success(data.message);
            // Re-fetch data to ensure the list is updated
            await getDonarRecord();
        } catch (error) {
            console.log('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-[100vw] lg:w-[65vw] overflow-x-scroll md:overflow-x-auto p-8">
            {isLoading ? (
                <div className='min-h-[300px] flex justify-center items-center font-bold text-red-500'>Loading...</div>
            ) : (
                <table className="min-w-full bg-white border rounded-lg overflow-hidden">
                    <thead className="bg-gray-200">
                        <tr className="text-gray-700">
                            <th scope="col" className="px-6 py-3 text-left font-bold">Donar Name</th>
                            <th scope="col" className="px-6 py-3 text-left font-bold">Email</th>
                            <th scope="col" className="px-6 py-3 text-left font-bold">Phone</th>
                            <th scope="col" className="px-6 py-3 text-left font-bold">Date</th>
                            <th scope="col" className="px-6 py-3 text-left font-bold">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {recordedData?.map((item: any) => (
                            <tr key={item._id} className="hover:bg-gray-100">
                                <td className="p-3">{item.name}</td>
                                <td className="p-3">{item.email}</td>
                                <td className="p-3">{item.phone}</td>
                                <td className="p-3 text-sm">{moment(item.createdAt).format('DD/MM/YYYY hh:mm A')}</td>
                                <td className="p-3">
                                    {deletingItemId === item._id ? (
                                        'Deleting...'
                                    ) : (
                                        <span
                                            className="cursor-pointer text-blue-500 z-5"
                                            onClick={() => handleDelete(item._id)}
                                        >
                                            Delete
                                        </span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default DonarListContent;
