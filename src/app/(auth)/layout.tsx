import { Logo } from '@/components/icons';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="mb-6 flex items-center gap-2 text-2xl font-bold text-primary">
        <Logo className="h-8 w-8" />
        <h1>YapVault</h1>
      </div>
      {children}
    </div>
  );
}
