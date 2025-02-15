"use client"; // ✅ This makes it a client component

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export default function Providers({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(() => new QueryClient()); // ✅ Create QueryClient

    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
