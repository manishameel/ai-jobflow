const STAGES = ['applied', 'assessment', 'interview', 'offer'];

const LABELS = {
  applied: 'Applied',
  assessment: 'Assessment',
  interview: 'Interview',
  offer: 'Offer'
};

export default function StatusPipeline({ status }) {
  if (status === 'rejected') {
    return (
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-status-rejected" />
        <span className="text-xs text-status-rejected font-medium">Rejected</span>
      </div>
    );
  }

  const currentIndex = STAGES.indexOf(status);

  return (
    <div className="flex items-center">
      {STAGES.map((stage, index) => {
        const isDone = index <= currentIndex;
        const isLast = index === STAGES.length - 1;

        return (
          <div key={stage} className="flex items-center">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={
                  'w-2.5 h-2.5 rounded-full transition-colors ' +
                  (isDone ? 'bg-accent' : 'bg-border')
                }
              />
              <span className={'text-[10px] whitespace-nowrap ' + (isDone ? 'text-text-primary' : 'text-text-muted')}>
                {LABELS[stage]}
              </span>
            </div>
            {!isLast && (
              <div
                className={
                  'h-px w-8 mb-4 transition-colors ' +
                  (index < currentIndex ? 'bg-accent' : 'bg-border')
                }
              />
            )}
          </div>
        );
      })}
    </div>
  );
}