// app/(withlayout)/products/page.tsx
import { Suspense } from "react";
import ProductsClient from "./ProductsClient";

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="p-6">Loading products…</div>}>
      <ProductsClient />
    </Suspense>
  );
}
