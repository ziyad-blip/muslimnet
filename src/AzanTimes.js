import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AzanTimes() {
  const [times, setTimes] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("المتصفح لا يدعم الوصول إلى الموقع");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;

        axios
          .get("https://api.aladhan.com/v1/timings", {
            params: {
              latitude,
              longitude,
              method: 2,  // You can change the method as needed
            },
          })
          .then(res => {
            setTimes(res.data.data.timings);
            setLoading(false);
          })
          .catch(() => {
            setError("فشل في تحميل أوقات الصلاة");
            setLoading(false);
          });
      },
      () => {
        setError("يرجى السماح بالوصول إلى الموقع");
        setLoading(false);
      }
    );
  }, []);

  if (loading) return <p>جار تحميل أوقات الصلاة...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div dir="rtl" className="bg-white p-4 rounded shadow my-4 max-w-md mx-auto">
      <h3 className="text-xl font-semibold mb-3">أوقات الصلاة اليوم</h3>
      <ul className="space-y-1">
        {Object.entries(times).map(([name, time]) => (
          <li key={name} className="flex justify-between border-b py-1">
            <span className="font-medium">{name}</span>
            <span>{time}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
