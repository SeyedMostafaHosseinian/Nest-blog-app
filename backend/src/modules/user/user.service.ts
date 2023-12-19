import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { UserResponseInerface } from './types/user-response.interface';
import { UserLoginDto } from './dto/login-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { sign } from 'jsonwebtoken';
import { compare } from 'bcrypt';
import { ChangeUserRoleDto } from './dto/change-user-role.dto';
import { RolesEnum } from '../article/types/roles.enum';
import { ChangeRoleActionsEnum } from './types/action-change-role.enum';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async createUser(
    createUserDto: CreateUserDto,
  ): Promise<UserResponseInerface> {
    //check username and email
    const existUserByEmail = await this.userRepository.findOneBy({
      email: createUserDto.email,
    });
    const existUserByUsername = await this.userRepository.findOneBy({
      username: createUserDto.username,
    });

    if (existUserByEmail || existUserByUsername) {
      throw new UnprocessableEntityException('username or email already taken');
    }
    //create user object
    const newUser = new UserEntity();
    Object.assign(newUser, createUserDto);

    //save user into database
    const savedUser = await this.userRepository.save(newUser);

    //create response object and return it
    return this.createUserResponse(savedUser);
  }

  async login(userLoginDto: UserLoginDto): Promise<UserResponseInerface> {
    /** find user */
    const user = await this.userRepository.findOneBy({
      email: userLoginDto.email,
    });

    /** throw exception if user not exist */
    if (!user)
      throw new NotFoundException('user with this email not not exist!');

    /** check user password */
    const passwordValidation = await compare(
      userLoginDto.password,
      user.password,
    );

    /** throw exception if user password is not match */
    if (!passwordValidation)
      throw new UnauthorizedException('password is wrong!');

    return this.createUserResponse(user);
  }

  async findAll(): Promise<UserEntity[]> {
    return await this.userRepository.find(
    // {
    //   relations: {
    //     articles: true,
    //     contributedArticles: true
    //   },
    // }
    );
  }

  async findUserById(id: string): Promise<UserEntity> {
    return await this.userRepository.findOneBy({ id });
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserResponseInerface> {
    const user = await this.findUserById(id);
    Object.assign(user, updateUserDto);

    const updatedUser = await this.userRepository.save(user);
    return this.createUserResponse(updatedUser);
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async changeUserRole(
    targetUserId: string,
    changeUserRoleDto: ChangeUserRoleDto,
  ) {
    const targetUser = await this.userRepository.findOneBy({
      id: targetUserId,
    });

    const { action, targetRole } = changeUserRoleDto;

    if (!targetUser) {
      throw new NotFoundException('User not exist!');
    }

    if (targetRole === RolesEnum.Admin)
      throw new ForbiddenException(
        'you cannot promote or demote a user to or from admin role!',
      );

    if (targetRole === RolesEnum.Basic)
      throw new ForbiddenException(
        "'basic' role is a default roles and shoulden't remove or add from user roles!",
      );

    const isUserHaveTatgetRole = targetUser.roles.find((r) => targetRole === r);

    switch (action) {
      case ChangeRoleActionsEnum.PROMOTION: {
        if (isUserHaveTatgetRole)
          throw new ConflictException('this user already have target role!');

        targetUser.roles.push(targetRole);
        break;
      }
      case ChangeRoleActionsEnum.DEMOTION: {
        if (!isUserHaveTatgetRole)
          throw new ConflictException(
            'this user is not have this target role!',
          );

        const targetRoleIndex = targetUser.roles.findIndex(targetRole as any);
        targetUser.roles.splice(targetRoleIndex, 1);

        break;
      }
    }
    return await this.userRepository.save(targetUser);

  }

  generateJwt(user: UserEntity): string {
    return sign(
      //payload
      {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      //secret-key
      process.env?.JWT_ACCESS_TOKEN_SECRET_KEY,
      //options
      {
        expiresIn: process.env?.JWT_EXPIRY_TIME || '3d',
      },
    );
  }

  createUserResponse(user: UserEntity): UserResponseInerface {
    const token = this.generateJwt(user);
    delete user.password;
    return {
      user: {
        ...user,
        token,
      },
    };
  }
}
