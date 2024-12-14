'use client';

import { Activity, NewActivity } from '@/schema';
import dayjs, { Dayjs } from 'dayjs';
import { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import { SaveActivityResponse } from '../actions/saveActivity';
import './ActivityCalendar.css';
import ActivityForm from './ActivityForm';

export default function ActivityCalendar({
  activitiesByDate,
  onSave,
  onRemove,
}: {
  activitiesByDate: Record<string, Activity>;
  onSave: (formData: FormData) => Promise<SaveActivityResponse>;
  onRemove: (formData: FormData) => Promise<SaveActivityResponse>;
}) {
  const getNextMonth = (date: Date) => {
    return dayjs(date).date(1).add(1, 'month');
  };

  const formatToDayString = (date: Dayjs | Date) => {
    return dayjs(date).format('YYYY-MM-DD');
  };

  const defaultActivity = {
    rate: 500,
    date: formatToDayString(new Date()),
    paidAt: formatToDayString(getNextMonth(new Date())),
    estimated: 1,
    real: null,
  };

  const [calendarSelection, setCalendarSelection] = useState<Date | [Date, Date]>();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedRange, setSelectedRange] = useState<[string, string] | null>(null);
  const [activity, setActivity] = useState<Activity | NewActivity>(defaultActivity);
  const [isBulk, setIsBulk] = useState(false);

  const onDateChange = (value: Date | [Date, Date]) => {
    setCalendarSelection(value);

    if (Array.isArray(value)) {
      setSelectedRange([formatToDayString(value[0]), formatToDayString(value[1])]);
    } else {
      setSelectedDate(value!);
    }
  };

  useEffect(() => {
    if (!isBulk) {
      setSelectedRange(null);
    }
  }, [isBulk]);

  useEffect(() => {
    if (formatToDayString(selectedDate) in activitiesByDate) {
      setActivity(activitiesByDate[formatToDayString(selectedDate)]);
    } else {
      setActivity({
        ...defaultActivity,
        date: formatToDayString(selectedDate),
        paidAt: formatToDayString(getNextMonth(selectedDate)),
      });
    }
  }, [selectedDate]);

  const getCalendarTileClass = ({
    date,
    view,
  }: {
    date: Date;
    view: string;
  }): string | undefined => {
    if (view === 'year') {
      return '';
    }
    if (formatToDayString(date) in activitiesByDate) {
      if (activitiesByDate[formatToDayString(date)].real) {
        return 'text-green-500';
      } else {
        return 'text-orange-500';
      }
    }
  };

  return (
    <>
      <div className="mt-1 flex items-start gap-2">
        <div className="mr-1">
          <Calendar
            selectRange={isBulk}
            onChange={(v) => onDateChange(v as Date | [Date, Date])}
            value={calendarSelection}
            tileClassName={getCalendarTileClass}
          />
          <div className="mt-1">
            <input
              id="bulk"
              type="checkbox"
              checked={isBulk}
              onChange={() => setIsBulk(!isBulk)}
              className="mr-1"
            />
            <label htmlFor="bulk" className="text-xs font-medium text-gray-900">
              Sélectionner une plage de dates
            </label>
          </div>
        </div>
        <ActivityForm
          activity={activity}
          dateRange={selectedRange}
          onSave={onSave}
          onRemove={onRemove}
        />
      </div>
    </>
  );
}
