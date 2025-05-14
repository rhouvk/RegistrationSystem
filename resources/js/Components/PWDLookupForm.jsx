import React from 'react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';

export default function PWDLookupForm({
  value,
  onChange,
  onSubmit,
  error,
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <InputLabel htmlFor="pwd_lookup" value="Enter PWD Number" />
      <TextInput
        id="pwd_lookup"
        name="pwd_lookup"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="02-1234-5678-9012"
        className="w-full"
      />
      <InputError message={error} />
      <button
        type="submit"
        className="inline-flex px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
      >
        Lookup
      </button>
    </form>
  );
}
