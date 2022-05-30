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
