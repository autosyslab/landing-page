import { useState } from 'react';
import { FileDown, Mail, X, CheckCircle, Loader2 } from 'lucide-react';
import { generateROIPDF } from '../utils/generateROIPDF';

interface ROIPDFExportProps {
  hoursSaved: number;
  monthlySavings: number;
  annualSavings: number;
  monthlyHours: number;
  hourlyCost: number;
  employees: number;
  coverage: number;
}

export default function ROIPDFExport({
  hoursSaved,
  monthlySavings,
  annualSavings,
  monthlyHours,
  hourlyCost,
  employees,
  coverage
}: ROIPDFExportProps) {
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleExport = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const webhookUrl = 'https://n8n-twi3.onrender.com/webhook/ee3cda9a-0380-4157-9770-f9a52976311a';

      const webhookData = {
        name,
        email,
        company: company || 'Not provided',
        calculations: {
          hoursSaved,
          monthlySavings,
          annualSavings,
          monthlyHours,
          hourlyCost,
          employees,
          coverage
        },
        timestamp: new Date().toISOString(),
        source: 'ROI Calculator'
      };

      fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(webhookData),
      }).catch((err) => {
        console.warn('Webhook failed, but continuing with PDF generation:', err);
      });

      const pdf = generateROIPDF({
        name,
        email,
        company,
        hoursSaved,
        monthlySavings,
        annualSavings,
        monthlyHours,
        hourlyCost,
        employees,
        coverage
      });

      const fileName = `AutoSysLab-ROI-Report-${name.replace(/\s+/g, '-')}-${Date.now()}.pdf`;
      pdf.save(fileName);

      setIsSuccess(true);

      setTimeout(() => {
        setShowModal(false);
        setIsSuccess(false);
        setEmail('');
        setName('');
        setCompany('');
      }, 2000);

    } catch (err) {
      console.error('Error generating PDF:', err);
      setError('Failed to generate report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="w-full group relative overflow-hidden inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300"
      >
        <FileDown className="w-5 h-5 group-hover:animate-bounce" />
        <span>Get My Full ROI Report</span>
      </button>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-gentle-fade-in">
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 transform transition-all duration-300">
            <button
              onClick={() => {
                setShowModal(false);
                setError(null);
              }}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 transition-colors"
              aria-label="Close modal"
              disabled={isSubmitting}
            >
              <X className="w-5 h-5" />
            </button>

            {isSuccess ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Success!</h3>
                <p className="text-slate-600">Your ROI report is downloading now.</p>
                <p className="text-sm text-slate-500 mt-2">Check your downloads folder!</p>
              </div>
            ) : (
              <>
                <div className="text-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <FileDown className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">
                    Your Report is Ready!
                  </h3>
                  <p className="text-slate-600 text-sm">
                    Enter your details below to instantly download your personalized ROI analysis
                  </p>
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600 text-center">{error}</p>
                  </div>
                )}

                <form onSubmit={handleExport} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      id="name"
                      type="text"
                      required
                      disabled={isSubmitting}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border-2 border-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-1">
                      Work Email *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        id="email"
                        type="email"
                        required
                        disabled={isSubmitting}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 rounded-lg border-2 border-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        placeholder="john@company.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="company" className="block text-sm font-semibold text-slate-700 mb-1">
                      Company Name
                    </label>
                    <input
                      id="company"
                      type="text"
                      disabled={isSubmitting}
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border-2 border-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="Acme Corp"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Generating Report...</span>
                      </>
                    ) : (
                      <>
                        <FileDown className="w-5 h-5" />
                        <span>Download My Report</span>
                      </>
                    )}
                  </button>

                  <p className="text-xs text-slate-500 text-center mt-3">
                    🔒 We respect your privacy. Your information is secure and will never be shared.
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
