// Utility formatters for Indiacart24

export const formatPrice = (price) => {
  if (price === undefined || price === null) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);
};

export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

export const truncateText = (text, maxLength = 60) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substr(0, maxLength) + '...';
};

export const getStatusColor = (status) => {
  switch (status) {
    case 'Processing':
      return 'badge-warning';
    case 'Confirmed':
      return 'badge-primary';
    case 'Shipped':
      return 'badge-primary';
    case 'Out for Delivery':
      return 'badge-warning';
    case 'Delivered':
      return 'badge-success';
    case 'Cancelled':
      return 'badge-danger';
    default:
      return 'badge-outline';
  }
};
