// import React, { createContext, useContext, ReactNode } from 'react';
// import { useStorageState } from "@/hooks/useStorageState";
// import { useQueryClient } from "@tanstack/react-query";
// import { useRouter } from "expo-router";
// // Tip za userData
// export interface UserData {
//     id: number;
//     name: string;
//     last_name: string;
//     email: string;
//     role: string;
//     profession?: string;
//     contactInfo: string;
// }
//
// interface AuthContextType {
//     token: string | null;
//     userData: UserData | null;
//     isLoading: boolean;
//     signIn: (token: string, userData: UserData) => void;
//     signOut: () => void;
// }
//
// const AuthContext = createContext<AuthContextType>({
//     token: null,
//     userData: null,
//     isLoading: false,
//     signIn: () => {},
//     signOut: () => {},
// });
//
// export function useAuth() {
//     return useContext(AuthContext);
// }
//
// export function AuthProvider({ children }: { children: ReactNode }) {
//     const [[isLoading, token], setToken] = useStorageState<string>('userToken');
//     const [[_, userData], setUserData] = useStorageState<UserData>('userData');
//     const queryClient = useQueryClient();
//     const router = useRouter();
//
//     const signIn = (newToken: string, newUserData: UserData) => {
//         setToken(newToken);
//         setUserData(newUserData);
//
//         // Osveži user-specific kešove
//         queryClient.invalidateQueries({ queryKey: ["workers"] });
//         queryClient.invalidateQueries({ queryKey: ["jobPosts"] });
//     };
//
//     const signOut = () => {
//         setToken(null);
//         setUserData(null);
//
//         // očisti cache
//         queryClient.clear();
//
//         // redirect na login
//         router.replace("/login");
//     };
//
//     return (
//         <AuthContext.Provider value={{ token, userData, isLoading, signIn, signOut }}>
//             {children}
//         </AuthContext.Provider>
//     );
// }
//
// providers/AuthProvider.tsx
import React, { createContext, useContext, ReactNode } from 'react';
import { useStorageState } from "@/hooks/useStorageState";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";

export interface UserData {
    id: number;
    name: string;
    last_name: string;
    email: string;
    role: string;
    profession?: string;
    contactInfo: string;
    description?: string;
}

interface AuthContextType {
    token: string | null;
    userData: UserData | null;
    isLoading: boolean;
    signIn: (token: string, userData: UserData) => void;
    signOut: () => void;
}

const AuthContext = createContext<AuthContextType>({
    token: null,
    userData: null,
    isLoading: true,
    signIn: () => {},
    signOut: () => {},
});

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [[isLoadingToken, token], setToken] = useStorageState<string>('userToken');
    const [[isLoadingUser, userData], setUserData] = useStorageState<UserData>('userData');
    const queryClient = useQueryClient();
    const router = useRouter();

    const signIn = (newToken: string, newUserData: UserData) => {
        setToken(newToken ?? null);
        setUserData(newUserData ?? null);

        queryClient.invalidateQueries({ queryKey: ["workers"] });
        queryClient.invalidateQueries({ queryKey: ["jobPosts"] });
    };

    const signOut = () => {
        setToken(null);
        setUserData(null);
        queryClient.clear();
        router.replace("/login");
    };

    const isLoading = isLoadingToken || isLoadingUser;

    return (
        <AuthContext.Provider value={{ token, userData, isLoading, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}

