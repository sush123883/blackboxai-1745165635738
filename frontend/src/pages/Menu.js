import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
} from 'react-share';

function Menu() {
  const { t } = useTranslation();
  const [menuItems, setMenuItems] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchMenuItems();
    fetchRecommendations();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const response = await fetch('/api/menu');
      const data = await response.json();
      if (response.ok) {
        setMenuItems(data);
      } else {
        setMessage(data.message || 'Failed to fetch menu items');
      }
    } catch (error) {
      setMessage('Error: ' + error.message);
    }
  };

  const fetchRecommendations = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/recommendations', {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setRecommendations(data);
      } else {
        setMessage(data.message || 'Failed to fetch recommendations');
      }
    } catch (error) {
      setMessage('Error: ' + error.message);
    }
  };

  const shareUrl = window.location.href;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">{t('menu')}</h2>

      {message && <p className="mb-4 text-red-600">{message}</p>}

      <div className="flex space-x-4 mb-6">
        <FacebookShareButton url={shareUrl} quote={t('menu')}>
          <FacebookIcon size={32} round />
        </FacebookShareButton>
        <TwitterShareButton url={shareUrl} title={t('menu')}>
          <TwitterIcon size={32} round />
        </TwitterShareButton>
        <WhatsappShareButton url={shareUrl} title={t('menu')}>
          <WhatsappIcon size={32} round />
        </WhatsappShareButton>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {menuItems.map(item => (
          <div key={item._id} className="bg-white rounded shadow p-4 flex flex-col">
            {item.imageUrl && (
              <img src={item.imageUrl} alt={item.name} className="w-full h-40 object-cover rounded mb-2" />
            )}
            <h3 className="font-semibold text-lg">{item.name}</h3>
            <p className="text-sm text-gray-600 mb-1">{item.description}</p>
            <p className="mb-1">
              <span className={`inline-block px-2 py-1 rounded text-white text-xs font-semibold ${item.isNonVegetarian ? 'bg-red-600' : 'bg-green-600'}`}>
                {item.isNonVegetarian ? t('nonVeg') : t('vegetarian')}
              </span>
            </p>
            <p className="font-bold mt-auto">₹{item.price.toFixed(2)}</p>
            {/* Reviews and ratings can be added here in future */}
          </div>
        ))}
      </div>

      {recommendations.length > 0 && (
        <div className="mt-10">
          <h3 className="text-2xl font-semibold mb-4">{t('recommendations')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recommendations.map(item => (
              <div key={item._id} className="bg-yellow-50 rounded shadow p-4 flex flex-col">
                {item.imageUrl && (
                  <img src={item.imageUrl} alt={item.name} className="w-full h-40 object-cover rounded mb-2" />
                )}
                <h4 className="font-semibold text-lg">{item.name}</h4>
                <p className="text-sm text-gray-600 mb-1">{item.description}</p>
                <p className="mb-1">
                  <span className={`inline-block px-2 py-1 rounded text-white text-xs font-semibold ${item.isNonVegetarian ? 'bg-red-600' : 'bg-green-600'}`}>
                    {item.isNonVegetarian ? t('nonVeg') : t('vegetarian')}
                  </span>
                </p>
                <p className="font-bold mt-auto">₹{item.price.toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Menu;
