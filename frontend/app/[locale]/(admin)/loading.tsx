export default function Loading() {
  return (
    <div className="p-6">
      <div className="h-6 w-40 mb-4 rounded bg-primary/10 animate-pulse" />
      <div className="rounded-xl border border-primary/20 p-4">
        {/* baris skeleton */}
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-10 w-full mb-2 rounded bg-primary/10 animate-pulse" />
        ))}
      </div>
    </div>
  );
}
