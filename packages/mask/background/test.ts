/// <reference types="@masknet/global-types/compartment" />

import { Compartment, createModuleCache, URLResolveHook } from '@masknet/compartment'
import type { Plugin } from '@masknet/plugin-infra'
import { Identifier, PostIdentifier, ECKeyIdentifier, ProfileIdentifier, PostIVIdentifier } from '@masknet/shared-base'
import { Err, Ok, Some, None } from 'ts-results'
import { createPluginDatabase } from './database/plugin-db/wrap-plugin-database'

const { moduleMap: sharedModules, addNamespace } = createModuleCache()
addNamespace('ts-results', { Err, Ok, Some, None })
addNamespace('@masknet/base', { Identifier, PostIdentifier, ECKeyIdentifier, ProfileIdentifier, PostIVIdentifier })

class Plugin {
    constructor(private id: string) {
        this.localModules.addNamespace('@masknet/plugin/worker', {
            taggedStorage: createPluginDatabase(id, this.abortController.signal),
            addBackupHandler: (handler: Plugin.Worker.BackupHandler) => {
                if (this.backupHandler) throw new Error('Backup handler already set')
                console.log('[Plugin]', id, 'has registered a backup handler', handler)
                this.backupHandler = handler
            },
        })
        this.localModules.addModuleRecord('@masknet/plugin', {
            bindings: [
                {
                    export: '*',
                    as: 'worker',
                    from: 'mask-plugin://io.mask.fileservice/rpc.mjs',
                },
            ],
            initialize() {},
        })
        Object.defineProperty(this.compartment.globalThis, 'window', {
            value: this.compartment.globalThis,
        })
        Object.defineProperty(this.compartment.globalThis, 'self', {
            value: this.compartment.globalThis,
        })
    }
    import(fullSpec: string) {
        return this.compartment.import(fullSpec)
    }
    private backupHandler: Plugin.Worker.BackupHandler | undefined
    kill() {
        this.abortController.abort()
    }
    private abortController = new AbortController()
    private readonly localModules = createModuleCache()
    private readonly compartment = new Compartment({
        resolveHook: URLResolveHook,
        loadHook: async (fullSpec) => {
            if (sharedModules[fullSpec]) return sharedModules[fullSpec]
            if (this.localModules.moduleMap[fullSpec]) return this.localModules.moduleMap[fullSpec]
            if (fullSpec.startsWith('mask-plugin://') && !fullSpec.startsWith('mask-plugin://' + this.id)) {
                throw new Error('Import from other plugins is not supported.')
            }

            if (__mask__compartment__modules__.has(fullSpec))
                return { record: __mask__compartment__modules__.get(fullSpec)! }
            return undefined
        },
        globals: {
            console,
            fetch,
            Request,
            Response,
            AbortSignal,
            EventTarget,
            AbortController,
            URL,
            atob,
            btoa,
            TextEncoder,
            TextDecoder,
            crypto,
        },
    })
}

Promise.all(
    [
        '/external-plugins/io.mask.fileservice/102.js',
        '/external-plugins/io.mask.fileservice/655.js',
        '/external-plugins/io.mask.fileservice/999.js',
        '/external-plugins/io.mask.fileservice/background.js',
        '/external-plugins/io.mask.fileservice/content_script.js',
        '/external-plugins/io.mask.fileservice/rpc.js',
        '/external-plugins/io.mask.fileservice/runtime.js',
    ].map((x) => import(/* webpackIgnore: true */ x)),
)
    .then(async () => {
        console.clear()
        const plugin = new Plugin('io.mask.fileservice')
        await plugin.import('mask-plugin://io.mask.fileservice/background.mjs')
        debugger
        const rpc = await plugin.import('@masknet/plugin')
        console.log(rpc)
    })
    .catch(console.error)
