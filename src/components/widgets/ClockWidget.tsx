// "use client";
// import { useEffect, useState } from "react";

// export default function ClockWidget() {
//   const [time, setTime] = useState<string>("");

//   useEffect(() => {
//     const update = () => setTime(new Date().toLocaleTimeString());
//     update();
//     const interval = setInterval(update, 1000);
//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <div className="p-4 bg-base-200 rounded-lg shadow">
//       <h2 className="text-xl font-bold">{time}</h2>
//     </div>
//   );
// }
import { useEffect, useState } from "react";
import { Inter } from "next/font/google";

const outfit = Inter({
  subsets: ["latin"],
  weight: ["600"], // You can add other weights, e.g., "700" for bold
  display: "swap", // Prevents invisible text on load
});

export default function ClockWidget() {
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      setTime(`${hours}:${minutes}`);
    };

    update();
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center justify-center">
      <span
        className={`${outfit.className} text-7xl md:text-8xl tabular-nums drop-shadow-[0_0_12px_rgba(255,255,255,0.15)]`}
      >
        {time}
      </span>
    </div>
  );
}
