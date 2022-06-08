interface StaticModuleRecord {
    initialize(_: any, meta: any): void | Promise<void>
}
declare const __mask__compartment__modules__: ReadonlyMap<string, StaticModuleRecord>
declare function __mask__compartment__define__(name: string, rec: StaticModuleRecord): void

declare const __mask__register__external__plugins__: undefined | readonly string[]
