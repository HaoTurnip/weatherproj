console.log('Loading development environment configuration');

export const environment = {
  production: false,
  weatherApiKey: '9750ecaf085f4509b43120813250805',
  weatherApiBaseUrl: 'https://api.weatherapi.com/v1',
  firebase: {
    apiKey: "AIzaSyD91QaqZK0vGKiVKFZR-D4n3sOgiaMaViw",
    authDomain: "weather-app-318f1.firebaseapp.com",
    projectId: "weather-app-318f1",
    storageBucket: "weather-app-318f1.appspot.com",
    messagingSenderId: "908548201096",
    appId: "1:908548201096:web:8b41f7bb69b06987c69d3d",
    measurementId: "G-7MJEXSV6DZ"
  }
};

console.log('Environment loaded:', {
  ...environment,
  firebase: {
    ...environment.firebase,
    apiKey: environment.firebase.apiKey ? '***' : 'missing'
  }
}); 