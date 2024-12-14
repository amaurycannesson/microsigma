'use client';

import { formatCurrency } from '@/app/utils';
import { ResponsiveBar } from '@nivo/bar';

export default function RevenueChart({
  data,
}: {
  data: { month: string; Bénéfices: number; Taxes: number }[];
}) {
  return (
    <div className="h-60 w-full">
      <ResponsiveBar
        data={data}
        keys={['Bénéfices', 'Taxes']}
        indexBy="month"
        margin={{ top: 20, right: 30, bottom: 40, left: 50 }}
        valueFormat={(v) => formatCurrency(v)}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
        }}
        colors={{ scheme: 'category10' }}
        labelTextColor={'white'}
      ></ResponsiveBar>
    </div>
  );
}
