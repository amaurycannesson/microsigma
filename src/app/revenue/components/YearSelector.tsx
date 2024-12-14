'use client';

import { useSelectedLayoutSegment } from 'next/navigation';
import { useActionState, useRef } from 'react';

export default function YearSelector({
  years,
  onSelected,
}: {
  years: string[];
  onSelected: (state: string | null, formData: FormData) => Promise<string | null>;
}) {
  const recentYear = years.length ? years[0] : null;
  const initialYear = useSelectedLayoutSegment() || recentYear;
  const form = useRef<HTMLFormElement | null>(null);
  const [selectedYear, onSubmit] = useActionState<string | null, FormData>(onSelected, initialYear);

  if (!selectedYear) {
    return <></>;
  }

  return (
    <form ref={form} action={onSubmit}>
      <select
        name="selectedYear"
        onChange={() => form.current?.requestSubmit()}
        value={selectedYear}
        className="block w-20 rounded-lg border border-gray-300 bg-gray-50 p-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
      >
        {years.map((y) => (
          <option key={y} value={y}>
            {y}
          </option>
        ))}
      </select>
    </form>
  );
}
