export default function SkeletonCard() {
  return (
    <div className="bg-surface border border-border rounded-xl p-5 animate-pulse">
      <div className="h-4 bg-border rounded w-2/3 mb-3"></div>
      <div className="h-3 bg-border rounded w-1/3 mb-2"></div>
      <div className="h-3 bg-border rounded w-1/2 mb-4"></div>
      <div className="h-8 bg-border rounded w-full"></div>
    </div>
  );
}