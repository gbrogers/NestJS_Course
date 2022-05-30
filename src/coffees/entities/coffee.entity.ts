import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { FlavorEntity } from './flavor.entity';

@Entity('coffee') // sql table === 'coffeeEntity'
export class CoffeeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  brand: string;

  @Column({ default: 0 })
  recommendations: number;

  @JoinTable() //this join table decorator shows the "owner" side of the table.
  @ManyToMany((type) => FlavorEntity, (flavor) => flavor.coffees, {
    cascade: true,
  })
  flavors: FlavorEntity[];
}
