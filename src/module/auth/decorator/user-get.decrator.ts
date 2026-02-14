import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '../../user';

/**
 * Custom parameter decorator to extract authenticated user ID from JWT token
 * Use this decorator in controller methods to get the ID of the currently logged-in user
 * Requires JwtAuthGuard to be applied to the route
 * @example
 * @Get('/profile')
 * async getProfile(@UserIdGet() userId: number) {
 *   return this.userService.userGetById(userId);
 * }
 */
export const UserIdGet = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): number => {
    const request: IUserRequest = ctx.switchToHttp().getRequest();

    return request.user.id;
  },
);

/**
 * Extended request interface that includes authenticated user object
 * This interface is used by the UserIdGet decorator to access user data
 */
export interface IUserRequest extends Request {
  user: User;
}
