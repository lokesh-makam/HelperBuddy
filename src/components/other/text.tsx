import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/src/lib/utils";

// Define text variants using CVA
const textVariants = cva("", {
    variants: {
        family: {
            inter: "font-inter",
            poppins: "font-poppins",
        },
        size: {
            xs: "text-xs",
            sm: "text-sm",
            base: "text-base",
            lg: "text-lg",
            xl: "text-xl",
            "2xl": "text-2xl",
            "3xl": "text-[34px]",
        },
        weight: {
            400: "font-normal",
            500: "font-medium",
            600: "font-semibold",
            700: "font-bold",
        },
        transform: {
            uppercase: "uppercase",
            lowercase: "lowercase",
            capitalize: "capitalize",
        },
        color: {
            "black/900": "text-[#121212]",
            "black/800": "text-[#141718]",
            white: "text-white",
            "white/900": "text-[#FEFEFE]",
            "white/800": "text-[#E8ECEF]",
            gray: "text-[#6C7275]",
            blue: "text-[#377DFF]",
        },
    },
    defaultVariants: {
        family: "inter",
        size: "base",
        weight: 400,
        color: "black/900",
    },
});

// Define TextProps interface
export interface TextProps
    extends VariantProps<typeof textVariants>,
        Omit<React.HTMLProps<HTMLParagraphElement>, "color" | "size"> {}

// Text component
export const Text: React.FC<TextProps> = ({
                                       size,
                                       weight,
                                       family,
                                       color,
                                       transform,
                                       className,
                                       ...props
                                   }) => {
    return (
        <p
            className={cn(
                textVariants({ size, weight, family, color, transform }), // Apply textVariants
                className // Merge additional className
            )}
            {...props}
        />
    );
};
