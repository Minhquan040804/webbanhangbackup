/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./public/views/layout_user.ejs",
  "./public/views/customer/home/index.ejs",
  "./public/views/customer/product/index.ejs",
  "./public/views/customer/news/index.ejs",
  "./public/views/customer/cart/index.ejs",
  "./public/views/customer/order/index.ejs",
  "./public/views/customer/contact/index.ejs"],
  theme: {
    extend: {},
  },
  plugins: [],
}

