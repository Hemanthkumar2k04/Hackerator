import { BackgroundGradient } from '@/components/ui/background-gradient';

export function WorkInProgressCard() {
  return (
    <BackgroundGradient
      containerClassName="w-full max-w-4xl rounded-[2.5rem] p-[2px]"
      className="rounded-[2.5rem]"
    >
      <div className="rounded-[2.5rem] border border-border/70 bg-card/90 px-10 py-14 text-center shadow-2xl">
        <p className="text-sm uppercase tracking-[0.4em] text-muted-foreground">Status</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight">Work in progress</h1>
        <p className="mt-4 text-base text-muted-foreground">
          We’re building something powerful. Join the waitlist to unlock collaborative AI workflows tailored for founders and growth teams.
        </p>
      </div>
    </BackgroundGradient>
  );
}
