import { NextFunction, Request, Response } from 'express';


type CatchAsyncFunction<TReq extends Request = Request> = (
  req: TReq, 
  res: Response, 
  next: NextFunction
) => Promise<Response | void>;

export const catchAsync = <TReq extends Request = Request>(
  fn: CatchAsyncFunction<TReq>
) => {
  return (req: TReq, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};