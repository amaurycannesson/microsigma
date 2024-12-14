'use client';

import { CalendarDatum, ResponsiveTimeRange } from '@nivo/calendar';

export default function ActivityCalendar({
  data,
  from,
  to,
}: {
  data: CalendarDatum[];
  from: string;
  to: string;
}) {
  return (
    <div className="h-60 w-full">
      <ResponsiveTimeRange
        data={data}
        from={from}
        to={to}
        emptyColor="#eeeeee"
        colors={['#f47560', '#f47560', '#61cdbb']}
        margin={{ top: 40, right: 40, bottom: 40, left: 40 }}
        dayBorderWidth={2}
        dayBorderColor="#ffffff"
        minValue={0}
        maxValue={1}
      ></ResponsiveTimeRange>
    </div>
  );
}
