import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Connection } from '../infra/database/connection';
import { FileDocument } from '../infra/database/models/file.model';
import { TodoDocument } from '../infra/database/models/todo.model';
import { UserDocument } from '../infra/database/models/user.model';
import { CreateTodoDto } from './dto/create-todo.dto';
import { QueryTodoDto } from './dto/query-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { TodoNotFoundException } from './exceptions/todo-not-found.exception';

@Injectable()
export class TodosService {
  constructor(
    @InjectModel(TodoDocument.name) private todoModel: Model<TodoDocument>,
    @InjectModel(UserDocument.name) private userModel: Model<UserDocument>,
    @InjectModel(FileDocument.name) private fileModel: Model<FileDocument>,
    @InjectConnection() private connection: Connection,
  ) {}

  findAll(query: QueryTodoDto): Promise<TodoDocument[]> {
    return this.todoModel
      .find(query)
      .populate({ path: 'creator', select: 'name', model: this.userModel })
      .populate({ path: 'attachments', select: 'key', model: this.fileModel })
      .exec();
  }

  async findOne(id: string): Promise<TodoDocument> {
    const exTodo: TodoDocument = await this.todoModel.findById(id);
    if (!exTodo) {
      throw new TodoNotFoundException();
    }
    return exTodo;
  }

  async create(dto: CreateTodoDto): Promise<TodoDocument> {
    const session = await this.connection.startSession();

    session.startTransaction();

    try {
      // const todoDocument = new this.todoModel(dto);
      // await todoDocument.save();
      const todoDocument = (await this.todoModel.create([dto], { session }))[0];

      // if (dto.attachments.length === 0) {
      //   throw new BadRequestException();
      // }

      const files = await Promise.all(
        (dto.attachments || []).map((id) =>
          this.fileModel.findById(id as string).session(session),
        ),
      );
      await Promise.all(
        files.map((file) => {
          file.ref = todoDocument._id;
          file.refType = 'Todo';
          return file.save();
        }),
      );

      await session.commitTransaction();
      return todoDocument;
    } catch (e) {
      await session.abortTransaction();
      throw e;
    } finally {
      await session.endSession();
    }
  }

  async update(id: string, dto: UpdateTodoDto): Promise<TodoDocument> {
    const todo: TodoDocument = await this.todoModel.findById(id).exec();

    if (!todo) {
      throw new NotFoundException(`Not Found Todo ${id}`);
    }

    const diff = (arr1, arr2) => arr1.filter((v) => !arr2.includes(v));
    const inDB = (await this.fileModel.find({ ref: id })).map((file) =>
      String(file._id),
    );
    const additions = diff(dto.attachments || [], inDB);
    const deletions = diff(inDB, dto.attachments || []);

    await Promise.all([
      this.fileModel.updateMany(
        { _id: { $in: additions } },
        { $set: { ref: id, refType: 'Todo' } },
      ),
      this.fileModel.updateMany(
        { _id: { $in: deletions } },
        { $set: { ref: null, refType: null } },
      ),
      todo.updateOne({ $set: dto }).exec(),
    ]);

    return this.todoModel.findById(id);
  }

  async deleteOne(id: string): Promise<TodoDocument> {
    const todo: TodoDocument = await this.todoModel.findById(id);
    if (!todo) {
      throw new NotFoundException(`Not Found Todo ${id}`);
    }

    await todo.deleteOne();
    return todo;
  }
}
