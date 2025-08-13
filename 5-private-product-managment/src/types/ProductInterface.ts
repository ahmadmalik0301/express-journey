import { Decimal } from "@prisma/client/runtime/library";
export default interface products {
  name: string;
  id: number;
  user_id: number;
  description: string | null;
  price: Decimal | null;
  stock: number | null;
  created_at: Date | null;
  updated_at: Date | null;
}
