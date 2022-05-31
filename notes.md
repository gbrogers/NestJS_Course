are we using api models instead of dtos?

The ValidationPipe provides a convenient way of enforcing validation rules for all incoming client payloads. You can specify these rules by using simple annotations in your DTO!

PartialType from nestjs/mapped-types: takes in a class and makes a new class with all the same properties, but all the properties as optional. Inherits all the validator rules as decorators, and add new IsOptional decorator to each.

app.useGlobalPipes(new ValidationPipe({ whitelist: true })); Avoid user passing in invalid properties to creat post request - invalid properties stripped out. Whitelist feature.

/_ Enabling "whitelist" feature of ValidationPipe _/
app.useGlobalPipes(new ValidationPipe({
whitelist: true, // 👈
}));

/_ Throw errors when whitelisted properties are found _/
app.useGlobalPipes(new ValidationPipe({
forbidNonWhitelisted: true, // 👈
whitelist: true,
}));

// Enabling auto transform feature of ValidationPipe
app.useGlobalPipes(
new ValidationPipe({
transform: true, // 👈
}),
);
^^ This will try to transform primitive types (ie. string to number). Allows you to have a number as a parameter type.

By default every path parameter and query parameter come over the network as a string

---

Providers(aka services) are used to:

1. inject dependencies
2. Handle business logic. Vs doing it in the controller
3. responsible for data storage and retrieval

Modules are recommended best practice for:

1. organize application components
2. encapsulate a closely related set of capabilities
3. determine what is privately and publically available outside of itself

DTOs (Data Transfer Objects):

1. Interfaces for Inputs and Outputs within our system
2. An object used to encapsulate data and send it from one application to another

With NestJS CLI, use --dry-run flag at the end of command to see output that will happen without actually creating anything

---

YAML: YAML Ain't Markup Language™

What It Is:
YAML is a human-friendly data serialization
language for all programming languages.

---

docker-compose.yml:

- most important is that we have a service with db which is using a image: postgres
- docker image is a multilayer file that will execute code within a docker container (in this case it will be creating a postgreSQL db)
- ports '5342:5432' - this is saying that internally within the container it should have the db use port 5432 but also accessible at this port outside of docker

// Start containers in detached / background mode
docker-compose up -d

// Stop containers
docker-compose down

---

TypeORM acts as an abstraction over our data source and exposes a variety of useful methods to interact with records in DB

---

The use of forFeature() in coffees.module registers typeORM in this child module. We use forFeature to register entities.

forRoot() in the app.module (only used once)

---

giselle.rogers@Giselles-MacBook-Pro NestJS_Course % nest g class coffees/entities/flavor.entity --no-spec

---

relational columns are not eagerly loaded by default. Need to load relation into entity ==> { relations: ['flavors'] }

---

Scenario -- need to add coffee with brand new flavors that are not in flavors db --- how to do this?

Answer: Cascading inserts.

Add {cascade: true} to relation

---

In pagination-query we use the type decorator to make sure numbers are passed in. Remember --- queryParams are sent through as strings by default.

An alternative is to add an implicit type conversion on a global level by adding the transformOptions{} with enableO,plicitCoverison set to true.

---

Transactions: a db transactions symbolizes a unit of work performed within a db management system -- Transactions are a reliable way to accomplish multiple tasks independent of each other transactions. --Recomment QueryRunner

---

Indexes are special lookup tables that our db search engine can user to speed up data retrieval. This is user when something is super commonly looked up -- ie. Looking up coffee by name -- add inddex to name column.

- can be used on column --> Index() or abocer entity decorator and passing in any columns.

---

Database Migrations:

- way to incrementally update out db schema and keep it in sync with that application data model, all while preserving existing data in our db.
- migrations lifecycle are maintained by the typeORM CLI -- stored serperately.
- typeORM migrations need to work on compiled files, which nest will output in the dist folder
- the down is incredibly important to have a way to save us if something goes wrong.

npm run build
npx typeorm migration:run
npx typeorm migration:revert

---

Dependency Injection"

1. in our CoffeeService, the @Injectable() decorator declared a class that can be managed by the Nest "container". Marks the coffeeService as a provider.
2. In CoffeesController -- we are requesting the CoffeesService in the constructor. This tellsNest to "inject" the provider into our controller class so that we may be able to utilize it.
3. Nest is aware that -this- class is also a "Provider" because we've included in our coffeesModule, which registers this provider with the Nest Inversion of Control (IoC) container.

When the Nest container instantiates the CoffeesController, it first looks to see if there are any dependencies needed. In our case, there is one, the "CoffeesService". When the Nest container finds the CoffeeService dependency, it performs a lookup on the CoffeeService token which returns the CoffeeService class. Assuming this Provider has a "singleton" scope, which is the default behavior of injectable providers, Nest will then either _create an instance_ of CoffeeService, cache it and return it or if one is already cached, it will return _that_ existing instance.

---

Value based Providers:
useValue syntax is useful for injecting a constant value.
Say you wanted ti add an external library into the Nest container, or maybe we are replacing a real implementation of a Service with a Mock object.
providers: [{ provide: CoffeesService, useValue: new MockCoffeesService() }],

---

useClass allows us to dynamically dertermine a Class that a token should resolve to.

- like when we need production vs dev
  // "useClass" syntax example
  {
  provide: ConfigService,
  useClass:
  process.env.NODE_ENV === 'development'
  ? DevelopmentConfigService
  : ProductionConfigService,
  },

  ***

  useFactory: allows us to create providers "dynamically" which can extremely useful if you need to base the provider's value on various other dependencies, values, etc.

  - The value returned from the factory function is what will be user by the provider token. What makes these factory functions so specifal, is that they themselces can inject OTHER providers need to compute the returning value.

  In module"
  @injectable()
  export class CoffeeBrandsFactory {
  create() {
  return ['buddy brew', 'nescafe']
  }
  }

  blah....
  providers: [
  CoffeesService,
  CoffeeBrandsFactory,
  { provide: COFFEE_BRANDS,
  useFactory: (brandsFactory: CoffeeBrandsFactory)=> brandsFactory.create(),
  inject: [CoffeeBrandsFactory]
  }]

  ***

  prevent race conditions by leveraging Async Providers using useFactory.

  {
  provide: 'COFFEE_BRANDS',
  // Note "async" here, and Promise/Async event inside the Factory function
  // Could be a database connection / API call / etc
  // In our case we're just "mocking" this type of event with a Promise
  useFactory: async (connection: Connection): Promise<string[]> => {
  // const coffeeBrands = await connection.query('SELECT \* ...');
  const coffeeBrands = await Promise.resolve(['buddy brew', 'nescafe'])
  return coffeeBrands;
  },

---

Static Modules (the ones we've been using) can't have their providers be configured by a module that is module that is consuming it.

---

Every Nest provider is a singleton.
Example: when we use @Injectable() in our CoffeeService, it is really shorthand implementation for passing it on object with scopt and Scope.DEFAULT.

Once our application has bootstrapped, all the Singleton providers have been instantiated.

// Scope DEFAULT - This is assumed when NO Scope is entered like so: @Injectable() \*/
@Injectable({ scope: Scope.DEFAULT })
export class CoffeesService {}

// -------------

/\*\*

- Scope TRANSIENT

- Transient providers are NOT shared across consumers.
- Each consumer that injects a transient provider
- will receive a new, dedicated instance of that provider.
- if we console.log, we see instantiated twice (bc use twice.)
  \*/
  @Injectable({ scope: Scope.TRANSIENT })
  export class CoffeesService {}

// Scope TRANSIENT with a Custom Provider
{
provide: 'COFFEE_BRANDS',
useFactory: () => ['buddy brew', 'nescafe'],
scope: Scope.TRANSIENT // 👈
}

// -------------

/\*\*

- Scope REQUEST

- Request scope provides a new instance of the provider
- exclusively for each incoming request.
- won't console.log that instantiated until request (unlike transiate and singleton)
  \*/
  @Injectable({ scope: Scope.REQUEST })
  export class CoffeesService {}
  ***
  What parameter decorator is needed to inject a custom provider into a class? Inject()

The "useValue" syntax (custom providers) is useful when..

1. want to bind an external library into the nest container
2. want to register and inject a constant value
3. want to replace a real implementation with a serivice with a mock object

Custom providers are useful when..

1. creating custom instances of our provider instead of having nest instatiate the class for us
2. want to use a strategy pattern in which we can provide an abstract class and interchange the real implementation
3. we need to delay the bootstrap process until one or more async tasks gave completed.

What decorator is required to declare a class that can be managed by the Nest container? Injectable()

The "useClass" syntax (custom providers) is useful when we want to... Dynamically determine a class that a token should resolve to

The "useFactory" syntax (custom providers) is useful when we want to...create providers dynamically based on other providers OR delay the entire bootstrap process until 1+ async tasks have completed.

What Provider's scopes does Nest support? Singleton, Transient, Request.

---

All env variables are string by default
the configservice will not perform any type casting or parsing here.

---

TypeOrmModule.forRootAsync makes sure this is loaded after all other modules --> so won't accidently come back undefined.

---

In NestJS, we have 4 additional building blocks (for features), that we haven’t showcased yet - these are:

Exception filters: handling and processing unhandles exceptions that might happen in app. Let us control exact flow and content of responses.
Pipes: used to handle two things - transformations (transform input data) & validation
Guards: determine whether a given response meets certain conditions, like authentication, authorization, roles, ACLs, etc.
& Interceptors: 1. bind extra logic, before or after method execution. 2. transform the reesult returned from a method. 3. extend basic method behavior. 4. completely override a method, depending on specific conditions (ie caching.)

Interceptors make it possible for us to:
bind extra logic before or after method execution
transform the result returned from a method
transform the exception thrown from a method
extend basic method behavior
or even completely overriding a method - depending on a specific condition (for example: doing something like caching various responses)

- analytics could be added when manipulating!

Another technique useful for Interceptors is to extend the basic function behavior by applying RxJS operators to the response stream.

To help us learn about this concept by example - let’s imagine that we need to handle timeouts for all of our route requests.

When an endpoint does not return anything after a certain period of time, we need to terminate the request, and send back an error message.

---

Pipes have two typical use cases:
Transformation: where we transform input data to the desired output
& validation: where we evaluate input data and if valid, simply pass it through unchanged. If the data is NOT valid - we want to throw an exception.
In both cases, pipes operate on the arguments being processed by a controller’s route handler.

NestJS triggers a pipe just before a method is invoked.

Pipes also receive the arguments meant to be passed on to the method. Any transformation or validation operation takes place at this time - afterwards the route handler is invoked with any (potentially) transformed arguments.

---

Middleware functions have access to the request and response objects, and are not specifically tied to any method, but rather to a specified route PATH.

Middleware functions can perform the following tasks:

executing code
making changes to the request and the response objects.
ending the request-response cycle.
Or even calling the next middleware function in the call stack.
When working with middleware, if the current middleware function does not END the request-response cycle, it must call the next() method, which passes control to the next middleware function.

Otherwise, the request will be left hanging - and never complete.
