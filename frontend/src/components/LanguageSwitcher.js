import React from 'react';
import { useTranslation } from 'react-i18next';

function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="flex space-x-2 items-center">
      <label htmlFor="language" className="font-semibold">Language:</label>
      <select
        id="language"
        value={i18n.language}
        onChange={(e) => changeLanguage(e.target.value)}
        className="border border-gray-300 rounded px-2 py-1"
      >
        <option value="en">English</option>
        <option value="hi">हिन्दी</option>
      </select>
    </div>
  );
}

export default LanguageSwitcher;
