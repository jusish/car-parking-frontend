
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
  backHref?: string;
}

export function PageHeader({
  title,
  description,
  actionLabel,
  onAction,
  className,
  backHref,
}: PageHeaderProps) {
  return (
    <div className={cn('flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6', className)}>
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{title}</h1>
        {description && <p className="text-muted-foreground mt-1">{description}</p>}
      </div>
      {actionLabel && onAction && (
        <Button onClick={onAction} className="whitespace-nowrap">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
