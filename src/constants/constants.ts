export const ApiUrl =
  process.env.NODE_ENV === 'production'
    ? 'https://api.parkchargego.link/api'
    : 'http://localhost:3000/api';
export const ManageCodeHeader = 'manage-code';
export const ManageCodeEnv = 'MANAGE_CODE';
