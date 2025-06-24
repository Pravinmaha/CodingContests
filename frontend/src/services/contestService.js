import api from './api';

export const createContest = async (contestData) => {
  const response = await api.post('/contests', contestData);
  return response.data;
};

export const addQuestionToContest = async (questionIds, contestId) => {
  const response = await api.post(`/contests/addquestions/${contestId}`, { questionIds });
  return response.data;
};

export const removeQuestionFromContest = async (questionId, contestId) => {
  const response = await api.post(`/contests/removequestion/${contestId}`, { questionId });
  return response.data;
};

export const editContest = async (contestData, contestId) => {
  const response = await api.post(`/contests/edit/${contestId}`, contestData);
  return response.data;
};

export const getMyContests = async () => {
  const response = await api.get('/contests/mycontests');
  return response.data;
}

export const getAllContests = async () => {
  const response = await api.get('/contests');
  return response.data;
};

export const getContest = async (contestId) => {
  const response = await api.get(`/contests/${contestId}`);
  return response.data;
}

export const getFullContest = async (contestId) => {
  const response = await api.get(`/contests/full/${contestId}`);
  return response.data;
}


export const registerForContest = async (contestId) => {
  const response = await api.post(`/contests/register/${contestId}`);
  return response.data;
};