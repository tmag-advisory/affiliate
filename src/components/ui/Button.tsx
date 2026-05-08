import type { ReactNode, ButtonHTMLAttributes } from "react";
import { cn } from "../../lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "ghost" | "danger";
    size?: "sm" | "md" | "lg";
    children: ReactNode;
    loading?: boolean;
}

const variants = {
    primary:
        "bg-accent text-white hover:bg-accent/90 shadow-[0_2px_6px_-2px_rgba(42,122,106,0.3)]",
    secondary:
        "bg-button-secondary text-heading hover:bg-button-secondary/80 border border-border-light/60",
    ghost:
        "bg-transparent text-muted hover:text-heading hover:bg-button-secondary/50",
    danger:
        "bg-danger text-white hover:bg-danger/90",
};

const sizes = {
    sm: "px-3 py-1.5 text-xs rounded-xl",
    md: "px-4 py-2.5 text-sm rounded-xl",
    lg: "px-6 py-3 text-base rounded-2xl",
};

const Button = ({
    variant = "primary",
    size = "md",
    className,
    children,
    loading,
    disabled,
    ...props
}: ButtonProps) => {
    return (
        <button
            className={cn(
                "inline-flex items-center justify-center gap-2 font-medium transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
                variants[variant],
                sizes[size],
                className,
            )}
            disabled={disabled || loading}
            {...props}
        >
            {loading && (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            )}
            {children}
        </button>
    );
};

export default Button;
