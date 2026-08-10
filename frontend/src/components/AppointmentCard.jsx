import React from 'react';
import { Calendar, Clock, Mail, User, X, CreditCard, ShieldCheck } from 'lucide-react';

const AppointmentCard = ({ appointment, onCancel }) => (
  <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-[#2D6A4F] hover:shadow-lg transition-shadow">
    <div className="flex justify-between items-start">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <h3 className="text-lg font-bold text-gray-900">{appointment.service}</h3>
          {appointment.price && (
            <span className="text-sm font-extrabold text-[#2D6A4F] bg-[#D8F3DC]/60 px-2.5 py-0.5 rounded-md">
              {appointment.price}
            </span>
          )}
        </div>
        <p className="text-gray-600 flex items-center mb-2 text-sm font-medium">
          <User className="w-4 h-4 mr-2 text-[#2D6A4F]" /> {appointment.provider}
        </p>
        <div className="flex flex-wrap gap-4 text-xs text-gray-500 mb-3">
          <span className="flex items-center">
            <Calendar className="w-4 h-4 mr-1 text-[#2D6A4F]" />
            {appointment.date}
          </span>
          <span className="flex items-center">
            <Clock className="w-4 h-4 mr-1 text-[#2D6A4F]" />
            {appointment.time}
          </span>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
            appointment.status === 'confirmed' ? 'bg-[#D8F3DC] text-[#1F5A3E]' :
            'bg-amber-100 text-amber-800'
          }`}>
            {appointment.status}
          </span>

          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-[#635BFF]/10 text-[#635BFF] border border-[#635BFF]/20">
            <CreditCard className="w-3 h-3 text-[#635BFF]" />
            <span>Paid via Stripe</span>
          </span>

          {appointment.transactionId && (
            <span className="text-[10px] font-mono text-gray-400 bg-gray-50 px-2 py-0.5 rounded border border-gray-200">
              Tx: {appointment.transactionId.slice(0, 14)}...
            </span>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <button 
          title="Send Confirmation Email"
          className="text-[#2D6A4F] hover:bg-[#D8F3DC]/40 p-2 rounded-lg transition-colors cursor-pointer"
        >
          <Mail className="w-4 h-4" />
        </button>
        <button 
          onClick={() => onCancel(appointment._id)} 
          title="Cancel Appointment"
          className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
);

export default AppointmentCard;
