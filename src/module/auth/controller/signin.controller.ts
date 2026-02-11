import { Body, Controller, Get } from '@nestjs/common';
import { AUTH_SIGNIN_ROUTE_PREFIX } from '../../common';
import { AuthService } from '../service';
import { SigninDto, SigninDtoResponse } from '../dto';

@Controller(AUTH_SIGNIN_ROUTE_PREFIX)
export class SigninController {
  constructor(private service: AuthService) {}

  @Get()
  async signin(@Body() params: SigninDto): Promise<SigninDtoResponse> {
    return this.service.signin(params);
  }
}
