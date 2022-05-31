import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { EventEntity } from 'src/events/entities/event.entity'
import { COFFEE_BRANDS } from './coffees.constants'
import { CoffeesController } from './coffees.controller'
import { CoffeesService } from './coffees.service'
import coffeesConfig from './config/coffees.config'
import { CoffeeEntity } from './entities/coffee.entity'
import { FlavorEntity } from './entities/flavor.entity'

@Module({
  controllers: [CoffeesController],
  imports: [
    ConfigModule.forFeature(coffeesConfig),
    TypeOrmModule.forFeature([CoffeeEntity, FlavorEntity, EventEntity]),
  ],
  providers: [
    CoffeesService,
    {
      provide: COFFEE_BRANDS, // 👈
      useValue: ['buddy brew', 'nescafe'], // array of coffee brands,
    },
  ],
  exports: [CoffeesService],
})
export class CoffeesModule {}
