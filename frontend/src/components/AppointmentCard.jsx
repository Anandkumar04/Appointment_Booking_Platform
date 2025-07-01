import React from 'react';
import { Calendar, Clock, Mail, User, X } from 'lucide-react';

const AppointmentCard = ({ appointment, onCancel }) => (
  <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
    <div className="flex justify-between">
      <div>
        <h3 className="text-lg font-semibold">{appointment.service}</h3>
        <p className="text-gray-600 flex items-center mb-2">
          <User className="w-4 h-4 mr-2" /> {appointment.provider}
        </p>
        <div className="flex gap-4 text-sm text-gray-500 mb-2">
          <span className="flex items-center">
            <Calendar className="w-4 h-4 mr-1" />
            {appointment.date}
          </span>
          <span className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            {appointment.time}
          </span>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
          appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' :
          'bg-yellow-100 text-yellow-800'
        }`}>
          {appointment.status}
        </span>
      </div>
      <div className="flex flex-col gap-2">
        <button className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg">
          <Mail className="w-4 h-4" />
        </button>
        <button onClick={() => onCancel(appointment._id)} className="text-red-600 hover:bg-red-50 p-2 rounded-lg">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
);

export default AppointmentCard;
