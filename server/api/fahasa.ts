import type { BookstoreInventoryBySKUAndProvinceResponse } from "@/types/fahasa";

export default defineEventHandler(async (event) => {
  const { sku } = getQuery(event);

  const data = $fetch<BookstoreInventoryBySKUAndProvinceResponse>(
    "https://erp-ops.fahasa.com/nodeops/inventory/getBookstoreInventoryBySKUAndProvince",
    {
      method: "POST",
      body: {
        sku,
      },
    },
  );

  return data;
});
