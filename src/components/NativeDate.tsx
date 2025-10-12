// components/NativeDate.js
export default function NativeDate({ date }: { date: Date }) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
}

// Output: April 6, 2024    