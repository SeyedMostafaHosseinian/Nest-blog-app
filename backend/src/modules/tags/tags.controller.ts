import { ResourcesEnum } from 'src/types/role/resources.enum';
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
import { AuthGuard } from 'src/guards/auth.guard';
import { ACGuard, UseRoles } from 'nest-access-control';

@UseGuards(ACGuard)
@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Post()
  @UseGuards(AuthGuard)
  @UseRoles({
    action: 'create',
    resource: ResourcesEnum.CreateNewTag,
    possession: 'any',
  })
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
  @UseGuards(AuthGuard)
  @UseRoles({
    action: 'update',
    resource: ResourcesEnum.UpdateTag,
    possession: 'any',
  })
  update(@Param('id') id: string, @Body() updateTagDto: UpdateTagDto) {
    return this.tagsService.update(+id, updateTagDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @UseRoles({
    action: 'delete',
    resource: ResourcesEnum.DeleteTag,
    possession: 'any',
  })
  remove(@Param('id') id: string) {
    return this.tagsService.remove(+id);
  }
}
