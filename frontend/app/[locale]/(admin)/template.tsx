import { Suspense } from "react";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="fixed inset-0 grid place-items-center bg-white/70 backdrop-blur-sm">
          <div className="animate-spin size-8 rounded-full border-4 border-primary/30 border-t-primary" />
        </div>
      }
    >
      {children}
    </Suspense>
  );
}
