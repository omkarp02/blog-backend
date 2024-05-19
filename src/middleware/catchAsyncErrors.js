const catchAsyncErrors = (theFun) => (req, res, next) => {
  Promise.resolve(theFun(req, res, next)).catch(next);
};

export { catchAsyncErrors };
