import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuthDocument } from '../../infra/database/models/auth.model';
import { CreateAuthCommand } from './create-auth.command';

@CommandHandler(CreateAuthCommand)
export class CreateAuthCommandHandler
  implements ICommandHandler<CreateAuthCommand>
{
  constructor(
    @InjectModel(AuthDocument.name) private authModel: Model<AuthDocument>,
  ) {}

  async execute(command: CreateAuthCommand): Promise<AuthDocument> {
    const { userId, password } = command;
    return await this.authModel.create({
      user: userId,
      providerId: userId,
      password,
    });
  }
}
