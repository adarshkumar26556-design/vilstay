export default function LoadingSpinner({ size = 'md', text = '' }) {
  const s = size === 'lg' ? 'w-12 h-12 border-4' : size === 'sm' ? 'w-5 h-5 border-2' : 'w-8 h-8 border-3';
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16">
      <div className={`${s} border-primary-100 border-t-primary-600 rounded-full animate-spin`} />
      {text && <p className="text-gray-400 text-sm">{text}</p>}
    </div>
  );
}
