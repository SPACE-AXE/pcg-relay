export const ApiUrl =
  process.env.NODE_ENV === 'production'
    ? 'https://api.parkchargego.link/api'
    : 'http://localhost:3000/api';
