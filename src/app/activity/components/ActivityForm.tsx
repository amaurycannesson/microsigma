import { Activity, NewActivity } from '@/schema';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { useActionState, useEffect, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { SaveActivityResponse } from '../actions/saveActivity';

dayjs.extend(localizedFormat);

const Submit = () => {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      className="mt-2 rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none disabled:bg-gray-400"
      disabled={pending}
    >
      Enregistrer
    </button>
  );
};

export default function ActivityForm({
  activity,
  dateRange,
  onSave,
  onRemove,
}: {
  activity: Activity | NewActivity;
  dateRange: [string, string] | null;
  onSave: (formData: FormData) => Promise<SaveActivityResponse>;
  onRemove: (formData: FormData) => Promise<SaveActivityResponse>;
}) {
  const [isWorked, setIsWorked] = useState(activity.real !== null);
  const [formState, setFormState] = useState<SaveActivityResponse | null>(null);
  const [upsertState, formAction] = useActionState<SaveActivityResponse | null, FormData>(
    (_, formData) => onSave(formData),
    null
  );
  const [removeState, removeFormAction] = useActionState<SaveActivityResponse | null, FormData>(
    (_, formData) => onRemove(formData),
    null
  );

  useEffect(() => setFormState(upsertState), [upsertState]);
  useEffect(() => setFormState(removeState), [removeState]);
  useEffect(() => setIsWorked(!!activity.real), [activity]);

  return (
    <div key={activity.id} className="w-60">
      {dateRange ? (
        <>
          Du {dayjs(dateRange[0]).locale('fr').format('LL')} au{' '}
          {dayjs(dateRange[1]).locale('fr').format('LL')}
        </>
      ) : (
        dayjs(activity.date).locale('fr').format('LL')
      )}
      <form id="remove" action={removeFormAction}>
        {dateRange ? (
          <>
            <input type="hidden" name="startDate" value={dateRange[0]}></input>
            <input type="hidden" name="endDate" value={dateRange[1]}></input>
          </>
        ) : (
          <input type="hidden" name="date" value={activity.date}></input>
        )}
      </form>
      <form id="upsert" action={formAction}>
        {'id' in activity ? <input type="hidden" name="id" value={activity.id}></input> : <></>}
        {dateRange ? (
          <>
            <input
              id="ignoreWeekends"
              name="ignoreWeekends"
              type="checkbox"
              defaultChecked={true}
              className="mr-1"
            />
            <label htmlFor="ignoreWeekends" className="text-xs font-medium text-gray-900">
              Ignorer les weekends
            </label>
            <input
              id="insertOnly"
              name="insertOnly"
              type="checkbox"
              defaultChecked={false}
              className="ml-2 mr-1"
            />
            <label htmlFor="insertOnly" className="text-xs font-medium text-gray-900">
              Ajout uniquement
            </label>
            <input type="hidden" name="startDate" value={dateRange[0]}></input>
            <input type="hidden" name="endDate" value={dateRange[1]}></input>
          </>
        ) : (
          <></>
        )}
        <input type="hidden" name="date" value={activity.date}></input>
        <input type="hidden" name="paidAt" value={activity.paidAt}></input>
        <div className="mt-2">
          <label htmlFor="rate" className="block text-xs font-medium text-gray-900">
            Taux journalier
          </label>
          <input
            id="rate"
            name="rate"
            type="number"
            min="1"
            required
            defaultValue={activity.rate}
            className="w-full rounded-md border border-gray-300 bg-gray-50 p-1 text-sm text-gray-900 shadow-sm"
          ></input>
        </div>
        <div className="mt-2">
          <label htmlFor="estimated" className="block text-xs font-medium text-gray-900">
            Estimé
          </label>
          <input
            id="estimated"
            name="estimated"
            max="1"
            min="0"
            step="0.1"
            type="number"
            required
            defaultValue={activity.estimated}
            className="w-full rounded-md border border-gray-300 bg-gray-50 p-1 text-sm text-gray-900 shadow-sm"
          ></input>
        </div>
        <div className="mt-2">
          <label htmlFor="real" className="block text-xs font-medium text-gray-900">
            Réel
          </label>
          <div className="flex items-center">
            <label className="relative mr-2 inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                checked={isWorked}
                className="peer sr-only"
                onChange={() => setIsWorked(!isWorked)}
              />
              <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-0.5 after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:ring-4 peer-focus:ring-blue-300"></div>
            </label>
            {isWorked ? (
              <input
                id="real"
                name="real"
                type="number"
                max="1"
                min="0"
                step="0.1"
                required
                defaultValue={activity.estimated}
                className="w-full rounded-md border border-gray-300 bg-gray-50 p-1 text-sm text-gray-900 shadow-sm"
              ></input>
            ) : (
              <></>
            )}
          </div>
        </div>
        <Submit />
        <button
          form="remove"
          type="submit"
          className="b ml-2 mt-2 rounded-md px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-100 focus:outline-none disabled:bg-gray-400"
        >
          Supprimer
        </button>
        {formState && formState.message && (
          <div
            className={`text-red mt-2 border-l-2 pl-2 text-sm ${
              formState.isSuccess
                ? 'border-green-600 bg-green-100 text-green-600'
                : 'border-red-600 bg-red-100 text-red-600'
            }`}
          >
            {formState.message}
          </div>
        )}
      </form>
    </div>
  );
}
