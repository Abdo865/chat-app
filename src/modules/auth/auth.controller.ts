import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { ApiBadRequestResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { SerializedUser } from './serialized-types/serialized-user';
import { LoginDto } from './dto/login.dto';
import { Public } from './param-decorators/public.decorator';
import {
  sendRefreshToken as addTokenToCookie,
  sendSuccessResponse,
} from 'src/utils/success-response-genarator';
import { swaggerSuccessResponseExample } from 'src/utils/swagger-example-generator';
import { UserExample } from './swagger-examples/user.example';
import { LoginExample } from './swagger-examples/login.example';

@Controller('auth')
@ApiTags('Auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @Public()
  @ApiOkResponse({
    description: 'Signup completed Successfully',
    schema: swaggerSuccessResponseExample(UserExample),
  })
  @ApiBadRequestResponse({
    description: 'Bad request',
  })
  async signup(@Res({ passthrough: true }) res, @Body() signupDto: SignupDto) {
    const { user, access_token, refresh_token } =
      await this.authService.signup(signupDto);
    addTokenToCookie(res, refresh_token, 'refresh_token');
    return sendSuccessResponse({
      user: new SerializedUser(user),
      access_token,
      refresh_token,
    });
  }

  @Post('login')
  @Public()
  @ApiOkResponse({
    description: 'Signup completed Successfully',
    schema: swaggerSuccessResponseExample(LoginExample),
  })
  @ApiBadRequestResponse({
    description: 'Bad request',
  })
  async login(@Res({ passthrough: true }) res, @Body() loginDto: LoginDto) {
    const { access_token, refresh_token } =
      await this.authService.loginLocal(loginDto);
    addTokenToCookie(res, refresh_token, 'refresh_token');
    return sendSuccessResponse({
      AccessToken: access_token,
      RefreshToken: refresh_token,
    });
  }
}
