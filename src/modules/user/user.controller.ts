import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseInerface } from './types/user-response.interface';
import { UserLoginDto } from './dto/login-user.dto';
import { UserEntity } from './entities/user.entity';
import { User } from 'src/decorators/user.decorator';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  singup(
    @Body('user') createUserDto: CreateUserDto,
  ): Promise<UserResponseInerface> {
    return this.userService.createUser(createUserDto);
  }

  @Post('login')
  login(
    @Body('user') userLoginDto: UserLoginDto,
  ): Promise<UserResponseInerface> {
    return this.userService.login(userLoginDto);
  }

  @Get()
  findAll(): Promise<UserEntity[]> {
    return this.userService.findAll();
  }

  @Get('user')
  @UseGuards(AuthGuard)
  findOne(@User() user: UserEntity): UserResponseInerface {
    return this.userService.createUserResponse(user);
  }

  @Patch('user')
  @UseGuards(AuthGuard)
  update(
    @User('id') userId: string,
    @Body('user') updateUserDto: UpdateUserDto,
  ): Promise<UserResponseInerface> {
    return this.userService.update(userId, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}