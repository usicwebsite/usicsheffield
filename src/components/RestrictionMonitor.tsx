'use client';

import { useRestrictionMonitor } from '@/hooks/useRestrictionMonitor';

export default function RestrictionMonitor() {
  useRestrictionMonitor();
  return null; // This component doesn't render anything
}
