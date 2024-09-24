export interface Product {
  id?: string | number;
  name: string;
  quantity: number;
  amount: number;
}

export interface Order {
  client: Client;
  id: number;
  products: Product[];
  total: number;
  subtotal: number;
  discount: number;
  paymentMethod: string;
}
  
export interface Client {
  name: string;
  cpf?: string;
  phone: string;
  address: string;
}
  
export interface Trader {
  name: string;
  cnpj?: string;
  phone?: string;
  address?: string;
  site?: string;
}

export enum Types {
    PLAIN_TEXT = "plain_text"
}
