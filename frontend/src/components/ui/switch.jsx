import * as Switch from '@radix-ui/react-switch';
import React from 'react';

export default function MySwitch({ checked, onCheckedChange }) {
  return (
    <Switch.Root
      checked={checked}
      onCheckedChange={onCheckedChange}
      className="w-12 h-6 bg-gray-200 rounded-full relative data-[state=checked]:bg-green-500"
    >
      <Switch.Thumb className="block w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 translate-x-1 data-[state=checked]:translate-x-6" />
    </Switch.Root>
  );
}
