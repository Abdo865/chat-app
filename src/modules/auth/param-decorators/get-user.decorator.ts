import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { user } from '@prisma/client';

export const GetCurrentUser = createParamDecorator(
  (data: keyof user | undefined, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    console.log(request.user);

    if (!data) return request.user;
    return request.user[data];
  },
);

export const GetFromCookie = createParamDecorator(
  (data: string, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    const cookie = request.cookies[data];
    return cookie ? cookie : null;
  },
);
