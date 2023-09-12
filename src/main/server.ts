import 'module-alias/register'
import setupApp from '@main/config/app'
import env from '@main/config/env'
import mongoose from "mongoose";
import ApiError from '@presentation/error-handling/api-error';
import * as  Message from '@presentation/error-handling/message-error'


const app = setupApp();

async function connectToDatabase() {
  const dbURL = env.mongoUrl
  const dbOptions = env.dbOptions

  try {

    if(dbURL === undefined || dbOptions === undefined) {
        throw ApiError.mongoError()
      }

    await mongoose.connect(dbURL, dbOptions);

    app.listen(env.port, () => {
        console.log(`${Message.SERVER_RUNNING} ${env.port}`);
      });

  } catch (error) {

    if(error instanceof ApiError){
        console.log(error.message )
    }

   const intererror =  ApiError.internalError()
   console.log(intererror)
  }
}

connectToDatabase();