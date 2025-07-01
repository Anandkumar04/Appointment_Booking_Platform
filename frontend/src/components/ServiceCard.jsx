import React from 'react';
import { Star, Clock, User } from 'lucide-react';

const ServiceCard = ({ service, onSelect }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden group cursor-pointer border border-gray-100"
         onClick={() => onSelect(service)}>
      <div className="relative overflow-hidden">
        <img 
          src={service.image} 
          alt={service.name}
          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3 bg-white px-2 py-1 rounded-full text-sm font-semibold text-gray-900 shadow-lg">
          {service.price}
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
          {service.name}
        </h3>
        
        <div className="flex items-center text-gray-600 mb-2">
          <User className="w-4 h-4 mr-2" />
          <span>{service.provider}</span>
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center text-gray-500">
            <Clock className="w-4 h-4 mr-1" />
            <span className="text-sm">{service.duration}</span>
          </div>
          
          <div className="flex items-center">
            <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
            <span className="text-sm font-medium text-gray-700">
              {service.rating}
            </span>
          </div>
        </div>
        
        <div className="text-center">
          <span className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
            {service.category}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;