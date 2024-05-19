export const sendResponse = (req, res, httpStatus, data) => {
  const formattedData = {
    success: true,
    date: new Date(),
    data,
  };
  res.status(httpStatus).json(formattedData);
};
