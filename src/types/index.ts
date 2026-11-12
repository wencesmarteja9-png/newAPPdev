export type Role = 'customer' | 'owner';

export type ShopCategory = 'Barbershop' | 'Salon';

export type BookingStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Checked In'
  | 'In Progress'
  | 'Completed'
  | 'Cancelled'
  | 'No-Show';

export interface Service {
  id: string;
  name: string;
  price: number;
  minutes: number;
}

export interface Barber {
  id: string;
  name: string;
}

export interface Shop {
  id: string;
  name: string;
  category: ShopCategory;
  address: string;
  phone: string;
  description: string;
  hours: string;
  isOpen: boolean;
  services: Service[];
  barbers: Barber[];
  capacity: number;
  blockedSlots: string[];
}

export interface Booking {
  id: string;
  reference: string;
  customerName: string;
  shopId: string;
  services: Service[];
  serviceName: string; // all service names joined, e.g. "Classic Haircut + Beard Trim"
  price: number; // total of all services
  barberId: string;
  barberName: string;
  date: string;
  time: string;
  status: BookingStatus;
  rated: boolean;
}

export interface Review {
  id: string;
  bookingId: string;
  shopId: string;
  customerName: string;
  shopRating: number;
  barberId: string;
  barberName: string;
  barberRating: number;
  comment: string;
  date: string;
}