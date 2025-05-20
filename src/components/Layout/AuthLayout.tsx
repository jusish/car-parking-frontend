
import { Outlet } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface AuthLayoutProps {
  className?: string;
}

export function AuthLayout({ className }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted/30">
      <div className={cn('w-full max-w-md p-6 bg-background rounded-lg shadow-lg', className)}>
        <Outlet />
      </div>
    </div>
  );
}
