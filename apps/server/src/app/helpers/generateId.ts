export const generateOrderId = () => {
  // Generate a random 5-digit number between 10000 and 99999
  const orderNumber = Math.floor(10000 + Math.random() * 90000);
  return orderNumber.toString();
};
