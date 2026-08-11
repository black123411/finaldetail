import React, { useState, useEffect } from 'react';
import { CloudRain, Sun, Cloud, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface WeatherGuardProps {
  date: string;
}

const WeatherGuard: React.FC<WeatherGuardProps> = ({ date }) => {
  const [weather, setWeather] = useState<{
    condition: string;
    temp: number;
    precip: number;
    recommendation: {
      type: 'success' | 'warning' | 'alert';
      text: string;
    };
  } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!date) return;

    const fetchWeather = async () => {
      setLoading(true);
      try {
        // Omaha/Bellevue coordinates
        const lat = 41.15;
        const lon = -95.91;
        
        const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=weathercode,temperature_2m_max,precipitation_probability_max&timezone=auto&start_date=${date}&end_date=${date}`);
        const data = await response.json();

        if (data.daily) {
          const code = data.daily.weathercode[0];
          const temp = data.daily.temperature_2m_max[0];
          const precip = data.daily.precipitation_probability_max[0];

          let condition = "Clear";
          let recType: 'success' | 'warning' | 'alert' = 'success';
          let recText = "The forecast looks workable for the selected Bellevue appointment.";

          if (code >= 1 && code <= 3) {
            condition = "Partly Cloudy";
          } else if (code >= 45 && code <= 48) {
            condition = "Foggy";
            recType = 'success';
            recText = "Foggy outside. Bellevue drop-off keeps longer and weather-sensitive services protected from the weather.";
          } else if (code >= 51 && code <= 67 || code >= 80) {
            condition = "Rainy";
            recType = 'warning';
            recText = "Rain is in the forecast. Mobile work may need to move, while Bellevue drop-off remains available for longer or weather-sensitive services.";
          }

          if (precip > 30 && recType === 'success') {
            recType = 'success';
            recText = "Rain is possible. Bellevue drop-off is an option for longer or weather-sensitive services; mobile availability depends on the location and weather.";
          }

          setWeather({
            condition,
            temp,
            precip,
            recommendation: { type: recType, text: recText }
          });
        }
      } catch (err) {
        console.error("Weather fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [date]);

  if (!date || loading || !weather) return null;

  return (
    <div className={`p-4 rounded-2xl border flex gap-4 animate-in fade-in slide-in-from-top-2 duration-500 ${
      weather.recommendation.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-900' :
      weather.recommendation.type === 'warning' ? 'bg-amber-50 border-amber-100 text-amber-900' :
      'bg-red-50 border-red-100 text-red-900'
    }`}>
      <div className="shrink-0 w-12 h-12 rounded-xl bg-white/50 backdrop-blur-sm flex items-center justify-center shadow-sm">
        {weather.condition.includes('Rain') ? <CloudRain className="h-6 w-6" /> :
         weather.condition.includes('Cloud') ? <Cloud className="h-6 w-6" /> :
         <Sun className="h-6 w-6" />}
      </div>
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="font-bold text-sm tracking-tight">{weather.condition} Forecast — {weather.temp}°F</span>
          {weather.precip > 0 && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white/50 border border-current/10">{weather.precip}% Precipitation</span>}
        </div>
        <div className="flex items-start gap-1.5">
          {weather.recommendation.type === 'alert' ? <AlertTriangle className="h-3.5 w-3.5 mt-0.5 shrink-0" /> : <CheckCircle2 className="h-3.5 w-3.5 mt-0.5 shrink-0" />}
          <p className="text-xs leading-relaxed opacity-90">{weather.recommendation.text}</p>
        </div>
      </div>
    </div>
  );
};

export default WeatherGuard;
