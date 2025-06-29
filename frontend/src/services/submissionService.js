import api from './api';

export const getSubmissions = async (questionId) => {
  const response = await api.get(`/submissions/${questionId}`);
  return response.data;
};

export const getSubmissionById = async (submissionId) => {
  const response = await api.get(`/submissions/submission/${submissionId}`);
  return response.data;
};