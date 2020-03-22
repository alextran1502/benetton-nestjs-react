# NestJS Introduction

## Controller

* Handling request and returning response to the client
* Controller is bound to a specific path (for example, "/tasks" for the tasks resource)
* Contains handler which handle endpoints and request method (get, post... etc)
* Can take advantage of dependency injection to consume provider within the same module
* Controller is defined with the decorator `@Controller` 
* Controller accept a string, which is the path to be handled by the controller

## Provider

* Can be injected into constructor if decorated as `@Injectable` via dependency injection
* Can be a plain value, class, sync/async factory
* Provider **must** be provided to a module to be usable
* Provider can be exportd from a module - and then available to other module that import it

## Service

* Defined as *Provider* but not all *Providers* are *Services*
* It is **Singleton** when wrapped with `@Injectable` and provided to a module, that means the same instance will be shared across the application - acting as a single source of truth
* The main source of business logic. For example, a service will be called from  a controller to validate data, create an item in the database and return a response.

## NestJS Pipe

* Pipes operates on the arguments to be processed by the route handler, just before the handler is called.
* Pipes can perform data transformation or data validation.
* Pipes can return data - either original or modified - which will be passed on to the route handler.
* Pipes can throw exceptions. Exceptions thrown will be handled by NestJS and parsed into an error response.
* Pipes can be asynchronous

### Default Pipes in NestJS

NestJS ships with useful piepes within the `@nestjs/common` module.

1. ValidationPipe
* Validate the compatability of an entire object against a class (goes well with DTOs). If any property cannot be mapped properly (for example, mismatching type) validation will fail.
* A very common use case, therefore having a built-in validation pipe is extremely useful

2. ParseIntPipe
* By default, arguments are of type `String` . This pipe validates that an argument is a number. If successful, the argument is transformed into a `Number` and passed onto the handler.

3. CustomerPipe
* Pipe are classes annotated with the `@Injectable` decorator
* Pipes must implement the **PipeTransform** generic interface. Therfore, every pipe must have an `transform()` method. This method will be called by NestJS to process the arguments.
* The `transform()` method accepts two parameters:
  + value: The value of the processed argument
  + matadata (optional): an object containing metadata about the argument
* Whatever is returned from the **transform()** method will be passed on to the route handler. Exceptions will be sent back to the client.

* Pipe can be consumed in different way.
1. Handler-level pipes - are defined at the handler level, via the `@UsePipes()` decorator. Such pipe will process all parametes for the incoming request
``` javascript
@Post()
@UsePipes(SomePipe)
createTask(@Body('description') description) {
  // ...
}
```
2. Parameter-level pipes - are defined at the parameter level. Only the specific parameter for which the pipe has been specified will be processed.
``` javascript
@Post()
createTask(@Body('description', SomePipe) description) {
  // ...
}
```

3. Global Pipes - are defined at the application level and will be applied to any incoming request.
``` javascript
async function bootstrap() {
  const app = await NestFactory.create(ApplicationModule);
  app.useGlobalPipes(SomePipe);
  await app.listen(3000);
}
bootstrap()
```
* We should be using **Handler-level pipes** even though it requires some more code, but provide some great benefits:
1. Such pipes do not require extra code at the parameter level.
2. Easier to maintain and expand. If the shape of the data changes, it is easy to make the necessary changes within the pipe only.
3. Responsibility of identifying the arguments to process is shifted to one central file - the pipe file.
4. Promote usage of DTOs.