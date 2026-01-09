// app/hooks/useSecureStorage.ts
import * as SecureStore from 'expo-secure-store';
import { useState, useEffect } from 'react';

export function useSecureStorage(key: string) {
    const [value, setValue] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadValue = async () => {
            try {
                const storedValue = await SecureStore.getItemAsync(key);
                setValue(storedValue);
            } catch (err) {
                console.error('Error reading secure store:', err);
            } finally {
                setIsLoading(false);
            }
        };
        loadValue();
    }, [key]);

    const saveValue = async (newValue: string | null) => {
        try {
            if (newValue === null) {
                await SecureStore.deleteItemAsync(key);
            } else {
                await SecureStore.setItemAsync(key, newValue);
            }
            setValue(newValue);
        } catch (err) {
            console.error('Error writing secure store:', err);
        }
    };

    return [[isLoading, value], saveValue] as const;
}
