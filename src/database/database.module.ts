import { DynamicModule, Module } from '@nestjs/common';
import { ConnectionOptions, createConnection } from 'typeorm';

@Module({
  // Initial attempt at creating "CONNECTION" provider, and utilizing useValue for values */
  //   providers: [
  //     {
  //       provide: 'CONNECTION',
  //       useValue: createConnection({
  //         type: 'postgres',
  //         host: 'localhost',
  //         port: 5432,
  //       }),
  //     },
  //   ],
})
// // Creating static register() method on DatabaseModule
// export class DatabaseModule {
//   static register(options: ConnectionOptions): DynamicModule {}
// }

// Improved Dynamic Module way of creating CONNECTION provider
export class DatabaseModule {
  static register(options: ConnectionOptions): DynamicModule {
    return {
      module: DatabaseModule,
      providers: [
        {
          provide: 'CONNECTION', // 👈
          useValue: createConnection(options),
        },
      ],
    };
  }
}
