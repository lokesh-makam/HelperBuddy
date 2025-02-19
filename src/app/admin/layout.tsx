import Providers from "@/src/components/Providers";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-gray-100">
    <Providers>
      {children}
      </Providers>
      </div>;
}
