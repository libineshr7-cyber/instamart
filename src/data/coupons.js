export const COUPONS = [
  {
    code: "INSTA100",
    title: "Flat ₹100 OFF",
    description: "Get ₹100 flat discount on orders above ₹499",
    minAmount: 499,
    discountType: "flat",
    discountValue: 100,
    tag: "POPULAR"
  },
  {
    code: "FREEDEL",
    title: "Free Delivery",
    description: "Save ₹35 delivery fee on orders above ₹199",
    minAmount: 199,
    discountType: "free_delivery",
    discountValue: 35,
    tag: "SAVINGS"
  },
  {
    code: "SUPER20",
    title: "20% OFF up to ₹75",
    description: "Get 20% instant discount on orders above ₹299",
    minAmount: 299,
    discountType: "percent",
    discountValue: 20,
    maxDiscount: 75,
    tag: "BESTSELLER"
  },
  {
    code: "WELCOME50",
    title: "Flat ₹50 OFF for New Users",
    description: "First order special discount on minimum ₹249",
    minAmount: 249,
    discountType: "flat",
    discountValue: 50,
    tag: "NEW USER"
  }
];
