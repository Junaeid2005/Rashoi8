import React, { useState, useEffect } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  Users,
  CheckCircle2,
  AlertCircle,
  UtensilsCrossed,
  Info,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { createReservation, isDateFullyBooked } from '../services/reservationService';
import { Reservation } from '../types';

interface ReservationsPageProps {
  onNavigate: (page: string) => void;
}

export const ReservationsPage: React.FC<ReservationsPageProps> = ({ onNavigate }) => {
  const { currentUser } = useAuth();

  // Reservation form fields
  const [date, setDate] = useState(() => {
    const d = new Date();
    return d.toISOString().split('T')[0];
  });
  const [time, setTime] = useState('19:00');
  const [guests, setGuests] = useState(2);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');

  // Status & Validation
  const [isFullyBooked, setIsFullyBooked] = useState(false);
  const [fullyBookedNotice, setFullyBookedNotice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [confirmedReservation, setConfirmedReservation] = useState<Reservation | null>(null);

  // Pre-fill user details if signed in
  useEffect(() => {
    if (currentUser) {
      if (currentUser.displayName && !customerName) setCustomerName(currentUser.displayName);
      if (currentUser.email && !customerEmail) setCustomerEmail(currentUser.email);
    }
  }, [currentUser]);

  // Check if selected date is fully booked
  useEffect(() => {
    let isCurrent = true;
    const checkDateStatus = async () => {
      const booked = await isDateFullyBooked(date);
      if (!isCurrent) return;

      setIsFullyBooked(booked);
      if (booked) {
        const todayStr = new Date().toISOString().split('T')[0];
        if (date === todayStr) {
          setFullyBookedNotice('Sorry, all tables are fully booked today. Please choose tomorrow or another available date.');
        } else {
          setFullyBookedNotice('Sorry, all tables are fully booked on your selected date. Please choose another available date.');
        }
      } else {
        setFullyBookedNotice(null);
      }
    };

    checkDateStatus();
    return () => {
      isCurrent = false;
    };
  }, [date]);

  const lunchTimeSlots = ['12:00', '12:30', '13:00', '13:30', '14:00'];
  const dinnerTimeSlots = ['17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (isFullyBooked) {
      setErrorMessage(fullyBookedNotice || 'Selected date is currently fully booked.');
      return;
    }

    if (!customerName.trim() || !customerEmail.trim() || !customerPhone.trim()) {
      setErrorMessage('Please provide your full name, email address, and telephone number.');
      return;
    }

    setLoading(true);

    try {
      const res = await createReservation({
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim(),
        customerPhone: customerPhone.trim(),
        date,
        time,
        guests,
        specialRequests: specialRequests.trim() || undefined,
        customerId: currentUser?.uid,
      });

      setConfirmedReservation(res);
    } catch (err: any) {
      console.error('Reservation error:', err);
      setErrorMessage(err.message || 'Unable to submit reservation. Please call us directly at 01276 452 197.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1F1916] py-14 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#7A1228]/10 text-[#7A1228] text-xs uppercase tracking-[0.2em] font-semibold border border-[#7A1228]/20">
            <Sparkles className="w-3.5 h-3.5 text-[#C59B27]" />
            <span>Table Reservations</span>
          </div>
          <h1 className="font-['Playfair_Display'] text-3xl sm:text-5xl font-bold text-[#1F1916]">
            Book Your Table at Rashoi
          </h1>
          <p className="text-sm sm:text-base text-[#6B5E57] font-normal leading-relaxed">
            Reserve your table for lunch or dinner in our dining room in Windlesham, Surrey. Open 7 days a week.
          </p>
        </div>

        {confirmedReservation ? (
          /* Confirmation Receipt Card */
          <div className="bg-white border border-[#EDE6DC] rounded-3xl p-8 sm:p-12 text-center max-w-lg mx-auto shadow-sm space-y-6">
            <div className="w-16 h-16 rounded-full bg-[#7A1228]/10 flex items-center justify-center mx-auto text-[#7A1228] shadow-sm">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-[#7A1228]">
                Reservation Confirmed
              </span>
              <h2 className="font-['Playfair_Display'] text-2xl sm:text-3xl font-bold text-[#1F1916]">
                We Look Forward to Welcoming You
              </h2>
            </div>

            {/* Booking Details Card */}
            <div className="bg-[#FAF7F2] p-6 rounded-2xl text-left text-xs space-y-2.5 border border-[#EDE6DC]">
              <div className="flex justify-between border-b border-[#EDE6DC] pb-2">
                <span className="text-[#6B5E57]">Booking Reference:</span>
                <span className="font-bold text-[#7A1228] text-sm">
                  {confirmedReservation.reservationNumber}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6B5E57]">Date:</span>
                <span className="font-semibold text-[#1F1916]">{confirmedReservation.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6B5E57]">Time Slot:</span>
                <span className="font-semibold text-[#1F1916]">{confirmedReservation.time}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6B5E57]">Party Size:</span>
                <span className="font-semibold text-[#1F1916]">{confirmedReservation.guests} Guests</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6B5E57]">Lead Guest:</span>
                <span className="font-semibold text-[#1F1916]">{confirmedReservation.customerName}</span>
              </div>
              {confirmedReservation.specialRequests && (
                <div className="pt-2 border-t border-[#EDE6DC]">
                  <span className="text-[#6B5E57] block mb-1">Special Requests:</span>
                  <span className="text-[#1F1916] italic">{confirmedReservation.specialRequests}</span>
                </div>
              )}
            </div>

            <div className="text-xs text-[#6B5E57] space-y-1">
              <p>A confirmation email has been dispatched to <strong className="text-[#1F1916]">{confirmedReservation.customerEmail}</strong>.</p>
              <p>For urgent changes, please phone <strong className="text-[#7A1228]">01276 452 197</strong>.</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => setConfirmedReservation(null)}
                className="flex-1 py-3 uppercase tracking-wider text-xs font-bold text-[#7A1228] bg-[#FAF7F2] hover:bg-[#EDE6DC] rounded-full cursor-pointer transition-colors border border-[#7A1228]/30"
              >
                Make Another Booking
              </button>
              <button
                onClick={() => onNavigate('menu')}
                className="flex-1 py-3 uppercase tracking-wider text-xs font-bold text-white bg-[#7A1228] hover:bg-[#5C0C1D] rounded-full cursor-pointer shadow-md transition-all"
              >
                Explore Menu
              </button>
            </div>
          </div>
        ) : (
          /* Reservation Form */
          <div className="bg-white border border-[#EDE6DC] rounded-3xl p-6 sm:p-10 shadow-sm">
            
            {/* Fully Booked Alert Banner */}
            {isFullyBooked && fullyBookedNotice && (
              <div className="mb-8 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-[#1F1916] text-xs sm:text-sm flex items-start gap-3 shadow-sm">
                <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold text-amber-900">Dining Room Notice</p>
                  <p className="text-amber-950">{fullyBookedNotice}</p>
                  <p className="text-[11px] text-[#6B5E57] pt-1">
                    Note: Online takeaway orders are still available with a 10% collection discount.
                  </p>
                </div>
              </div>
            )}

            {errorMessage && (
              <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-3">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Step 1: Date & Party Size */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#1F1916] mb-1.5 flex items-center gap-1.5">
                    <CalendarIcon className="w-4 h-4 text-[#7A1228]" />
                    <span>Select Date *</span>
                  </label>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#EDE6DC] rounded-2xl px-4 py-3 text-xs sm:text-sm text-[#1F1916] focus:outline-none focus:border-[#7A1228] focus:ring-1 focus:ring-[#7A1228]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#1F1916] mb-1.5 flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-[#7A1228]" />
                    <span>Number of Guests *</span>
                  </label>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    className="w-full bg-[#FAF7F2] border border-[#EDE6DC] rounded-2xl px-4 py-3 text-xs sm:text-sm text-[#1F1916] focus:outline-none focus:border-[#7A1228] focus:ring-1 focus:ring-[#7A1228]"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 14, 16, 20].map((num) => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? 'Guest (Solo Diner)' : `${num} Guests`}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Step 2: Time Selection */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#1F1916] mb-2 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-[#7A1228]" />
                  <span>Select Time Slot *</span>
                </label>

                {/* Lunch Slots */}
                <div className="space-y-2 mb-4">
                  <span className="text-[11px] font-bold text-[#7A1228] uppercase tracking-wider block">
                    Lunch Service (12:00 PM – 2:30 PM)
                  </span>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                    {lunchTimeSlots.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setTime(slot)}
                        className={`py-2.5 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                          time === slot
                            ? 'bg-[#7A1228] text-white font-bold border-[#7A1228] shadow-sm'
                            : 'bg-[#FAF7F2] text-[#1F1916] border-[#EDE6DC] hover:border-[#7A1228]/50'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Dinner Slots */}
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-[#7A1228] uppercase tracking-wider block">
                    Dinner Service (5:30 PM – 11:00 PM)
                  </span>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                    {dinnerTimeSlots.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setTime(slot)}
                        className={`py-2.5 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                          time === slot
                            ? 'bg-[#7A1228] text-white font-bold border-[#7A1228] shadow-sm'
                            : 'bg-[#FAF7F2] text-[#1F1916] border-[#EDE6DC] hover:border-[#7A1228]/50'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Step 3: Contact Details */}
              <div className="pt-4 border-t border-[#EDE6DC] space-y-4">
                <h4 className="font-['Playfair_Display'] text-lg font-bold text-[#1F1916]">
                  Guest Contact Information
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#1F1916] mb-1">
                      Lead Guest Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. Eleanor Vance"
                      className="w-full bg-[#FAF7F2] border border-[#EDE6DC] rounded-2xl px-4 py-3 text-xs sm:text-sm text-[#1F1916] placeholder-[#6B5E57] focus:outline-none focus:border-[#7A1228]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#1F1916] mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="eleanor@example.com"
                      className="w-full bg-[#FAF7F2] border border-[#EDE6DC] rounded-2xl px-4 py-3 text-xs sm:text-sm text-[#1F1916] placeholder-[#6B5E57] focus:outline-none focus:border-[#7A1228]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#1F1916] mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="01276 452 197"
                      className="w-full bg-[#FAF7F2] border border-[#EDE6DC] rounded-2xl px-4 py-3 text-xs sm:text-sm text-[#1F1916] placeholder-[#6B5E57] focus:outline-none focus:border-[#7A1228]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#1F1916] mb-1">
                    Special Requests (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    placeholder="e.g. Birthday celebration, high chair required, window table, dietary requirements..."
                    className="w-full bg-[#FAF7F2] border border-[#EDE6DC] rounded-2xl px-4 py-3 text-xs sm:text-sm text-[#1F1916] placeholder-[#6B5E57] focus:outline-none focus:border-[#7A1228] resize-none"
                  />
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading || isFullyBooked}
                  className={`w-full py-4 uppercase tracking-wider text-xs sm:text-sm font-bold rounded-full transition-all shadow-md flex items-center justify-center gap-2 ${
                    isFullyBooked
                      ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                      : 'bg-[#7A1228] hover:bg-[#5C0C1D] text-white hover:shadow-lg transform hover:-translate-y-0.5 cursor-pointer'
                  }`}
                >
                  <UtensilsCrossed className="w-4 h-4 text-[#D4AF37]" />
                  <span>
                    {loading
                      ? 'Submitting Reservation...'
                      : isFullyBooked
                      ? 'Date Fully Booked — Please Select Another Date'
                      : `Confirm Table Reservation for ${guests} Guests`}
                  </span>
                </button>
              </div>

              <div className="text-[11px] text-center text-[#6B5E57] flex items-center justify-center gap-2">
                <Info className="w-3.5 h-3.5 text-[#7A1228]" />
                <span>Instant reservation confirmation. No booking fee required.</span>
              </div>

            </form>

          </div>
        )}

      </div>
    </div>
  );
};
