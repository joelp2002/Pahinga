import type { Service } from '../data/mockData';

/** Tier price for headcount; below lowest tier uses lowest tier; above highest uses highest. */
export function eventHallTierPrice(
  guests: number,
  tiers: { minPax: number; maxPax: number; price: number }[]
): number {
  if (!tiers.length) return 0;
  const g = Math.max(1, guests);
  const sorted = [...tiers].sort((a, b) => a.minPax - b.minPax);
  for (const t of sorted) {
    if (g >= t.minPax && g <= t.maxPax) return t.price;
  }
  if (g < sorted[0].minPax) return sorted[0].price;
  return sorted[sorted.length - 1].price;
}

export function bookingDays(checkIn: string, checkOut: string): number {
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) || 1;
}

export function getBookingSubtotal(service: Service, guests: number, checkIn: string, checkOut: string): number {
  const days = bookingDays(checkIn, checkOut);
  if (service.type === 'event_hall' && service.paxRates?.length) {
    return eventHallTierPrice(guests, service.paxRates) * days;
  }
  return service.pricePerDay * days;
}
