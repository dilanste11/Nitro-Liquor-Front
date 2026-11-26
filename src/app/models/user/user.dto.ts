export interface UserDTO {
  id: number;
  document: string;
  name: string;
  lastName: string; 
  username: string; 
  email: string;
  password?: string;
  phoneNumber?: string; 
  birthDate?: string;  
  rolId: number;       
  status?: number;
}