// components/ui/Button.tsx
import { Text, Pressable } from "react-native";
import { clsx } from "clsx";
import React from "react";

interface ButtonProps {
    children: React.ReactNode;
    className?: string;
    onPress?: () => void;
    disabled?: boolean;
    variant?: "primary" | "secondary" | "danger" | "success"; // možeš proširiti
}

export default function Button({
                                   children,
                                   className,
                                   onPress,
                                   disabled = false,
                                   variant = "primary",
                               }: ButtonProps) {
    const baseStyles =
        "px-9 py-3 rounded-xl justify-center items-center flex-row";

    const variants = {
        primary: "bg-primary disabled:bg-primary/50",
        secondary: "bg-secondary disabled:bg-secondary/50",
        success: "bg-success disabled:bg-success/50",
        danger: "bg-danger disabled:bg-danger/50",
    };

    const textVariants = {
        primary: "text-white font-semibold font-nunito",
        secondary: "text-white font-semibold",
        success: "text-white font-semibold",
        danger: "text-white font-semibold",
    };

    return (
        <Pressable
            onPress={onPress}
            disabled={disabled}
            className={clsx(baseStyles, variants[variant], className)}
            style={({ pressed }) => ({
                opacity: pressed ? 0.7 : 1
            })}
        >
            <Text className={clsx(textVariants[variant], "font-nunito-bold text-base")}>
                {children}
            </Text>
        </Pressable>
    );
}
