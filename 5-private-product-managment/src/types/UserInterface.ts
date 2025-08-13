export default interface User {
  id: number;
  first_name: string;
  last_name: string;
  age?: number | null;
  phone_number: string;
  email: string;
  country?: string | null;
  address?: string | null;
  password: string;
}
