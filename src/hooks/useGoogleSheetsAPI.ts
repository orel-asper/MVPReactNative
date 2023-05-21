import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_KEY, SPREADSHEET_ID } from '@env';

interface Cell {
    value: string;
}

type UseGoogleSheetsAPIResponse = {
    data: Cell[][];
    loading: boolean;
    refetch: () => Promise<void>;
};

const useGoogleSheetsAPI = (sheetName: string): UseGoogleSheetsAPIResponse => {
    const [data, setData] = useState<Cell[][]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const POLLING_INTERVAL = 5000;

    const fetchData = async () => {
        try {
            const result = await axios.get(
                `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${sheetName}?valueRenderOption=FORMATTED_VALUE&key=${API_KEY}`
            );
            setData(result.data.values.map((row: any) => row.map((value: any) => ({ value }))));
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        const intervalId = setInterval(fetchData, POLLING_INTERVAL);
        return () => clearInterval(intervalId);
    }, []);

    return { data, loading, refetch: fetchData };
};

export default useGoogleSheetsAPI;
