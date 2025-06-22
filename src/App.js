import React, { useEffect, useState } from "react";
import {
  Repeat,
  Timer
} from "lucide-react";
import AzanTimes from "./AzanTimes";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function MusalliWebsite() {
  const [tasbeehCount, setTasbeehCount] = useState(() => {
    const savedCount = localStorage.getItem("tasbeehCount");
    return savedCount ? parseInt(savedCount) : 0;
  });
  const [currentZekr, setCurrentZekr] = useState("سبحان الله");
  const zekrList = ["سبحان الله", "الحمد لله", "الله أكبر", "لا إله إلا الله"];
  const [zekrIndex, setZekrIndex] = useState(0);
  const [timer, setTimer] = useState(0);
  const [intervalId, setIntervalId] = useState(null);
  const [dailyStats, setDailyStats] = useState(() => {
    const saved = localStorage.getItem("dailyStats");
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem("tasbeehCount", tasbeehCount);
    const today = new Date().toLocaleDateString("ar-EG");
    setDailyStats((prev) => {
      const updated = { ...prev, [today]: tasbeehCount };
      localStorage.setItem("dailyStats", JSON.stringify(updated));
      return updated;
    });
  }, [tasbeehCount]);

  useEffect(() => {
    if ("Notification" in window) {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          const now = new Date();
          const next = new Date();
          next.setHours(20, 0, 0, 0);
          const timeout = next - now;
          setTimeout(() => {
            new Notification("تذكير بالسبحة", {
              body: "لا تنسَ ذكر الله اليوم 🌙",
              icon: "https://cdn-icons-png.flaticon.com/512/3448/3448610.png",
            });
          }, timeout);
        }
      });
    }
  }, []);

  const handleTasbeeh = () => {
    const newCount = tasbeehCount + 1;
    setTasbeehCount(newCount);
    if (newCount % 33 === 0) {
      const nextIndex = (zekrIndex + 1) % zekrList.length;
      setZekrIndex(nextIndex);
      setCurrentZekr(zekrList[nextIndex]);
    }
    const clickSound = new Audio(
      "https://www.soundjay.com/buttons/sounds/button-16.mp3"
    );
    clickSound.play();
  };

  const resetTasbeeh = () => {
    setTasbeehCount(0);
    setZekrIndex(0);
    setCurrentZekr(zekrList[0]);
    setTimer(0);
    clearInterval(intervalId);
  };

  const startTimer = () => {
    if (!intervalId) {
      const id = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
      setIntervalId(id);
    }
  };

  const formatTime = (sec) => {
    const minutes = Math.floor(sec / 60);
    const seconds = sec % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const chartData = {
    labels: Object.keys(dailyStats),
    datasets: [
      {
        label: "عدد التسبيحات",
        data: Object.values(dailyStats),
        backgroundColor: "#10b981",
      },
    ],
  };

  // Simple button styles
  const buttonStyle = {
    padding: "0.5rem 1rem",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
    backgroundColor: "#10b981",
    color: "white",
    fontWeight: "bold",
    fontSize: "1rem",
  };

  const buttonSecondaryStyle = {
    ...buttonStyle,
    backgroundColor: "#6b7280",
  };

  const buttonOutlineStyle = {
    ...buttonStyle,
    backgroundColor: "transparent",
    border: "2px solid #10b981",
    color: "#10b981",
  };

  return (
    <div
      dir="rtl"
      style={{
        padding: "1.5rem",
        maxWidth: "48rem",
        margin: "0 auto",
        display: "grid",
        gap: "1.5rem",
        backgroundColor: "#f3f4f6",
        color: "black",
        minHeight: "100vh",
      }}
    >
      {/* Azan Times Section */}
      <section>
        <AzanTimes />
      </section>

      {/* Tasbeeh Section */}
      <section>
        <h2
          style={{
            fontSize: "1.5rem",
            fontWeight: "600",
            marginBottom: "0.75rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <Repeat size={24} /> السبحة الإلكترونية
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div
            style={{ display: "flex", alignItems: "center", gap: "1rem" }}
          >
            <div
              style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
            >
              <span
                style={{ fontSize: "1.125rem", color: "#6b7280" }}
              >
                الذكر الحالي
              </span>
              <span style={{ fontSize: "1.5rem", fontWeight: "600" }}>
                {currentZekr}
              </span>
            </div>
            <span style={{ fontSize: "1.875rem", fontWeight: "700" }}>
              {tasbeehCount}
            </span>
            <button onClick={handleTasbeeh} style={buttonStyle}>
              سبّح
            </button>
            <button onClick={resetTasbeeh} style={buttonSecondaryStyle}>
              إعادة
            </button>
          </div>
          <div
            style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}
          >
            <Timer size={20} />
            <span>مدة التسبيح: {formatTime(timer)}</span>
            <button onClick={startTimer} style={buttonOutlineStyle}>
              ابدأ المؤقت
            </button>
          </div>
          <div style={{ marginTop: "1.5rem" }}>
            <h3
              style={{
                fontSize: "1.125rem",
                fontWeight: "600",
                marginBottom: "0.5rem",
              }}
            >
              الإحصائيات اليومية
            </h3>
            <Bar data={chartData} />
          </div>
        </div>
      </section>
    </div>
  );
}
