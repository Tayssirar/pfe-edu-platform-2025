import React from "react";

const ArabicDate: React.FC = () => {
  const getArabicDate = () => {
    const days = ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
    const months = [
      "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", 
      "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"
    ];

    const today = new Date();
    const dayName = days[today.getDay()];
    const day = today.getDate();
    const monthName = months[today.getMonth()];
    const year = today.getFullYear();

    return `${dayName}، ${day} ${monthName} ${year}`;
  };

  return <p className="text-muted">{getArabicDate()}</p>;
};

export default ArabicDate;
