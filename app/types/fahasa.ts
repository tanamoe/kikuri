export type BookstoreInventory = {
  code: string;
  province_id: number;
  bookstore_id: number;
  bookstore_name: string;
  bookstore_address: string;
  lat: number;
  lon: number;
  quantity: number;
};

export type ProvinceInventory = {
  id: number;
  province_name: string;
  bookstore_list: BookstoreInventory[];
};

export type BookstoreInventoryBySKUAndProvinceResponse = {
  success: boolean;
  data: ProvinceInventory[];
};
