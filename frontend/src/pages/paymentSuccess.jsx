import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle2, Calendar, ArrowRight } from 'lucide-react';

const PaymentSuccess = ({ fetchAppointments }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (fetchAppointments) {
      fetchAppointments();
    }
  }, [fetchAppointments]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-100 p-8 text-center space-y-6">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payment Successful!</h1>
          <p className="text-sm text-gray-600 mt-2">
            Your payment via Stripe was received. Your appointment is confirmed and recorded.
          </p>
        </div>

        {sessionId && (
          <div className="bg-gray-50 rounded-xl p-3 text-xs text-gray-500 font-mono break-all border border-gray-200">
            Session ID: {sessionId}
          </div>
        )}

        <div className="pt-2 space-y-3">
          <button
            onClick={() => navigate('/profile')}
            className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Calendar className="w-4 h-4" />
            <span>View My Appointments</span>
          </button>

          <button
            onClick={() => navigate('/')}
            className="w-full py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Return to Home</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
