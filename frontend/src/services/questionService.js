import api from './api';

export const addQuestion = async (questionData) => {
  const response = await api.post('/questions', questionData);
  return response.data;
};

export const getAllQuestions = async () => {
  const response = await api.get('/questions');
  return response.data;
};

export const getFullQuestionById = async (id) => {
  const response = await api.get(`/questions/${id}`);
  return response.data;
};

export const updateQuestion = async (questionId, questionData) => {
  const response = await api.put(`/questions/${questionId}`, questionData);
  return response.data;
};


// export const deleteQuestion = async (id) => {
//   const response = await api.delete(`/questions/${id}`);
//   return response.data;
// };
