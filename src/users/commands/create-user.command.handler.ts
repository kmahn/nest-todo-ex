import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument } from '../../infra/database/models/user.model';
import { CreateUserEvent } from '../events/create-user.event';
import { CreateUserCommand } from './create-user.command';
import { EmailAlreadyInUseException } from '../exceptions/email-already-in-use.exception';

@CommandHandler(CreateUserCommand)
export class CreateUserCommandHandler
  implements ICommandHandler<CreateUserCommand>
{
  constructor(
    @InjectModel(UserDocument.name) private userModel: Model<UserDocument>,
    private eventBus: EventBus,
  ) {}

  async execute(command: CreateUserCommand): Promise<void> {
    const { email, name, phone, password } = command;
    const exUser = await this.userModel.findOne({ email });
    if (!!exUser) {
      throw new EmailAlreadyInUseException();
    }
    const userDocument = await this.userModel.create({ email, name, phone });
    this.eventBus.publish(
      new CreateUserEvent(String(userDocument._id), password),
    );
  }
}
