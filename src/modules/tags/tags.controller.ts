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
import { TagsService } from './tags.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { RolesEnum } from '../article/types/roles.enum';
import { Role } from 'src/decorators/role.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { AuthorizationGuard } from 'src/guards/authorization.guard';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Post()
  @UseGuards(AuthGuard, AuthorizationGuard)
  @Role(RolesEnum.Author)
  create(@Body() createTagDto: CreateTagDto) {
    return this.tagsService.create(createTagDto);
  }

  @Get()
  async findAll(): Promise<{ tags: string[] }> {
    const tags = await this.tagsService.findAll();
    return {
      tags: tags.map((tag) => tag.name),
    };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tagsService.findOne(+id);
  }

  @Patch(':id')
  @Role(RolesEnum.Author)
  @UseGuards(AuthGuard, AuthorizationGuard)
  update(@Param('id') id: string, @Body() updateTagDto: UpdateTagDto) {
    return this.tagsService.update(+id, updateTagDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, AuthorizationGuard)
  @Role(RolesEnum.Author)
  remove(@Param('id') id: string) {
    return this.tagsService.remove(+id);
  }
}
