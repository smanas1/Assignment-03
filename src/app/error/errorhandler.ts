export const errorHandler = (message: string, success: boolean, error: any) => {
  return {
    message: message,
    success: success,
    error: error,
  };
};
