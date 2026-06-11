"use client";

import React from 'react';
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';
import { ChevronDown, Check } from 'lucide-react';

interface Option {
  value: string;
  label: string;
}

interface CustomDropdownProps {
  value: string;
  onChange: (val: string) => void;
  options: Option[];
  label?: string;
}

export default function CustomDropdown({ value, onChange, options, label }: CustomDropdownProps) {
  const selectedOption = options.find((opt) => opt.value === value) || options[0];

  return (
    <div className="space-y-1 w-full relative">
      {label && (
        <label className="text-[10px] font-mono uppercase tracking-widest text-slate-400">
          {label}
        </label>
      )}
      <Listbox value={value} onChange={onChange}>
        <div className="relative mt-1">
          <ListboxButton className="relative w-full cursor-pointer rounded-xl bg-slate-950/50 border border-slate-800 py-3 pl-4 pr-10 text-left text-sm text-white focus:outline-none focus:border-blue-500/50 transition-all hover:bg-slate-950/80">
            <span className="block truncate text-slate-200">{selectedOption ? selectedOption.label : 'Pilih opsi...'}</span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <ChevronDown className="h-4 w-4 text-slate-500 transition-transform duration-200 group-data-[open]:rotate-180" aria-hidden="true" />
            </span>
          </ListboxButton>
          <ListboxOptions
            transition
            className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-xl bg-slate-900 border border-slate-800 py-1 text-sm shadow-2xl focus:outline-none transition duration-150 ease-out data-[closed]:scale-95 data-[closed]:opacity-0 data-[closed]:transform-gpu"
          >
            {options.map((opt) => (
              <ListboxOption
                key={opt.value}
                value={opt.value}
                className="group relative cursor-pointer select-none py-2.5 pl-4 pr-10 text-slate-300 data-[focus]:bg-blue-600 data-[focus]:text-white transition-colors duration-150"
              >
                <span className="block truncate font-medium group-data-[selected]:font-semibold group-data-[selected]:text-white">
                  {opt.label}
                </span>
                <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-blue-500 group-data-[focus]:text-white group-[&:not([data-selected])]:hidden">
                  <Check className="h-4 w-4" aria-hidden="true" />
                </span>
              </ListboxOption>
            ))}
          </ListboxOptions>
        </div>
      </Listbox>
    </div>
  );
}
