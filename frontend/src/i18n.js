import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      welcome: "Welcome to the Canteen Food Ordering System",
      register: "Register",
      login: "Login",
      menu: "Menu",
      placeOrder: "Place Order",
      myOrders: "My Orders",
      adminDashboard: "Admin Dashboard",
      promotions: "Promotions",
      loyaltyPoints: "Loyalty Points",
      language: "Language",
      nonVeg: "Non-Vegetarian",
      vegetarian: "Vegetarian",
    }
  },
  hi: {
    translation: {
      welcome: "कैंटीन फूड ऑर्डरिंग सिस्टम में आपका स्वागत है",
      register: "रजिस्टर करें",
      login: "लॉगिन करें",
      menu: "मेनू",
      placeOrder: "ऑर्डर करें",
      myOrders: "मेरे ऑर्डर",
      adminDashboard: "एडमिन डैशबोर्ड",
      promotions: "प्रमोशन",
      loyaltyPoints: "लॉयल्टी पॉइंट्स",
      language: "भाषा",
      nonVeg: "मांसाहारी",
      vegetarian: "शाकाहारी",
    }
  },
  ta: {
    translation: {
      welcome: "கேண்டீன் உணவு ஆர்டர் அமைப்புக்கு வரவேற்கிறோம்",
      register: "பதிவு செய்யவும்",
      login: "உள்நுழையவும்",
      menu: "மெனு",
      placeOrder: "ஆர்டர் செய்யவும்",
      myOrders: "எனது ஆர்டர்கள்",
      adminDashboard: "நிர்வாக டாஷ்போர்டு",
      promotions: "பிரச்சாரங்கள்",
      loyaltyPoints: "நம்பிக்கை புள்ளிகள்",
      language: "மொழி",
      nonVeg: "மாமிசம்",
      vegetarian: "சைவம்",
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
