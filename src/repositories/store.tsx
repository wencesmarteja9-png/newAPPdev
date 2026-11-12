import { createContext, useContext, useState, type ReactNode } from 'react';

import { initialBookings, initialReviews, initialShops, isoDate } from '@/repositories/mock-data';
import type { Booking, BookingStatus, Review, Role, Shop } from '@/types';

export interface Rating {
  average: number | null;
  count: number;
}

export interface NewBookingInput {
  shopId: string;
  serviceIds: string[];
  barberId: string;
  date: string;
  time: string;
}

export interface NewReviewInput {
  bookingId: string;
  shopRating: number;
  barberRating: number;
  comment: string;
}

interface StoreValue {
  role: Role | null;
  userName: string;
  signIn: (role: Role, name: string) => void;
  signOut: () => void;
  setUserName: (name: string) => void;

  shops: Shop[];
  bookings: Booking[];
  reviews: Review[];
    favorites: string[];
  toast: string | null;

  toggleFavorite: (shopId: string) => void;
  isSlotAvailable: (shopId: string, date: string, time: string) => boolean;
  createBooking: (input: NewBookingInput) => Booking | null;
  setBookingStatus: (bookingId: string, status: BookingStatus) => void;
  addReview: (input: NewReviewInput) => boolean;
  updateShop: (shopId: string, patch: Partial<Shop>) => void;
  getShopRating: (shopId: string) => Rating;
  getBarberRating: (shopId: string, barberId: string) => Rating;
}

const INACTIVE: BookingStatus[] = ['Cancelled', 'No-Show'];

function summarize(values: number[]): Rating {
  if (values.length === 0) return { average: null, count: 0 };
  const sum = values.reduce((a, b) => a + b, 0);
  return { average: Math.round((sum / values.length) * 10) / 10, count: values.length };
}

const StoreContext = createContext<StoreValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role | null>(null);
  const [userName, setUserName] = useState('Juan');
  const [shops, setShops] = useState<Shop[]>(initialShops);
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [favorites, setFavorites] = useState<string[]>(['shop2']);

  const signIn = (r: Role, name: string) => {
    setRole(r);
    setUserName(name);
  };

  const signOut = () => setRole(null);

    const [toast, setToast] = useState<string | null>(null);

  const toggleFavorite = (shopId: string) => {
    const adding = !favorites.includes(shopId);
    const shopName = shops.find((s) => s.id === shopId)?.name ?? 'Shop';
    setFavorites((prev) => (adding ? [...prev, shopId] : prev.filter((id) => id !== shopId)));
    setToast(adding ? `${shopName} added to favorites` : `${shopName} removed from favorites`);
    setTimeout(() => setToast(null), 1800);
  };

  const isSlotAvailable = (shopId: string, date: string, time: string) => {
    const shop = shops.find((s) => s.id === shopId);
    if (!shop) return false;
    if (shop.blockedSlots.includes(time)) return false;
    const taken = bookings.filter(
      (b) =>
        b.shopId === shopId &&
        b.date === date &&
        b.time === time &&
        !INACTIVE.includes(b.status),
    ).length;
    return taken < shop.capacity;
  };

  const createBooking = (input: NewBookingInput): Booking | null => {
    const shop = shops.find((s) => s.id === input.shopId);
    const barber = shop?.barbers.find((b) => b.id === input.barberId);
    const chosen = shop ? shop.services.filter((s) => input.serviceIds.includes(s.id)) : [];
    if (!shop || !barber || chosen.length === 0) return null;
    if (!isSlotAvailable(input.shopId, input.date, input.time)) return null;

    const next =
      bookings.reduce(
        (max, b) => Math.max(max, parseInt(b.reference.replace('QL-', ''), 10) || 0),
        1000,
      ) + 1;

    const booking: Booking = {
      id: `bk${next}`,
      reference: `QL-${next}`,
      customerName: userName,
      shopId: shop.id,
      services: chosen.map((s) => ({ ...s })),
      serviceName: chosen.map((s) => s.name).join(' + '),
      price: chosen.reduce((sum, s) => sum + s.price, 0),
      barberId: barber.id,
      barberName: barber.name,
      date: input.date,
      time: input.time,
      status: 'Pending',
      rated: false,
    };

    setBookings((prev) => [...prev, booking]);
    return booking;
  };

  const setBookingStatus = (bookingId: string, status: BookingStatus) => {
    setBookings((prev) => prev.map((b) => (b.id === bookingId ? { ...b, status } : b)));
  };

  const addReview = (input: NewReviewInput): boolean => {
    const booking = bookings.find((b) => b.id === input.bookingId);
    if (!booking || booking.status !== 'Completed' || booking.rated) return false;
    if (input.shopRating < 1 || input.barberRating < 1) return false;

    const review: Review = {
      id: `r${Date.now()}`,
      bookingId: booking.id,
      shopId: booking.shopId,
      customerName: booking.customerName,
      shopRating: input.shopRating,
      barberId: booking.barberId,
      barberName: booking.barberName,
      barberRating: input.barberRating,
      comment: input.comment.trim(),
      date: isoDate(0),
    };

    setReviews((prev) => [review, ...prev]);
    setBookings((prev) => prev.map((b) => (b.id === booking.id ? { ...b, rated: true } : b)));
    return true;
  };

  const updateShop = (shopId: string, patch: Partial<Shop>) => {
    setShops((prev) => prev.map((s) => (s.id === shopId ? { ...s, ...patch } : s)));
  };

  const getShopRating = (shopId: string): Rating =>
    summarize(reviews.filter((r) => r.shopId === shopId).map((r) => r.shopRating));

  const getBarberRating = (shopId: string, barberId: string): Rating =>
    summarize(
      reviews
        .filter((r) => r.shopId === shopId && r.barberId === barberId)
        .map((r) => r.barberRating),
    );

  const value: StoreValue = {
    role,
    userName,
    signIn,
    signOut,
    setUserName,
    shops,
    bookings,
    reviews,
    favorites,
        toast,
    toggleFavorite,
    isSlotAvailable,
    createBooking,
    setBookingStatus,
    addReview,
    updateShop,
    getShopRating,
    getBarberRating,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used inside StoreProvider');
  return ctx;
}