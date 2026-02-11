import { Body, Controller, Post } from '@nestjs/common';
import { AUTH_SIGNUP_ROUTE_PREFIX } from '../../common';
import { SignupDto, SignupDtoResponse } from '../dto';
import { AuthService } from '../service';

@Controller(AUTH_SIGNUP_ROUTE_PREFIX)
export class SignupController {
  constructor(private service: AuthService) {}

  @Post()
  async signup(@Body() params: SignupDto): Promise<SignupDtoResponse> {
    return this.service.signup(params);
  }
}
