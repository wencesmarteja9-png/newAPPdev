import type { Booking, Review, Shop } from '@/types';

export const TIME_SLOTS = [
  '9:00 AM',
  '10:00 AM',
  '11:00 AM',
  '12:00 PM',
  '1:00 PM',
  '2:00 PM',
  '3:00 PM',
  '4:00 PM',
  '5:00 PM',
  '6:00 PM',
];

// Returns a date like "2026-11-09". offset 0 = today, -1 = yesterday, 1 = tomorrow.
export function isoDate(offset = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

const goldEdgeServices = [
  { id: 's1', name: 'Classic Haircut', price: 250, minutes: 30 },
  { id: 's2', name: 'Beard Trim', price: 150, minutes: 20 },
  { id: 's3', name: 'Haircut + Beard', price: 380, minutes: 45 },
];

export const initialShops: Shop[] = [
  {
    id: 'shop1',
    name: 'Gold Edge Barbers',
    category: 'Barbershop',
    address: '26th St, BGC, Taguig',
    phone: '0917 123 4567',
    description: 'Classic cuts and hot-towel shaves by seasoned barbers.',
    hours: '8:00 AM – 8:00 PM',
    isOpen: true,
    services: goldEdgeServices,
    barbers: [
      { id: 'b1', name: 'Rico' },
      { id: 'b2', name: 'Jun' },
    ],
    capacity: 1,
    blockedSlots: ['12:00 PM', '1:00 PM'],
  },
  {
    id: 'shop2',
    name: 'Luxe Salon Studio',
    category: 'Salon',
    address: 'Western Bicutan, Taguig',
    phone: '0917 555 0102',
    description: 'Hair color, styling and treatments.',
    hours: '9:00 AM – 7:00 PM',
    isOpen: false,
    services: [
      { id: 's1', name: 'Hair Color', price: 900, minutes: 90 },
      { id: 's2', name: 'Blowdry', price: 300, minutes: 30 },
    ],
    barbers: [{ id: 'b1', name: 'Mara' }],
    capacity: 1,
    blockedSlots: [],
  },
  {
    id: 'shop3',
    name: 'The Fade Room',
    category: 'Barbershop',
    address: 'Market! Market!, Taguig',
    phone: '0917 555 0103',
    description: 'Fresh fades and sharp lines.',
    hours: '10:00 AM – 9:00 PM',
    isOpen: true,
    services: [
      { id: 's1', name: 'Fade', price: 280, minutes: 30 },
      { id: 's2', name: 'Line Up', price: 120, minutes: 15 },
    ],
    barbers: [{ id: 'b1', name: 'Dan' }],
    capacity: 1,
    blockedSlots: [],
  },
  {
    id: 'shop4',
    name: 'Bloom Beauty Lounge',
    category: 'Salon',
    address: 'Lower Bicutan, Taguig',
    phone: '0917 555 0104',
    description: 'Nails, hair and skin care.',
    hours: '9:00 AM – 6:00 PM',
    isOpen: true,
    services: [
      { id: 's1', name: 'Manicure', price: 250, minutes: 40 },
      { id: 's2', name: 'Haircut', price: 300, minutes: 30 },
    ],
    barbers: [{ id: 'b1', name: 'Lia' }],
    capacity: 1,
    blockedSlots: [],
  },
];

function booking(
  n: number,
  customerName: string,
  serviceIdx: number,
  barberIdx: number,
  date: string,
  time: string,
  status: Booking['status'],
  rated = false,
): Booking {
  const service = goldEdgeServices[serviceIdx];
  const barber = initialShops[0].barbers[barberIdx];
  return {
    id: `bk${n}`,
    reference: `QL-${n}`,
    customerName,
    shopId: 'shop1',
        services: [service],
    serviceName: service.name,
    price: service.price,
    barberId: barber.id,
    barberName: barber.name,
    date,
    time,
    status,
    rated,
  };
}

export const initialBookings: Booking[] = [
  booking(1041, 'Carl Dy', 0, 0, isoDate(0), '9:00 AM', 'Completed', true),
  booking(1042, 'Mark Reyes', 0, 1, isoDate(0), '2:00 PM', 'In Progress'),
  booking(1043, 'Leo Cruz', 1, 0, isoDate(0), '3:00 PM', 'Checked In'),
  booking(1044, 'Ana Lim', 2, 1, isoDate(0), '4:00 PM', 'Checked In'),
  booking(1045, 'Ben Tan', 0, 0, isoDate(0), '5:00 PM', 'Pending'),
  booking(1046, 'Eli Go', 1, 1, isoDate(0), '10:00 AM', 'Cancelled'),
  booking(1047, 'Juan', 0, 0, isoDate(-1), '10:00 AM', 'Completed', false),
];

export const initialReviews: Review[] = [
  {
    id: 'r1',
    bookingId: 'bk1041',
    shopId: 'shop1',
    customerName: 'Carl Dy',
    shopRating: 5,
    barberId: 'b1',
    barberName: 'Rico',
    barberRating: 5,
    comment: 'Clean fade, right on time.',
    date: isoDate(0),
  },
  {
    id: 'r2',
    bookingId: 'old1',
    shopId: 'shop1',
    customerName: 'Mia Sy',
    shopRating: 4,
    barberId: 'b2',
    barberName: 'Jun',
    barberRating: 5,
    comment: 'Great beard trim. Short wait.',
    date: isoDate(0),
  },
  {
    id: 'r3',
    bookingId: 'old2',
    shopId: 'shop1',
    customerName: 'Juan',
    shopRating: 5,
    barberId: 'b1',
    barberName: 'Rico',
    barberRating: 4,
    comment: 'Clean cut and friendly barber!',
    date: isoDate(0),
  },
];


// The shop managed by the Shop Owner account in this prototype
export const OWNER_SHOP_ID = 'shop1';