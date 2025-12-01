import { Navbar } from '@/components/Navbar';
import { WorkInProgressCard } from '@/components/WorkInProgressCard';

export function WorkspacePage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar variant="auth" />
      <main className="flex-1 flex items-center justify-center p-4">
        <WorkInProgressCard />
      </main>
    </div>
  );
}
