import { Check, QrCode } from 'lucide-react';

export const Register = () => {
  return (
    <section id="register" className="py-20 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl font-bold mb-6 text-white">
              Ready to <span className="text-neon-green">Ship?</span>
            </h2>
            <p className="text-gray-300 mb-8 text-lg">
              Secure your spot in the 10-hour innovation sprint. Spaces are limited and fill up fast.
            </p>

            <div className="space-y-6 mb-8">
              <div className="bg-card-bg p-6 rounded-lg border border-white/10 flex justify-between items-center">
                <div>
                  <h4 className="text-xl font-bold text-white">Early Bird</h4>
                  <p className="text-sm text-gray-400">Ends 28th Feb 2026</p>
                </div>
                <div className="text-3xl font-bold text-neon-green">₹110<span className="text-sm text-gray-500 font-normal">/person</span></div>
              </div>
              
              <div className="bg-card-bg p-6 rounded-lg border border-white/10 flex justify-between items-center opacity-75">
                <div>
                  <h4 className="text-xl font-bold text-white">Regular Fee</h4>
                  <p className="text-sm text-gray-400">From 1st Mar 2026</p>
                </div>
                <div className="text-3xl font-bold text-white">₹150<span className="text-sm text-gray-500 font-normal">/person</span></div>
              </div>
            </div>

            <h4 className="text-white font-bold mb-4">What's included:</h4>
            <ul className="space-y-3">
              {['Event Entry & ID Card', 'Lunch & Refreshments', 'Swag & Stickers', 'Participation Certificate', 'WiFi & Power Access'].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-gray-300">
                  <div className="bg-neon-green/20 p-1 rounded-full">
                    <Check size={14} className="text-neon-green" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white p-8 rounded-2xl max-w-md mx-auto w-full text-center shadow-[0_0_50px_rgba(255,255,255,0.1)]">
            <h3 className="text-2xl font-bold text-black mb-2">Scan to Register</h3>
            <p className="text-gray-600 mb-6">Use any UPI app or visit the link</p>
            
            <div className="bg-gray-100 p-4 rounded-xl mb-6 inline-block">
               {/* Placeholder QR Code - In real app, would be actual QR */}
               <QrCode size={200} className="text-black" />
            </div>
            
            <div className="space-y-4">
              <a href="https://forms.gle/sample-link" target="_blank" rel="noreferrer" className="block w-full py-3 bg-black text-white font-bold rounded-lg hover:bg-gray-800 transition-colors">
                Open Registration Form
              </a>
              <p className="text-xs text-gray-500">
                Having trouble? Contact us at <a href="mailto:support@kdkce.edu.in" className="underline">support@kdkce.edu.in</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
