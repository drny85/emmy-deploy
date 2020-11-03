class Order {
  constructor(
    customer,
    shippingAddress,
    orderItems,
    orderTotal,
    paymentDetails,
    isPaid = false,
    placedOn = new Date().toISOString(),
    isDelivered = false,
    trackingNumber = null,
    deliveredOn = null,
    user,
    coupon
  ) {
    this.customer = customer;
    this.shippingAddress = shippingAddress;
    this.orderItems = orderItems;
    this.orderTotal = orderTotal;
    this.paymentDetails = paymentDetails;
    this.isPaid = isPaid;
    this.placedOn = placedOn;
    this.isDelivered = isDelivered;
    this.trackingNumber = trackingNumber;
    this.deliveredOn = deliveredOn;
    this.user = user;
    this.coupon = coupon;
  }
}

export default Order;
