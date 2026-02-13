import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '../../user';

export const UserIdGet = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): number => {
    const request: IUserRequest = ctx.switchToHttp().getRequest();

    return request.user.id;
  },
);

export interface IUserRequest extends Request {
  user: User;
}
