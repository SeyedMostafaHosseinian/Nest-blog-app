import { ConflictException, Injectable, NotAcceptableException, UnprocessableEntityException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { sign, decode } from 'jsonwebtoken';
import { UserResponseInerface } from './types/user-response.interface';

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
    const existUserByEmail = await this.userRepository.findOneBy({email: createUserDto.email});
    const existUserByUsername = await this.userRepository.findOneBy({username: createUserDto.username});

    if(existUserByEmail || existUserByUsername) {
      throw new UnprocessableEntityException('username or email already taken')
    }    
    //create user object
    const newUser = new UserEntity();
    Object.assign(newUser, createUserDto);

    //save user into database 
    const savedUser = await this.userRepository.save(newUser);

    //create response object and return it
    return this.createUserResponse(savedUser);
  }

  async findAll(): Promise<UserEntity[]> {
    return await this.userRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
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
    return {
      user: {
        ...user,
        token,
      },
    };
  }
}
