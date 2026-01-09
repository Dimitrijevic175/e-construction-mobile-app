// import { useEffect, useCallback, useReducer } from 'react';
// import * as SecureStore from 'expo-secure-store';
// import { Platform } from 'react-native';
//
// type UseStateHook<T> = [[boolean, T | null], (value: T | null) => void];
//
// function useAsyncState<T>(initialValue: [boolean, T | null] = [true, null]): UseStateHook<T> {
//     return useReducer(
//         (state: [boolean, T | null], action: T | null = null): [boolean, T | null] => [false, action],
//         initialValue
//     ) as UseStateHook<T>;
// }
//
// export async function setStorageItemAsync<T>(key: string, value: T | null) {
//     const stringValue = value !== null ? JSON.stringify(value) : null;
//
//     if (Platform.OS === 'web') {
//         try {
//             if (stringValue === null) {
//                 localStorage.removeItem(key);
//             } else {
//                 localStorage.setItem(key, stringValue);
//             }
//         } catch (e) {
//             console.error('Local storage is unavailable:', e);
//         }
//     } else {
//         if (stringValue == null) {
//             await SecureStore.deleteItemAsync(key);
//         } else {
//             await SecureStore.setItemAsync(key, stringValue);
//         }
//     }
// }
//
// export function useStorageState<T>(key: string): UseStateHook<T> {
//     const [state, setState] = useAsyncState<T>();
//
//     useEffect(() => {
//         const loadValue = async () => {
//             let stored: string | null = null;
//
//             if (Platform.OS === 'web') {
//                 try {
//                     stored = localStorage.getItem(key);
//                 } catch (e) {
//                     console.error('Local storage is unavailable:', e);
//                 }
//             } else {
//                 stored = await SecureStore.getItemAsync(key);
//             }
//
//             if (stored) {
//                 try {
//                     // pokušaj da parsiraš JSON
//                     const parsed = JSON.parse(stored);
//                     setState(parsed);
//                 } catch (e) {
//                     // ako nije JSON, sačuvaj kao string
//                     setState(stored as unknown as T);
//                 }
//             } else {
//                 setState(null);
//             }
//         };
//
//         loadValue();
//     }, [key]);
//
//
//     const setValue = useCallback(
//         (value: T | null) => {
//             setState(value);
//             setStorageItemAsync(key, value);
//         },
//         [key]
//     );
//
//     return [state, setValue];
// }
//
// hooks/useStorageState.ts
import { useEffect, useCallback, useReducer } from 'react';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

type UseStateHook<T> = [[boolean, T | null], (value: T | null) => void];

function useAsyncState<T>(initialValue: [boolean, T | null] = [true, null]): UseStateHook<T> {
    return useReducer(
        (state: [boolean, T | null], action: T | null = null): [boolean, T | null] => [false, action],
        initialValue
    ) as UseStateHook<T>;
}

export async function setStorageItemAsync<T>(key: string, value: T | null) {
    const stringValue = value !== null ? JSON.stringify(value) : null;

    if (Platform.OS === 'web') {
        try {
            if (stringValue === null) {
                localStorage.removeItem(key);
            } else {
                localStorage.setItem(key, stringValue);
            }
        } catch (e) {
            console.error('Local storage is unavailable:', e);
        }
    } else {
        if (stringValue == null) {
            await SecureStore.deleteItemAsync(key);
        } else {
            await SecureStore.setItemAsync(key, stringValue);
        }
    }
}

export function useStorageState<T>(key: string): UseStateHook<T> {
    const [state, setState] = useAsyncState<T>();

    useEffect(() => {
        let isMounted = true;

        const loadValue = async () => {
            let stored: string | null = null;

            if (Platform.OS === 'web') {
                try {
                    stored = localStorage.getItem(key);
                } catch {}
            } else {
                try {
                    stored = await SecureStore.getItemAsync(key);
                } catch {}
            }

            if (isMounted) {
                if (stored) {
                    try {
                        const parsed = JSON.parse(stored);
                        setState(parsed);
                    } catch {
                        setState(stored as unknown as T);
                    }
                } else {
                    setState(null);
                }
            }
        };

        loadValue();

        return () => {
            isMounted = false;
        };
    }, [key]);

    const setValue = useCallback(
        (value: T | null) => {
            setState(value ?? null);
            setStorageItemAsync(key, value ?? null);
        },
        [key]
    );

    const safeState: [boolean, T | null] = [state?.[0] ?? true, state?.[1] ?? null];

    return [safeState, setValue];
}

