import { AuthService } from '@/modules/auth/application/services/auth.service';
import { Public } from '@/modules/auth/infra/decorators/public.decorator';
import { LoginDto, RegisterDto } from '@/modules/auth/presentation/dto';
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Autenticação')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Registrar novo usuário' })
  @ApiResponse({ status: 201, description: 'Usuário registrado com sucesso' })
  @ApiResponse({ status: 409, description: 'Email já cadastrado' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  async register(@Body() dto: RegisterDto) {
    const result = await this.authService.register(
      dto.name,
      dto.email,
      dto.password,
    );

    return {
      message: 'Usuário registrado com sucesso',
      ...result,
    };
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Realizar login' })
  @ApiResponse({ status: 200, description: 'Login realizado com sucesso' })
  @ApiResponse({ status: 401, description: 'Credenciais inválidas' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  async login(@Body() dto: LoginDto) {
    const result = await this.authService.signIn(dto.email, dto.password);

    return {
      message: 'Login realizado com sucesso',
      ...result,
    };
  }
}
