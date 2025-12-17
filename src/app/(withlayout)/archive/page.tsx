// app/(withlayout)/archive/page.tsx
import { Suspense } from "react";
import ArchiveClient from "./ArchiveClient";

export default function ArchivePage() {
  return (
    <Suspense fallback={<div className="p-8">Loading archive…</div>}>
      <ArchiveClient />
    </Suspense>
  );
}
