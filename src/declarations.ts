import { Event } from './events/Event'
import { Config } from '@stone-js/config'
import { EventEmitter } from './events/EventEmitter'
import { MetadataSymbol } from './decorators/Metadata'
import { Container } from '@stone-js/service-container'
import { IncomingEvent, IncomingEventOptions } from './events/IncomingEvent'
import { OutgoingResponse, OutgoingResponseOptions } from './events/OutgoingResponse'
import { FactoryPipe, FunctionalPipe, MetaPipe, MixedPipe, NextPipe, PipeAlias, PipeClass, PipeType } from '@stone-js/pipeline'

/**
 * Represents a Container type.
 */
export type IContainer = Container

/**
 * Represents a Next type.
 */
export type NextMiddleware<T = unknown, R = T> = NextPipe<T, R>

/**
 * Represents a PipeAlias type.
 */
export type MiddlewareAlias = PipeAlias

/**
 * Represents a PipeClass type.
 */
export type MiddlewareClass<T = unknown, R = T> = PipeClass<T, R>

/**
 * Represents a FunctionalMiddleware type.
 */
export type FunctionalMiddleware<T = unknown, R = T> = FunctionalPipe<T, R>

/**
 * Represents a FactoryMiddleware type.
 */
export type FactoryMiddleware<T = unknown, R = T> = FactoryPipe<T, R>

/**
 * Represents a PipeAlias type.
 */
export type MiddlewareType<T = unknown, R = T> = PipeType<T, R>

/**
 * Represents a MetaMiddleware type.
 */
export type MetaMiddleware<T = unknown, R = T> = MetaPipe<T, R>

/**
 * Represents a MixedMiddleware type.
 */
export type MixedMiddleware<T = unknown, R = T> = MixedPipe<T, R>

/**
 * Represents a PipeInstance type.
 */
export interface IMiddleware<T = unknown, R = T> {
  handle: FunctionalMiddleware<T, R>
}

/**
 * Log level enumeration to define possible log levels.
 */
export enum LogLevel {
  TRACE = 'trace',
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error'
}

/**
 * Represents a Promiseable type.
 */
export type Promiseable<T> = T | Promise<T>

/**
 * Logger Interface.
 *
 * Represents a generic logging interface, which can either be a native console object or a popular JavaScript logging library.
 */
export interface ILogger {
  /**
   * Logs informational messages.
   *
   * @param message - The message to log.
   * @param optionalParams - Optional parameters to log.
   */
  info: (message: string, ...optionalParams: unknown[]) => void

  /**
   * Logs debug-level messages, used for debugging purposes.
   *
   * @param message - The message to log.
   * @param optionalParams - Optional parameters to log.
   */
  debug: (message: string, ...optionalParams: unknown[]) => void

  /**
   * Logs warnings, used to indicate potential issues.
   *
   * @param message - The warning message to log.
   * @param optionalParams - Optional parameters to log.
   */
  warn: (message: string, ...optionalParams: unknown[]) => void

  /**
   * Logs errors, used to report errors or exceptions.
   *
   * @param message - The error message to log.
   * @param optionalParams - Optional parameters to log.
   */
  error: (message: string, ...optionalParams: unknown[]) => void

  /**
   * Logs general messages, similar to `info` but less specific.
   *
   * @param message - The message to log.
   * @param optionalParams - Optional parameters to log.
   */
  log?: (message: string, ...optionalParams: unknown[]) => void

  /**
   * Logs trace-level messages, providing the most detailed information, usually for diagnostic purposes.
   *
   * @param message - The trace message to log.
   * @param optionalParams - Optional parameters to log.
   */
  trace?: (message: string, ...optionalParams: unknown[]) => void
}

/**
 * Represents an IncomingEvent source.
 */
export interface IncomingEventSource {
  /**
   * The raw event object from the originating platform.
   */
  rawEvent: unknown

  /**
   * The raw context object from the originating platform.
   */
  rawContext: unknown

  /**
   * The raw response object from the originating platform.
   */
  rawResponse?: unknown

  /**
   * The platform from which the event originated.
   */
  platform: string | symbol
}

/**
 * Represents an IServiceProviderClass type.
 */
export type IServiceProviderClass<TEvent extends IncomingEvent = IncomingEvent, UResponse extends OutgoingResponse = OutgoingResponse> = new (...args: any[]) => IServiceProvider<TEvent, UResponse>

/**
 * Interface representing a service provider within the system.
 *
 * This interface provides lifecycle hooks for managing the registration,
 * initialization, and termination phases of a provider. Implementations
 * of this interface are expected to define these lifecycle methods as needed.
 *
 * @template TEvent, UResponse
 */
export interface IServiceProvider<
  TEvent extends IncomingEvent = IncomingEvent,
  UResponse extends OutgoingResponse = OutgoingResponse
> {
  /**
   * Hook that runs before the context is created. This can be used for setup or validation purposes.
   */
  onPrepare?: () => Promiseable<void>

  /**
   * Hook that runs before the main handler is invoked. This can be used for setup or validation purposes.
   */
  beforeHandle?: () => Promiseable<void>

  /**
   * Registers the provider into the system. Typically used for adding services or bindings to the container.
   */
  register?: () => Promiseable<void>

  /**
   * Boots the provider after registration. This method is used to initialize services that need to be started.
   */
  boot?: () => Promiseable<void>

  /**
   * Hook that runs after the main handler is invoked. This can be used for cleanup tasks.
   */
  afterHandle?: (context: HookContext<TEvent, UResponse>) => Promiseable<void>

  /**
   * Hook that runs after the main handler completes. This can be used for cleanup tasks.
   */
  onTerminate?: (context: Partial<HookContext<TEvent, UResponse>>) => Promiseable<void>

  /**
   * Skip this provider.
   */
  mustSkip?: () => Promiseable<boolean>
}

/**
 * Represents an ApplicationClass type.
 */
export type ApplicationClass<
  TEvent extends IncomingEvent = IncomingEvent,
  UResponse extends OutgoingResponse = OutgoingResponse,
  UserResponse = unknown
> = new (...args: any[]) => IApplication<TEvent, UResponse> | IApplicationHandler<TEvent, UResponse, UserResponse>

/**
 * Interface representing a Stone Application entry point.
 *
 * This interface provides lifecycle hooks for managing the registration.
 * This is an alias for IServiceProvider.
 *
 * @template TEvent, UResponse
 */
export interface IApplication<
  TEvent extends IncomingEvent = IncomingEvent,
  UResponse extends OutgoingResponse = OutgoingResponse
> extends IServiceProvider<TEvent, UResponse> {}

/**
 * Interface representing a Stone Application entry point.
 *
 * This interface provides lifecycle hooks for managing the registration.
 * This is an alias for IServiceProvider.
 * This interface is used for single event handler applications.
 *
 * @template TEvent, UResponse, UserResponse
 */
export interface IApplicationHandler<
  TEvent extends IncomingEvent = IncomingEvent,
  UResponse extends OutgoingResponse = OutgoingResponse,
  UserResponse = unknown
> extends IApplication<TEvent, UResponse> {
  handle: FunctionalEventHandler<TEvent, UserResponse>
}

/**
 * MetaApplication Type.
 *
 * @template TEvent, UResponse, UserResponse
*/
export interface MetaApplication<
  TEvent extends IncomingEvent = IncomingEvent,
  UResponse extends OutgoingResponse = OutgoingResponse,
  UserResponse = unknown
> {
  isClass?: boolean
  isFactory?: boolean
  module: ApplicationClass<TEvent, UResponse, UserResponse>
}

/**
 * Represents a FactoryServiceProvider type.
 *
 * @param container - The dependency injection container.
 * @returns The service provider object.
 */
export type FactoryServiceProvider<TEvent extends IncomingEvent = IncomingEvent, UResponse extends OutgoingResponse = OutgoingResponse> = (container: IContainer | any) => IServiceProvider<TEvent, UResponse>

/**
 * Represents a ServiceProvider type.
 */
export type ServiceProviderType<TEvent extends IncomingEvent = IncomingEvent, UResponse extends OutgoingResponse = OutgoingResponse> = IServiceProviderClass<TEvent, UResponse> | FactoryServiceProvider<TEvent, UResponse>

/**
 * Represents a MetaServiceProvider type.
 */
export interface MetaServiceProvider<TEvent extends IncomingEvent = IncomingEvent, UResponse extends OutgoingResponse = OutgoingResponse> {
  isClass?: boolean
  isFactory?: boolean
  module: ServiceProviderType<TEvent, UResponse>
}

/**
 * Represents a MixedServiceProvider type.
 */
export type MixedServiceProvider<TEvent extends IncomingEvent = IncomingEvent, UResponse extends OutgoingResponse = OutgoingResponse> = IServiceProviderClass<TEvent, UResponse> | MetaServiceProvider<TEvent, UResponse>

/**
 * Represents a IServiceClass type.
 */
export type IServiceClass = new (...args: any[]) => any

/**
 * Represents a FactoryService type.
 *
 * @param container - The dependency injection container.
 * @returns The service object.
 */
export type FactoryService = (container: IContainer | any) => Record<PropertyKey, any>

/**
 * Represents a MetaService type.
 */
export interface MetaService {
  isClass?: boolean
  isFactory?: boolean
  singleton?: boolean
  alias: string | string[]
  module: IServiceClass | FactoryService
}

/**
 * Represents a IEventListenerClass type.
 */
export type IEventListenerClass<TEvent extends Event = Event> = new (...args: any[]) => IEventListener<TEvent>

/**
 * Interface representing a listener for handling specific events.
 *
 * Listeners implementing this interface should define a `handle` method
 * that is called whenever the associated event occurs.
 */
export interface IEventListener<TEvent extends Event = Event> {
  /**
   * Handles the event when it occurs. This method contains the logic that runs when the event is triggered.
   *
   * @returns The event listener function.
   */
  handle: FunctionalEventListener<TEvent>
}

/**
 * Represents a FunctionalEventListener type.
 *
 * @param event - The event to handle.
 */
export type FunctionalEventListener<TEvent extends Event = Event> = (event: TEvent) => Promiseable<void>

/**
 * Represents a FactoryEventListener type.
 *
 * @param container - The dependency injection container.
 * @returns The event listener function.
 */
export type FactoryEventListener<TEvent extends Event = Event> = (container: IContainer | any) => FunctionalEventListener<TEvent>

/**
 * Represents a EventListener type.
 */
export type EventListenerType<TEvent extends Event = Event> = IEventListenerClass<TEvent> | FunctionalEventListener<TEvent> | FactoryEventListener<TEvent>

/**
 * Represents a MetaEventListener type.
 */
export interface MetaEventListener<TEvent extends Event = Event> {
  event: string
  isClass?: boolean
  isFactory?: boolean
  module: EventListenerType<TEvent>
}

/**
 * Represents an IEventSubscriberClass type.
 *
 */
export type IEventSubscriberClass = new (...args: any[]) => IEventSubscriber

/**
 * Interface representing a subscriber to an event emitter.
 *
 * Subscribers implementing this interface can subscribe to an event emitter
 * and handle multiple types of events.
 */
export interface IEventSubscriber {
  /**
   * Subscribes to an event emitter to handle various events.
   *
   * @param eventEmitter - The event emitter to subscribe to.
   */
  subscribe: FunctionalEventSubscriber
}

/**
 * Represents a FunctionalEventSubscriber type.
 *
 * @param eventEmitter - The event emitter to subscribe to.
 */
export type FunctionalEventSubscriber = (eventEmitter: EventEmitter) => Promiseable<void>

/**
 * Represents a FactoryEventSubscriber type.
 *
 * @param container - The dependency injection container.
 * @returns The event subscriber function.
 */
export type FactoryEventSubscriber = (container: IContainer | any) => FunctionalEventSubscriber

/**
 * Represents a EventSubscriber type.
 */
export type EventSubscriberType = IEventSubscriberClass | FunctionalEventSubscriber | FactoryEventSubscriber

/**
 * Represents a MetaEventSubscriber type.
 */
export interface MetaEventSubscriber {
  isClass?: boolean
  isFactory?: boolean
  module: EventSubscriberType
}

/**
 * Represents a MixedEventSubscriber type.
 */
export type MixedEventSubscriber = FunctionalEventSubscriber | MetaEventSubscriber

/**
 * Represents a LifecycleEventHandler class.
 *
 * @template TEvent, UResponse
 */
export type EventHandlerClass<TEvent extends IncomingEvent = IncomingEvent, UResponse = unknown> = new (...args: any[]) => IEventHandler<TEvent, UResponse>

/**
 * EventHandler Interface.
 * Represents an event handler for processing incoming events and returning outgoing responses.
 *
 * @template TEvent, UResponse
 */
export interface IEventHandler<TEvent extends IncomingEvent = IncomingEvent, UResponse = unknown> {
  handle: FunctionalEventHandler<TEvent, UResponse>
}

/**
 * FunctionalEventHandler.
 *
 * Represents a function that handles incoming events and returns an outgoing response.
 *
 * @template TEvent, UResponse
 * @param incomingEvent - The incoming event to handle.
 * @returns The outgoing response.
 */
export type FunctionalEventHandler<TEvent extends IncomingEvent, UResponse = unknown> = (incomingEvent: TEvent) => Promiseable<UResponse>

/**
 * FactoryEventHandler.
 *
 * Represents a factory function that creates an event handler function.
 *
 * @template TEvent, UResponse
 * @param container - The dependency injection container.
 * @returns The event handler function.
 */
export type FactoryEventHandler<TEvent extends IncomingEvent, UResponse = unknown> = (container: IContainer | any) => FunctionalEventHandler<TEvent, UResponse>

/**
 * EventHandler Interface.
 * Represents an event handler that can handle incoming events and return outgoing responses.
 *
 * @template TEvent, UResponse
 */
export type EventHandlerType<
  TEvent extends IncomingEvent = IncomingEvent,
  UResponse = unknown
> = EventHandlerClass<TEvent, UResponse> | FunctionalEventHandler<TEvent, UResponse> | FactoryEventHandler<TEvent, UResponse>

/**
 * MetaEventHandler Interface.
 *
 * Represents a metadata object for an app event handler.
 *
 * @template TEvent, UResponse
 */
export interface MetaEventHandler<TEvent extends IncomingEvent = IncomingEvent, UResponse = unknown> {
  isClass?: boolean
  isFactory?: boolean
  module: EventHandlerType<TEvent, UResponse>
}

/**
 * MixedEventHandler Type.
 *
 * Represents an event handler that can either be a simple function or a meta event handler.
 *
 * @template TEvent, UResponse
 */
export type MixedEventHandler<TEvent extends IncomingEvent = IncomingEvent, UResponse = unknown> = FunctionalEventHandler<TEvent, UResponse> | MetaEventHandler<TEvent, UResponse>

/**
 * Hook Type.
 *
 * Represents a hook that can either be synchronous or asynchronous.
 */
export type KernelHook = Record<HookName, KernelHookListener[]>

/**
 * KernelHookListener Type.
 *
 * Represents a listener hook that can either be synchronous or asynchronous.
 */
export type KernelHookListener = (container?: Container) => Promiseable<void>

/**
 * ConfigContext Interface.
 *
 * Represents the context object for configuration, which contains the modules and blueprint used to configure the system.
 */
export interface ConfigContext<T extends IBlueprint = IBlueprint, ModuleType = unknown> {
  /**
   * List of configuration modules.
   */
  readonly modules: ModuleType[]

  /**
   * The configuration blueprint.
   */
  readonly blueprint: T
}

/**
 * LoggerResolver Type.
 *
 * Represents a function that resolves a logger instance based on the provided blueprint.
 *
 * @param blueprint - The application blueprint.
 * @returns The logger instance.
 */
export type LoggerResolver = (blueprint: IBlueprint) => ILogger

/**
 * KernelResolver Type.
 *
 * Represents a function that resolves a lifecycle event handler based on the provided blueprint.
 *
 * @template TEvent, UResponse
 * @param blueprint - The application blueprint.
 * @returns The lifecycle event handler.
 */
export type KernelResolver<TEvent extends IncomingEvent, UResponse extends OutgoingResponse> = (blueprint: IBlueprint) => LifecycleAdapterEventHandler<TEvent, UResponse>

/**
 * ResponseResolverOptions Type.
 *
 * Represents the options for resolving an outgoing response.
 */
export type ResponseResolverOptions = OutgoingResponseOptions & Record<string, unknown>

/**
 * ResponseResolver Type.
 *
 * Represents a function that resolves an outgoing response based on the provided options.
 *
 * @template TOutgoingResponse, TOptions
 * @param options - The outgoing response options.
 * @returns The outgoing response.
 */
export type ResponseResolver<TOutgoingResponse extends OutgoingResponse> = (options: ResponseResolverOptions) => Promiseable<TOutgoingResponse>

/**
 * IErrorHandlerClass Type.
 *
 * @template TEvent, UResponse
 * @param args - The application constructor params.
 * @returns The error handler.
 */
export type IErrorHandlerClass<TEvent extends IncomingEvent = IncomingEvent, UResponse = unknown> = new (...args: any[]) => IErrorHandler<TEvent, UResponse>

/**
 * ErrorHandler Interface.
 *
 * Represents an error handler that provides methods to report and render errors.
 *
 * @template TEvent, UResponse
 */
export interface IErrorHandler<TEvent extends IncomingEvent, UResponse = unknown> {
  handle: FunctionalErrorHandler<TEvent, UResponse>
}

/**
 * FunctionalErrorHandler Type.
 *
 * Represents a function that handles errors and returns responses.
 *
 * @template TEvent, UResponse
 * @param error - The error to handle.
 * @param event - The incoming event.
 * @returns The outgoing response.
 */
export type FunctionalErrorHandler<TEvent extends IncomingEvent, UResponse = unknown> = (error: any, event: TEvent) => Promiseable<UResponse>

/**
 * FactoryErrorHandler Type.
 *
 * Represents a factory function that creates an error handler function.
 *
 * @template TEvent, UResponse
 * @param container - The dependency injection container.
 * @returns The error handler function.
 */
export type FactoryErrorHandler<TEvent extends IncomingEvent, UResponse = unknown> = (container: IContainer | any) => FunctionalErrorHandler<TEvent, UResponse>

/**
 * ErrorHandler Type.
 *
 * Represents an error handler which can either be a class, a simple function or a factory function.
 */
export type ErrorHandlerType<TEvent extends IncomingEvent, UResponse = unknown> = IErrorHandlerClass<TEvent, UResponse> | FunctionalErrorHandler<TEvent, UResponse> | FactoryErrorHandler<TEvent, UResponse>

/**
 * MetaErrorHandler Interface.
 *
 * Represents a metadata object for an error handler.
 *
 * @template TEvent, UResponse
 */
export interface MetaErrorHandler<TEvent extends IncomingEvent, UResponse = unknown> {
  isClass?: boolean
  isFactory?: boolean
  module: ErrorHandlerType<TEvent, UResponse>
}

/**
 * ConfigurationClass type.
 *
 * @template TValues
 */
export type ConfigurationClass<TValues extends object = any> = new (...args: any[]) => IConfiguration<TValues>

/**
 * Configuration Interface.
 *
 * Represents a configuration object that can be used to configure the system.
 *
 * @param blueprint - The blueprint to configure.
 *
 * @template TValues
 */
export interface IConfiguration<TValues extends object = any> {
  configure: FunctionalConfiguration<TValues>
}

/**
 * FunctionalConfiguration Type.
 *
 * Represents a function that configures the system based on the provided blueprint.
 *
 * @template TValues
 * @param blueprint - The blueprint to configure.
 * @returns A promise that resolves when the configuration is complete.
 */
export type FunctionalConfiguration<TValues extends object = any> = (blueprint: IBlueprint<TValues>) => Promiseable<void>

/**
 * MetaConfiguration Interface.
 *
 * Represents a metadata object for a configuration.
 *
 * @template TValues
 */
export interface MetaConfiguration<TValues extends object = any> {
  isClass?: boolean
  module: ConfigurationClass<TValues> | FunctionalConfiguration<TValues>
}

/**
 * MixedConfiguration Type.
 *
 * @template TValues
*/
export type MixedConfiguration<TValues extends object = any> = MetaConfiguration<TValues> | FunctionalConfiguration<TValues>

/**
 * Blueprint Interface.
 *
 * Represents the blueprint configuration object, which is an instance of Config.
 *
 * @template TValues
 */
export type IBlueprint<TValues extends object = any> = Config<TValues>

/**
 * HookName Type.
 */
export type HookName = 'onInit' | 'onPrepare' | 'beforeHandle' | 'afterHandle' | 'onTerminate'

/**
 * HookContext Interface.
 *
 * Represents the context for the hooks, containing the event and optional response.
 *
 * @template TEvent, UResponse
 */
export interface HookContext<TEvent extends IncomingEvent, UResponse extends OutgoingResponse> {
  event: TEvent
  response: UResponse
}

/**
 * ClassType Type.
 *
 * Represents a class type, including abstract classes.
 */
export type ClassType<Type = any> = (new (...args: any[]) => Type)

/**
 * Abstract ClassType Type.
 *
 * Represents a class type, including abstract classes.
 */
export type AbstractClassType<Type = any> = (abstract new (...args: any[]) => Type)

/**
 * ClassMethodType Type.
 *
 * Represents a method type within a class, with a specific context.
 *
 * @template This
 */
export type ClassMethodType<This = unknown> = (this: This, ...args: any[]) => any

/**
 * Represents options for configuring an error.
 */
export interface ErrorOptions {
  /**
   * A specific error code for identifying the error.
   */
  code?: string

  /**
   * The original error that caused this error, useful for error chaining.
   */
  cause?: Error

  /**
   * Additional information or context about the error.
   */
  metadata?: unknown
}

/**
 * Represents a wildcard event name.
*/
export type WildcardEventName = string | symbol

/**
 * Represents an event listener handler.
 */
export type ListenerHandler<T extends Event = Event> = (event: T) => Promiseable<void>

/**
 * Represents a wildcard event listener handler.
 */
export type WildcardListenerHandler<T = string | symbol, U extends Event = Event> = (eventName: T, event: U) => Promiseable<void>

/**
 * Represents a listener handler that can either be a simple function or a wildcard function.
 */
export type MixedListenerHandler<
  TEventType extends Event,
  UEventName
> = ListenerHandler<TEventType> | WildcardListenerHandler<UEventName, TEventType>

/** *********************************************** Proposal decorator *************/
/**
 * Represents an object that holds metadata keyed by the `MetadataSymbol`.
 */
export interface MetadataHolder {
  [MetadataSymbol]: Record<PropertyKey, unknown>
}

/**
 * Represents a class decorator using the 2023-11 proposal syntax.
 *
 * A function that decorates a class and optionally returns a new constructor.
 *
 * @template TClass - The type of the class constructor being decorated.
 * @param target - The class constructor to be decorated.
 * @param context - The context object providing metadata about the class.
 * @returns The original or a modified class constructor, or `undefined`.
 */
export type ProposalClassDecorator<TClass extends ClassType = ClassType> = <TFunction extends TClass>(
  target: TFunction,
  context: ClassDecoratorContext<TClass>
) => TFunction | undefined

/**
 * Represents a method decorator using the 2023-11 proposal syntax.
 *
 * A function that decorates a class method and optionally returns a new method implementation.
 *
 * @template T - The type of the method being decorated.
 * @param target - The class prototype or static target containing the method.
 * @param context - The context object providing metadata about the method.
 * @returns The original or a modified method, or `undefined`.
 */
export type ProposalMethodDecorator<T extends Function = Function> = <TFunction extends T>(
  target: TFunction,
  context: ClassMethodDecoratorContext<T>
) => TFunction | undefined

/**
 * Represents a property decorator using the 2023-11 proposal syntax.
 *
 * A function that decorates a class field and optionally returns an initializer function
 * to define the property's initial value.
 *
 * @param target - Always `undefined` for field decorators.
 * @param context - The context object providing metadata about the field.
 * @returns An initializer function for the property value.
 */
export type ProposalPropertyDecorator = (
  target: undefined,
  context: ClassFieldDecoratorContext
) => (initialValue: unknown) => unknown | undefined

/**
 * Represents an accessor decorator using the 2023-11 proposal syntax.
 *
 * A function that decorates a getter or setter method and optionally returns a new implementation.
 *
 * @template T - The type of the accessor being decorated.
 * @param target - The class prototype or static target containing the accessor.
 * @param context - The context object providing metadata about the accessor.
 * @returns The original or a modified accessor, or `undefined`.
 */
export type ProposalAccessorDecorator<T extends Function = Function> = <TFunction extends T>(
  target: TFunction,
  context: ClassAccessorDecoratorContext<T>
) => TFunction | undefined

/** *********************************************** Adapter *************/
/**
 * Represents an adapter handler options.
*/
export interface AdapterHandlerOptions {
  logger: ILogger
  blueprint: IBlueprint
}

/**
 * RawResponseBuilder Interface.
 *
 * Represents a wrapper for building raw responses with specific options and a response function.
 *
 * @template TResponse
 */
export interface IRawResponseWrapper<TResponse> {
  respond: () => Promiseable<TResponse>
}

/**
 * IAdapterEventBuilder Interface.
 *
 * Interface representing a builder for adapters that provides methods for adding properties and building the resulting object.
 *
 * @template TValues, UResponse
 */
export interface IAdapterEventBuilder<TValues, UResponse> {
  build: () => UResponse
  add: (key: keyof TValues, value: TValues[typeof key]) => this
}

/**
 * RawResponseOptions.
 *
 * Represents an object where the property keys can be any valid property key and values can be anything.
 */
export interface RawResponseOptions {
  [k: PropertyKey]: unknown
}

/**
 * LifecycleAdapterEventHandler Interface.
 *
 * Represents a lifecycle event handler with hooks for initialization, pre-handling, handling, and termination phases.
 *
 * @template TEvent, UResponse
 */
export interface LifecycleAdapterEventHandler<TEvent extends IncomingEvent, UResponse extends OutgoingResponse> {
  onPrepare?: () => Promiseable<void>
  beforeHandle?: () => Promiseable<void>
  handle: FunctionalAdapterEventHandler<TEvent, UResponse>
  afterHandle?: (context: HookContext<TEvent, UResponse>) => Promiseable<void>
  onTerminate?: (context: Partial<HookContext<TEvent, UResponse>>) => Promiseable<void>
}

/**
 * FunctionalAdapterEventHandler.
 *
 * Represents a function that handles incoming events and returns an outgoing response.
 *
 * @template TEvent, UResponse
 * @param incomingEvent - The incoming event to handle.
 * @returns The outgoing response.
 */
export type FunctionalAdapterEventHandler<TEvent extends IncomingEvent, UResponse extends OutgoingResponse> = (incomingEvent: TEvent) => Promiseable<UResponse>

/**
 * AdapterEventHandler Type.
 *
 * Represents an event handler which can either be a simple function or a lifecycle event handler object.
 *
 * @template TEvent, UResponse
 */
export type AdapterEventHandlerType<
  TEvent extends IncomingEvent = IncomingEvent,
  UResponse extends OutgoingResponse = OutgoingResponse
> = LifecycleAdapterEventHandler<TEvent, UResponse> | FunctionalAdapterEventHandler<TEvent, UResponse>

/**
 * AdapterEventHandlerResolver.
 *
 * Represents a resolver that provides an event handler based on the provided blueprint.
 *
 * @template TEvent, UResponse
 * @param blueprint - The application blueprint.
 * @returns The event handler.
 */
export type AdapterEventHandlerResolver<TEvent extends IncomingEvent, UResponse extends OutgoingResponse> = (blueprint: IBlueprint) => AdapterEventHandlerType<TEvent, UResponse>

/**
 * AdapterHookListener Type.
 *
 * Represents a listener hook that can either be synchronous or asynchronous.
 */
export type AdapterHookListener = (blueprint: IBlueprint) => Promiseable<void>

/**
 * AdapterAfterHandleHookListener Type.
 *
 * Represents a listener hook that can either be synchronous or asynchronous.
 */
export type AdapterAfterHandleHookListener = <TEvent extends IncomingEvent, UResponse extends OutgoingResponse>(blueprint: IBlueprint, context: HookContext<TEvent, UResponse>) => Promiseable<void>

/**
 * AdapterOnTerminateHookListener Type.
 *
 * Represents a listener hook that can either be synchronous or asynchronous.
 */
export type AdapterOnTerminateHookListener = <TEvent extends IncomingEvent, UResponse extends OutgoingResponse>(blueprint: IBlueprint, context: Partial<HookContext<TEvent, UResponse>>) => Promiseable<void>

/**
 * AdapterHooks Interface.
 *
 * Represents lifecycle hooks that can be defined for the adapter, such as initialization, pre-handling, and termination.
 */
export interface AdapterHooks {
  onInit?: AdapterHookListener[]
  onPrepare?: AdapterHookListener[]
  beforeHandle?: AdapterHookListener[]
  afterHandle?: AdapterAfterHandleHookListener[]
  onTerminate?: AdapterOnTerminateHookListener[]
}

/**
 * Adapter Interface.
 *
 * Represents an adapter with a run method that returns a promise of type ExecutionResultType.
 */
export interface IAdapter {
  run: <ExecutionResultType = unknown>() => Promise<ExecutionResultType>
}

/**
 * AdapterResolver Type.
 *
 * Represents a function that resolves an adapter instance based on the provided blueprint.
 *
 * @param blueprint - The application blueprint.
 * @returns The adapter instance.
 */
export type AdapterResolver = (blueprint: IBlueprint) => IAdapter

/**
 * Class representing an AdapterContext.
 *
 * @template RawEventType
 * @template RawResponseType
 * @template ExecutionContextType
 * @template IncomingEventType
 * @template IncomingEventOptionsType
 * @template OutgoingResponseType
 */
export interface AdapterContext<
RawEventType,
RawResponseType,
ExecutionContextType,
IncomingEventType extends IncomingEvent = IncomingEvent,
IncomingEventOptionsType extends IncomingEventOptions = IncomingEventOptions,
OutgoingResponseType extends OutgoingResponse = OutgoingResponse
> {
  /**
   * The rawEvent of type RawEventType.
   */
  readonly rawEvent: RawEventType

  /**
   * The rawResponse of type RawResponseType.
   */
  rawResponse?: RawResponseType

  /**
   * The executionContext of type ExecutionContextType.
   */
  readonly executionContext: ExecutionContextType

  /**
   * The incomingEvent associated with the executionContext.
   */
  incomingEvent?: IncomingEventType

  /**
   * The outgoingResponse associated with the executionContext.
   */
  outgoingResponse?: OutgoingResponseType

  /**
   * The incomingEventBuilder.
   */
  readonly incomingEventBuilder: IAdapterEventBuilder<IncomingEventOptionsType, IncomingEventType>

  /**
   * The rawResponseBuilder.
   */
  readonly rawResponseBuilder: IAdapterEventBuilder<RawResponseOptions, IRawResponseWrapper<RawResponseType>>
}

/**
 * Class representing an AdapterErrorContext.
 *
 * @template RawEventType
 * @template RawResponseType
 * @template ExecutionContextType
 */
export interface AdapterErrorContext<RawEventType, RawResponseType, ExecutionContextType> {
  /**
   * The rawEvent of type RawEventType.
   */
  readonly rawEvent: RawEventType

  /**
   * The executionContext of type ExecutionContextType.
   */
  readonly executionContext: ExecutionContextType

  /**
   * The rawResponseBuilder.
   */
  readonly rawResponseBuilder: IAdapterEventBuilder<RawResponseOptions, IRawResponseWrapper<RawResponseType>>
}

/**
 * AdapterErrorHandlerClass Type.
 *
 * Represents a class type for adapter error handlers.
 *
 * @template RawEventType
 * @template RawResponseType
 * @template ExecutionContextType
 */
export type IAdapterErrorHandlerClass<RawEventType, RawResponseType, ExecutionContextType> = new (...args: any[]) => IAdapterErrorHandler<RawEventType, RawResponseType, ExecutionContextType>

/**
 * Adapter ErrorHandler Interface.
 *
 * Represents an error handler for the adapters, which can handle errors and return responses.
 */
export interface IAdapterErrorHandler<RawEventType, RawResponseType, ExecutionContextType> {
  handle: FunctionalAdapterErrorHandler<RawEventType, RawResponseType, ExecutionContextType>
}

/**
 * FunctionalAdapterErrorHandler Type.
 *
 * Represents a function that handles errors and returns responses.
 *
 * @template RawEventType
 * @template RawResponseType
 * @template ExecutionContextType
 */
export type FunctionalAdapterErrorHandler<RawEventType, RawResponseType, ExecutionContextType> = (error: any, context: AdapterErrorContext<RawEventType, RawResponseType, ExecutionContextType>) => Promiseable<RawResponseType>

/**
 * FactoryAdapterErrorHandler Type.
 *
 * Represents a factory function that creates an adapter error handler function.
 *
 * @template RawEventType
 * @template RawResponseType
 * @template ExecutionContextType
 */
export type FactoryAdapterErrorHandler<RawEventType, RawResponseType, ExecutionContextType> = (options: AdapterHandlerOptions) => FunctionalAdapterErrorHandler<RawEventType, RawResponseType, ExecutionContextType>

/**
 * AdapterErrorHandler Type.
 *
 * Represents an error handler which can either be a class, a simple function or a factory function.
 */
export type AdapterErrorHandlerType<RawEventType, RawResponseType, ExecutionContextType> = IAdapterErrorHandlerClass<RawEventType, RawResponseType, ExecutionContextType> | FunctionalAdapterErrorHandler<RawEventType, RawResponseType, ExecutionContextType> | FactoryAdapterErrorHandler<RawEventType, RawResponseType, ExecutionContextType>

/**
 * MetaAdapterErrorHandler Interface.
 *
 * Represents a metadata object for an adapter error handler.
 *
 * @template RawEventType
 * @template RawResponseType
 * @template ExecutionContextType
 */
export interface MetaAdapterErrorHandler<RawEventType = any, RawResponseType = any, ExecutionContextType = any> {
  isClass?: boolean
  isFactory?: boolean
  module: AdapterErrorHandlerType<RawEventType, RawResponseType, ExecutionContextType>
}
/** ************** End Adapter *************/
