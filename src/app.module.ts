import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AppService } from './app.service'
import { CoffeesModule } from './coffees/coffees.module'
import { CoffeeRatingModule } from './coffee-rating/coffee-rating.module'
import { DatabaseModule } from './database/database.module'
import { ConfigModule } from '@nestjs/config'
import appConfig from './config/app.config'
import { CommonModule } from './common/common.module'

@Module({
  imports: [
    // ConfigModule.forRoot({
    //   // envFilePath: '.environment',
    //   // ignoreEnvFile: true,
    // }),
    ConfigModule.forRoot({
      load: [appConfig],
    }),
    CoffeesModule,
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres', // type of our database
        host: process.env.DATABASE_HOST,
        port: +process.env.DATABASE_PORT,
        username: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
        autoLoadEntities: true, // models will be loaded automatically
        synchronize: true, // your entities will be synced with the database(recommended: disable in prod)
      }),
    }),
    CoffeeRatingModule,
    DatabaseModule,
    CommonModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
