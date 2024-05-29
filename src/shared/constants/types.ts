import { Request } from 'express';

export interface IGetUserAuthInfoRequest extends Request {
  user: string;
}

export interface SendEmailDto {
  data: {};
  email: string;
  subject: string;
  template: string;
}
