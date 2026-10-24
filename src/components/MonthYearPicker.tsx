"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export function MonthYearPicker({
  month,
  year,
  years,
}: {
  month: number;
  year: number;
  years: number[];
}) {
  const router = useRouter();
  // Local state, not just the server-provided props: two quick selections
  // (month, then year) can otherwise race - the second one would compute
  // its URL from a prop that hasn't caught up with the first change yet
  // and silently revert it.
  const [selectedMonth, setSelectedMonth] = useState(month);
  const [selectedYear, setSelectedYear] = useState(year);

  useEffect(() => setSelectedMonth(month), [month]);
  useEffect(() => setSelectedYear(year), [year]);

  function go(newMonth: number, newYear: number) {
    setSelectedMonth(newMonth);
    setSelectedYear(newYear);
    router.push(`/?month=${newMonth}&year=${newYear}`);
  }

  return (
    <div className="flex gap-2">
      <select
        aria-label="Month"
        value={selectedMonth}
        onChange={(e) => go(Number(e.target.value), selectedYear)}
        className="rounded-md border border-line-border bg-transparent px-3 py-2 text-sm text-ink-primary"
      >
        {MONTH_NAMES.map((name, i) => (
          <option key={name} value={i + 1}>
            {name}
          </option>
        ))}
      </select>
      <select
        aria-label="Year"
        value={selectedYear}
        onChange={(e) => go(selectedMonth, Number(e.target.value))}
        className="rounded-md border border-line-border bg-transparent px-3 py-2 text-sm text-ink-primary"
      >
        {years.map((y) => (
          <option key={y} value={y}>
            {y}
          </option>
        ))}
      </select>
    </div>
  );
}
