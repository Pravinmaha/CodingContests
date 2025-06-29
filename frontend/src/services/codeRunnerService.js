import api from './api';

export const runCode = async (questionId, language, code, testCases) => {
  const response = await api.post('/submissions/run', { questionId, language, code, testCases });

  return response.data;
};

export const submitCode = async (questionId, language, code, contestId) => {
  const response = await api.post('/submissions/submit', { questionId, language, code, contestId });

  return response.data;
};
