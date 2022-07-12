import { CommandBus, EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateAuthCommand } from '../../auth/commands/create-auth.command';
import { UserDocument } from '../../infra/database/models/user.model';
import { CreateUserEvent } from './create-user.event';

@EventsHandler(CreateUserEvent)
export class CreateUserEventHandler implements IEventHandler<CreateUserEvent> {
  constructor(
    @InjectModel(UserDocument.name) private userModel: Model<UserDocument>,
    private commandBus: CommandBus,
  ) {}

  async handle(event: CreateUserEvent): Promise<void> {
    const { userId, password } = event;
    console.log('CreateUserEventHandler:::', userId, password);
    const authDocument = await this.commandBus.execute(
      new CreateAuthCommand(userId, password),
    );
    await this.userModel.findByIdAndUpdate(userId, {
      $set: { auth: authDocument._id },
    });
  }
}
