import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 12);
    const user = await this.usersService.create({
      name: dto.name,
      email: dto.email,
      password: hashedPassword,
    });

    const tokens = await this.generateTokens(user.id, user.email, user.role);
    await this.usersService.updateRefreshToken(
      user.id,
      await bcrypt.hash(tokens.refreshToken, 10),
    );

    return {
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      ...tokens,
    };
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmailWithPassword(dto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordMatches = await bcrypt.compare(dto.password, user.password);
    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.generateTokens(user.id, user.email, user.role);
    await this.usersService.updateRefreshToken(
      user.id,
      await bcrypt.hash(tokens.refreshToken, 10),
    );

    return {
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      ...tokens,
    };
  }

  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.usersService.findByIdWithRefreshToken(userId);
    if (!user || !user.refreshToken) {
      throw new UnauthorizedException('Access denied');
    }

    const tokenMatches = await bcrypt.compare(refreshToken, user.refreshToken);
    if (!tokenMatches) {
      throw new UnauthorizedException('Access denied');
    }

    const tokens = await this.generateTokens(user.id, user.email, user.role);
    await this.usersService.updateRefreshToken(
      user.id,
      await bcrypt.hash(tokens.refreshToken, 10),
    );

    return tokens;
  }

  async logout(userId: string) {
    await this.usersService.updateRefreshToken(userId, null);
  }

  private async generateTokens(userId: string, email: string, role: string) {
    const payload = { sub: userId, email, role };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN', '7d') as any,
      }),
    ]);

    return { accessToken, refreshToken };
  }
}
