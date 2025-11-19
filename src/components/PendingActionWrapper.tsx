// components/PendingActionWrapper.tsx
'use client';

import { usePendingAction } from "@/lib/usePendingAction";


/**
 * This component should be added to the root layout or at least on pages where users
 * might perform actions after logging in. It will automatically execute any pending
 * actions that were saved before login.
 */
export const PendingActionWrapper = () => {
  usePendingAction();
  return null;
};