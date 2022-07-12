import { Connection as MongooseConnection, Model } from 'mongoose';
import { Models, ModelType } from './models';

export class Connection extends MongooseConnection {
  readonly models: Readonly<{ [key in ModelType]: Model<Models[key]> }>;
}
