import api from './api';

export const getLeaderboard = async (contestId) => {
  const response = await api.get(`/leaderboards/${contestId}`);

  return response.data;
};
