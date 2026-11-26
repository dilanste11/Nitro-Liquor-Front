export interface ProductDTO {
  id: number;
  reference: string;
  name: string;
  description?: string;
  pricePurchase?: number;
  priceSale: number;
  quantity?: number;
  stockMinimum?: number;
  stockMaximum?: number;
  productCategoryId: number;
  supplierId: number;
  productTaxId: number;
  status?: number;
}