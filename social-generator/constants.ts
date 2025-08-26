
import { Gradient } from './types';

export const GRADIENTS: Gradient[] = [
  {
    name: 'Grey',
    class: 'from-[#595e62]/70 via-[#595e62]/40 to-transparent',
    preview: 'bg-gradient-to-r from-[#595e62] to-[#eeeeee]',
    color: '#595e62',
  },
  {
    name: 'Blue',
    class: 'from-[#13a0e9]/70 via-[#13a0e9]/40 to-transparent',
    preview: 'bg-gradient-to-r from-[#13a0e9] to-[#f4fcff]',
    color: '#13a0e9',
  },
  {
    name: 'Green',
    class: 'from-[#13e946]/70 via-[#13e946]/40 to-transparent',
    preview: 'bg-gradient-to-r from-[#13e946] to-[#f4fff7]',
    color: '#13e946',
  },
  {
    name: 'Purple',
    class: 'from-[#4617fa]/70 via-[#4617fa]/40 to-transparent',
    preview: 'bg-gradient-to-r from-[#4617fa] to-[#fcfcfd]',
    color: '#8b5cf6', // using Tailwind's violet-500 for better text contrast
  },
  {
    name: 'Yellow',
    class: 'from-[#f1c100]/70 via-[#f1c100]/40 to-transparent',
    preview: 'bg-gradient-to-r from-[#f1c100] to-[#fffdf4]',
    color: '#f1c100',
  },
  {
    name: 'Orange',
    class: 'from-[#f18200]/70 via-[#f18200]/40 to-transparent',
    preview: 'bg-gradient-to-r from-[#f18200] to-[#fffbf4]',
    color: '#f18200',
  },
  {
    name: 'Red',
    class: 'from-[#e92713]/70 via-[#e92713]/40 to-transparent',
    preview: 'bg-gradient-to-r from-[#e92713] to-[#fff5f4]',
    color: '#e92713',
  },
];
