import { cn } from "@/src/lib/utils";

export function SectionLayout({
                                          bg,
                                          className,
                                          children,
                                      }: {
    bg?: string;
    className?: string;
    children: React.ReactNode;
}) {
    return (
        <section
            className={cn("w-full", className)}
            style={{
                backgroundImage: bg,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
            }}
        >
            {children}
        </section>
    );
}