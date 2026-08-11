const inMemoryUsers = [];
const inMemoryAppointments = [
  {
    _id: '1',
    service: 'Haircut & Styling',
    provider: 'Mr. Barber',
    date: '2025-07-05',
    time: '10:00 AM',
    price: '₹300',
    status: 'confirmed',
    paymentStatus: 'paid',
    paymentMethod: 'stripe',
    transactionId: 'cs_test_1',
    paidAmount: '₹300',
    name: 'Anandkumar04',
    email: 'anandkumar04@example.com',
    phone: '+91 9876543210'
  }
];

module.exports = {
  inMemoryUsers,
  inMemoryAppointments
};
