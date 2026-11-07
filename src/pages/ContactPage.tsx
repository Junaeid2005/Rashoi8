import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  MessageSquareWarning,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { submitCustomerMessage } from '../services/feedbackService';

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [category, setCategory] = useState<'complaint' | 'quality' | 'order_issue' | 'suggestion' | 'general'>('general');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    setLoading(true);

    try {
      await submitCustomerMessage({
        name,
        email,
        phone,
        category,
        subject,
        message,
      });

      setSuccessMessage(true);
      setName('');
      setEmail('');
      setPhone('');
      setSubject('');
      setMessage('');
    } catch (err: any) {
      console.error('Failed to submit message:', err);
      setErrorMessage('Could not deliver your message. Please telephone us directly on 01276 452 197.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1F1916] py-14 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-14">
        
        {/* Page Title */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#7A1228]/10 text-[#7A1228] text-xs uppercase tracking-[0.2em] font-semibold border border-[#7A1228]/20">
            <Sparkles className="w-3.5 h-3.5 text-[#C59B27]" />
            <span>Windlesham, Surrey</span>
          </div>
          <h1 className="font-['Playfair_Display'] text-3xl sm:text-5xl font-bold text-[#1F1916]">
            Contact Rashoi & Feedback
          </h1>
          <p className="text-sm sm:text-base text-[#6B5E57] font-normal leading-relaxed">
            We welcome table inquiries, customer feedback, and reviews. For immediate bookings or takeout assistance, please call our restaurant telephone numbers.
          </p>
        </div>

        {/* Contact Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Location */}
          <div className="bg-white border border-[#EDE6DC] rounded-3xl p-6 sm:p-7 space-y-3 shadow-sm hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[#7A1228]/10 flex items-center justify-center text-[#7A1228]">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="font-['Playfair_Display'] text-xl font-bold text-[#1F1916]">Restaurant Address</h3>
            <div className="text-xs text-[#6B5E57] space-y-1">
              <p className="font-semibold text-[#1F1916]">Rashoi Indian Cuisine</p>
              <p>58 Updown Hill</p>
              <p>Windlesham, Surrey</p>
              <p className="font-semibold text-[#7A1228]">GU20 6DX, United Kingdom</p>
            </div>
            <a
              href="https://maps.google.com/?q=58+Updown+Hill,+Windlesham,+Surrey+GU20+6DX"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 uppercase tracking-wider text-xs font-bold text-[#7A1228] hover:text-[#5C0C1D] transition-colors pt-2"
            >
              <span>Get Directions</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Card 2: Telephone */}
          <div className="bg-white border border-[#EDE6DC] rounded-3xl p-6 sm:p-7 space-y-3 shadow-sm hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[#7A1228]/10 flex items-center justify-center text-[#7A1228]">
              <Phone className="w-6 h-6" />
            </div>
            <h3 className="font-['Playfair_Display'] text-xl font-bold text-[#1F1916]">Telephone Enquiries</h3>
            <p className="text-xs text-[#6B5E57]">Direct lines for reservations and collection orders:</p>
            <div className="space-y-1.5 pt-1">
              <a
                href="tel:01276452197"
                className="block text-base font-bold text-[#1F1916] hover:text-[#7A1228] transition-colors"
              >
                01276 452 197
              </a>
              <a
                href="tel:01276453388"
                className="block text-base font-bold text-[#1F1916] hover:text-[#7A1228] transition-colors"
              >
                01276 453 388
              </a>
            </div>
            <p className="text-[11px] text-[#6B5E57] pt-1">Lines open from 11:30 AM daily.</p>
          </div>

          {/* Card 3: Opening Hours */}
          <div className="bg-white border border-[#EDE6DC] rounded-3xl p-6 sm:p-7 space-y-3 shadow-sm hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[#7A1228]/10 flex items-center justify-center text-[#7A1228]">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="font-['Playfair_Display'] text-xl font-bold text-[#1F1916]">Opening Hours</h3>
            <p className="text-xs uppercase tracking-wider font-bold text-[#7A1228]">Open 7 Days a Week</p>
            <div className="text-xs text-[#6B5E57] space-y-1.5 bg-[#FAF7F2] p-3 rounded-2xl border border-[#EDE6DC]">
              <div className="flex justify-between">
                <span>Lunch:</span>
                <span className="font-semibold text-[#1F1916]">12:00 PM – 2:30 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Dinner:</span>
                <span className="font-semibold text-[#1F1916]">5:30 PM – 11:00 PM</span>
              </div>
            </div>
            <p className="text-[11px] text-[#6B5E57]">Including Bank Holidays & Sundays.</p>
          </div>

        </div>

        {/* Complaints & Feedback Form + Google Map Embed */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Complaints & Feedback Section */}
          <div className="lg:col-span-7 bg-white border border-[#EDE6DC] rounded-3xl p-6 sm:p-10 shadow-sm space-y-6">
            
            <div className="space-y-1 border-b border-[#EDE6DC] pb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#7A1228] flex items-center gap-2">
                <MessageSquareWarning className="w-4 h-4 text-[#7A1228]" /> Dedicated Customer Service
              </span>
              <h2 className="font-['Playfair_Display'] text-2xl sm:text-3xl font-bold text-[#1F1916]">
                COMPLAINTS & FEEDBACK
              </h2>
              <p className="text-xs sm:text-sm text-[#6B5E57] font-normal leading-relaxed">
                We take our food quality and guest satisfaction seriously. You can reach out directly regarding compliments, food quality concerns, suggestions for menu additions, or ordering issues. All feedback is reviewed by restaurant management.
              </p>
            </div>

            {successMessage && (
              <div className="p-4 rounded-2xl bg-[#7A1228]/10 border border-[#7A1228]/30 text-[#1F1916] text-xs flex items-start gap-3 shadow-sm">
                <CheckCircle2 className="w-5 h-5 text-[#7A1228] shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-[#7A1228]">Thank you for your feedback!</p>
                  <p className="mt-0.5 text-[#6B5E57]">Your message has been submitted to the Rashoi management team. If you requested a reply, we will contact you shortly.</p>
                </div>
              </div>
            )}

            {errorMessage && (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block uppercase tracking-wider text-xs font-bold text-[#1F1916] mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Full name"
                    className="w-full bg-[#FAF7F2] border border-[#EDE6DC] rounded-2xl px-4 py-3 text-xs sm:text-sm text-[#1F1916] placeholder-[#6B5E57] focus:outline-none focus:border-[#7A1228] focus:ring-1 focus:ring-[#7A1228]"
                  />
                </div>

                <div>
                  <label className="block uppercase tracking-wider text-xs font-bold text-[#1F1916] mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full bg-[#FAF7F2] border border-[#EDE6DC] rounded-2xl px-4 py-3 text-xs sm:text-sm text-[#1F1916] placeholder-[#6B5E57] focus:outline-none focus:border-[#7A1228] focus:ring-1 focus:ring-[#7A1228]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block uppercase tracking-wider text-xs font-bold text-[#1F1916] mb-1">
                    Telephone (Optional)
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 07123 456789"
                    className="w-full bg-[#FAF7F2] border border-[#EDE6DC] rounded-2xl px-4 py-3 text-xs sm:text-sm text-[#1F1916] placeholder-[#6B5E57] focus:outline-none focus:border-[#7A1228] focus:ring-1 focus:ring-[#7A1228]"
                  />
                </div>

                <div>
                  <label className="block uppercase tracking-wider text-xs font-bold text-[#1F1916] mb-1">
                    Nature of Message *
                  </label>
                  <select
                    value={category}
                    onChange={(e: any) => setCategory(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#EDE6DC] rounded-2xl px-4 py-3 text-xs sm:text-sm text-[#1F1916] focus:outline-none focus:border-[#7A1228] focus:ring-1 focus:ring-[#7A1228]"
                  >
                    <option value="general">General Feedback / Inquiry</option>
                    <option value="complaint">Complaint</option>
                    <option value="quality">Food Quality</option>
                    <option value="order_issue">Ordering / Takeaway Problem</option>
                    <option value="suggestion">Suggestion / Menu Additions</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block uppercase tracking-wider text-xs font-bold text-[#1F1916] mb-1">
                  Subject *
                </label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Feedback regarding Sunday dinner"
                  className="w-full bg-[#FAF7F2] border border-[#EDE6DC] rounded-2xl px-4 py-3 text-xs sm:text-sm text-[#1F1916] placeholder-[#6B5E57] focus:outline-none focus:border-[#7A1228] focus:ring-1 focus:ring-[#7A1228]"
                />
              </div>

              <div>
                <label className="block uppercase tracking-wider text-xs font-bold text-[#1F1916] mb-1">
                  Your Message *
                </label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Please write your comments or details here..."
                  className="w-full bg-[#FAF7F2] border border-[#EDE6DC] rounded-2xl px-4 py-3 text-xs sm:text-sm text-[#1F1916] placeholder-[#6B5E57] focus:outline-none focus:border-[#7A1228] focus:ring-1 focus:ring-[#7A1228] resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 uppercase tracking-wider text-xs sm:text-sm font-bold text-white bg-[#7A1228] hover:bg-[#5C0C1D] rounded-full shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4 text-[#D4AF37]" />
                <span>{loading ? 'Submitting...' : 'Send Message to Management'}</span>
              </button>

            </form>

          </div>

          {/* Right Column: Google Map Embed */}
          <div className="lg:col-span-5 bg-white border border-[#EDE6DC] rounded-3xl overflow-hidden shadow-sm flex flex-col">
            <div className="p-5 border-b border-[#EDE6DC]">
              <h3 className="font-['Playfair_Display'] text-lg font-bold text-[#1F1916] flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#7A1228]" /> Location Map
              </h3>
              <p className="text-xs text-[#6B5E57]">
                58 Updown Hill, Windlesham, Surrey GU20 6DX
              </p>
            </div>

            <div className="h-[380px] w-full bg-[#F5EFE6] relative">
              <iframe
                title="Rashoi Windlesham Map"
                src="https://maps.google.com/maps?q=58+Updown+Hill,+Windlesham,+Surrey+GU20+6DX&t=&z=15&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            <div className="p-5 bg-[#FAF7F2] border-t border-[#EDE6DC] text-xs text-[#6B5E57] space-y-1">
              <p className="font-semibold text-[#1F1916]">Free On-site & Village Parking Available</p>
              <p className="text-[11px] text-[#6B5E57]">Located on Updown Hill in the picturesque village of Windlesham.</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
