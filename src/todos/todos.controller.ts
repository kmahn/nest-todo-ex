import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { Auth } from '../decorators/auth.decorator';
import { User } from '../decorators/user.decorator';
import { TodoDocument } from '../infra/database/models/todo.model';
import { UserProfile } from '../types/user';
import { CreateTodoDto } from './dto/create-todo.dto';
import { QueryTodoDto } from './dto/query-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { MyTodoGuard } from './guards/my-todo.guard';
import { TodosService } from './todos.service';

@ApiBearerAuth()
@ApiTags('Todo')
@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Get()
  // @Roles('admin')
  findAll(@Query() query: QueryTodoDto): Promise<TodoDocument[]> {
    return this.todosService.findAll(query);
  }

  @Get('me')
  @Auth()
  findMyAll(
    @User() user: UserProfile,
    @Query() query: QueryTodoDto,
    @Req() req: any,
  ): Promise<TodoDocument[]> {
    console.log(req.aaa);
    query.user = user._id;
    return this.todosService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<TodoDocument> {
    return this.todosService.findOne(id);
  }

  @Post()
  @Auth()
  create(
    @User() user: UserProfile,
    @Body() dto: CreateTodoDto,
  ): Promise<TodoDocument> {
    dto.creator = user._id;
    return this.todosService.create(dto);
  }

  @Put(':id')
  @UseGuards(MyTodoGuard)
  @Auth()
  update(
    @Param('id') id: string,
    @Body() dto: UpdateTodoDto,
  ): Promise<TodoDocument> {
    return this.todosService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(MyTodoGuard)
  @Auth()
  deleteOne(@Param('id') id: string): Promise<TodoDocument> {
    return this.todosService.deleteOne(id);
  }
}
