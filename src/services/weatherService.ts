import axios from 'axios';

export interface WeatherData {
  temperature: number;
  condition: 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'stormy';
  humidity: number;
  windSpeed: number;
  description: string;
}

export class WeatherService {
  private static readonly API_KEY = process.env.REACT_APP_WEATHER_API_KEY || 'demo_key';
  private static readonly BASE_URL = 'https://api.openweathermap.org/data/2.5';

  static async getCurrentWeather(city: string = 'Toronto'): Promise<WeatherData> {
    try {
      // Try to use real API if key is available
      if (this.API_KEY && this.API_KEY !== 'demo_key') {
        const response = await axios.get(`${this.BASE_URL}/weather`, {
          params: {
            q: city,
            appid: this.API_KEY,
            units: 'metric'
          }
        });

        const data = response.data;
        return {
          temperature: Math.round(data.main.temp),
          condition: this.mapWeatherCondition(data.weather[0].main),
          humidity: data.main.humidity,
          windSpeed: data.wind.speed,
          description: data.weather[0].description
        };
      }

      // Fallback to realistic mock data based on time of day and season
      const now = new Date();
      const hour = now.getHours();
      const month = now.getMonth();
      
      // Seasonal temperature adjustments
      let baseTemp = 20;
      if (month >= 11 || month <= 2) baseTemp = 0; // Winter
      else if (month >= 3 && month <= 5) baseTemp = 15; // Spring
      else if (month >= 6 && month <= 8) baseTemp = 25; // Summer
      else baseTemp = 10; // Fall
      
      // Time of day adjustments
      if (hour >= 6 && hour <= 10) baseTemp -= 2; // Morning
      else if (hour >= 11 && hour <= 16) baseTemp += 3; // Afternoon
      else if (hour >= 17 && hour <= 21) baseTemp += 1; // Evening
      else baseTemp -= 4; // Night
      
      // Add some realistic variation
      const variation = Math.floor(Math.random() * 6) - 3; // -3 to +3
      const temperature = Math.max(-10, Math.min(35, baseTemp + variation));
      
      // Realistic weather conditions based on temperature
      let condition: WeatherData['condition'];
      if (temperature < 0) {
        condition = Math.random() > 0.7 ? 'snowy' : 'cloudy';
      } else if (temperature < 10) {
        condition = Math.random() > 0.6 ? 'cloudy' : 'rainy';
      } else if (temperature < 20) {
        const rand = Math.random();
        if (rand > 0.7) condition = 'sunny';
        else if (rand > 0.4) condition = 'cloudy';
        else condition = 'rainy';
      } else {
        const rand = Math.random();
        if (rand > 0.8) condition = 'stormy';
        else if (rand > 0.3) condition = 'sunny';
        else condition = 'cloudy';
      }
      
      return {
        temperature,
        condition,
        humidity: Math.floor(Math.random() * 40) + 40, // 40-80%
        windSpeed: Math.floor(Math.random() * 15) + 5, // 5-20 km/h
        description: this.getWeatherDescription(condition)
      };
    } catch (error) {
      console.error('Weather service error:', error);
      // Fallback to default weather
      return {
        temperature: 15,
        condition: 'cloudy',
        humidity: 60,
        windSpeed: 10,
        description: 'Partly cloudy'
      };
    }
  }

  private static mapWeatherCondition(condition: string): WeatherData['condition'] {
    const conditionLower = condition.toLowerCase();
    if (conditionLower.includes('sun') || conditionLower.includes('clear')) return 'sunny';
    if (conditionLower.includes('rain') || conditionLower.includes('drizzle')) return 'rainy';
    if (conditionLower.includes('snow')) return 'snowy';
    if (conditionLower.includes('storm') || conditionLower.includes('thunder')) return 'stormy';
    return 'cloudy';
  }

  private static getWeatherDescription(condition: WeatherData['condition']): string {
    switch (condition) {
      case 'sunny': return 'Clear and sunny';
      case 'cloudy': return 'Partly cloudy';
      case 'rainy': return 'Light rain';
      case 'snowy': return 'Snow showers';
      case 'stormy': return 'Thunderstorms';
      default: return 'Variable conditions';
    }
  }

  static getWeatherAwareActivities(weather: WeatherData, allActivities: any[]): any[] {
    // Filter activities based on weather conditions
    return allActivities.filter(activity => {
      const isOutdoor = activity.tags.includes('outdoor') || activity.tags.includes('running');
      
      switch (weather.condition) {
        case 'rainy':
        case 'stormy':
          return !isOutdoor; // Prefer indoor activities
        case 'snowy':
          return !isOutdoor || activity.tags.includes('winter_sports');
        case 'sunny':
          return true; // All activities suitable
        case 'cloudy':
        default:
          return true; // All activities suitable
      }
    });
  }

  static getWeatherIcon(condition: WeatherData['condition']): string {
    switch (condition) {
      case 'sunny': return '☀️';
      case 'cloudy': return '☁️';
      case 'rainy': return '🌧️';
      case 'snowy': return '❄️';
      case 'stormy': return '⛈️';
      default: return '🌤️';
    }
  }
}
