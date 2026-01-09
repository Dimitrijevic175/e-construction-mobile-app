// components/ui/Input.tsx
import { TextInput, View, Text } from "react-native";
import { forwardRef } from "react";
import { clsx } from "clsx";

interface InputProps {
    label?: string;
    placeholder?: string;
    className?: string;
    error?: string;
    [x: string]: any; // za ostale props
}

const Input = forwardRef<TextInput, InputProps>(
    ({ label, placeholder, className, error, ...props }, ref) => {
        return (
            <View className="w-full mb-4">
                {label && (
                    <Text className="text-sm  text-gray-500 mb-1 font-nunito ">
                        {label}
                    </Text>
                )}
                <TextInput
                    ref={ref}
                    placeholder={placeholder}
                    placeholderTextColor="#9ca3af" // tailwind gray-400
                    className={clsx(
                        "w-full border border-gray-300 rounded-xl px-4 py-3 text-base text-gray-900 bg-white",
                        "focus:border-3 focus:border-blue-600 focus:ring-3 focus:ring-blue-300 font-nunito",
                        error && "border-red-500",
                        className
                    )}
                    {...props}
                />
                {error && (
                    <Text className="text-xs text-red-500 mt-1 font-nunito">
                        {error}
                    </Text>
                )}
            </View>
        );
    }
);

export default Input;
