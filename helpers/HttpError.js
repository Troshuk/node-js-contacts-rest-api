import { getReasonPhrase } from "http-status-codes";

const HttpError = (status, message = getReasonPhrase(status)) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

export default HttpError;
