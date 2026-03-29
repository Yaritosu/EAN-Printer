type ValidationSummaryProps = {
  issues: string[];
};

export const ValidationSummary = ({ issues }: ValidationSummaryProps) => {
  if (issues.length === 0) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
      <p className="font-semibold">Druck blockiert</p>
      <ul className="mt-2 space-y-1">
        {issues.map((issue) => (
          <li key={issue}>{issue}</li>
        ))}
      </ul>
    </div>
  );
};
