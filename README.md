# NestJS Introduction

## Controller
* Handling request and returning response to the client
* Controller is bound to a specific path (for example, "/tasks" for the tasks resource)
* Contains handler which handle endpoints and request method (get, post...etc)
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