import type {
    PersonaRecord,
    FullPersonaDBTransaction,
    PersonasTransaction,
    ProfileRecordDB,
    PersonaRecordWithPrivateKey,
    ProfileRecord,
    ProfileTransaction,
    RelationRecord,
    RelationTransaction,
} from './type'
import type { ProfileIdentifier, PersonaIdentifier } from '@masknet/shared-base'

export async function consistentPersonaDBWriteAccess(action: () => Promise<void>) {
    await action()
}

export async function createPersonaDB(record: PersonaRecord): Promise<void> {
    return
}

export async function createPersonaByProfileDB(
    query: ProfileIdentifier,
    t?: FullPersonaDBTransaction<'readonly'>,
): Promise<PersonaRecord | null> {
    return null
}

export async function queryPersonaDB(
    query: PersonaIdentifier,
    t?: PersonasTransaction<'readonly'>,
    isIncludeLogout?: boolean,
): Promise<PersonaRecord | null> {
    return null
}

export async function queryPersonasWithPrivateKey(): Promise<PersonaRecordWithPrivateKey[]> {
    return []
}

/**
 * Update an existing Persona record.
 * @param nextRecord The partial record to be merged
 * @param howToMerge How to merge linkedProfiles and `field: undefined`
 * @param t transaction
 */

export async function updatePersonaDB( // Do a copy here. We need to delete keys from it.
    { ...nextRecord }: Readonly<Partial<PersonaRecord> & Pick<PersonaRecord, 'identifier'>>,
    howToMerge: {
        linkedProfiles: 'replace' | 'merge'
        explicitUndefinedField: 'ignore' | 'delete field'
    },
    t?: PersonasTransaction<'readwrite'>,
): Promise<void> {
    return
}

export async function createOrUpdatePersonaDB(
    record: Partial<PersonaRecord> & Pick<PersonaRecord, 'identifier' | 'publicKey'>,
    howToMerge: Parameters<typeof updatePersonaDB>[1] & { protectPrivateKey?: boolean },
    t?: PersonasTransaction<'readwrite'>,
): Promise<void> {}

/**
 * Delete a Persona
 */
export async function deletePersonaDB(
    id: PersonaIdentifier,
    confirm: 'delete even with private' | "don't delete if have private key",
    t?: PersonasTransaction<'readwrite'>,
): Promise<void> {}

/**
 * Delete a Persona
 * @returns a boolean. true: the record no longer exists; false: the record is kept.
 */
export async function safeDeletePersonaDB(
    id: PersonaIdentifier,
    t?: FullPersonaDBTransaction<'readwrite'>,
): Promise<void> {}

/**
 * Create a new profile.
 */
export async function createProfileDB(record: ProfileRecordDB, t?: ProfileTransaction<'readwrite'>): Promise<void> {}

/**
 * Query a profile.
 */
export async function queryProfileDB(
    id: ProfileIdentifier,
    t?: ProfileTransaction<'readonly'>,
): Promise<ProfileRecord | null> {
    return null
}

/**
 * Query many profiles.
 */
export async function queryProfilesDB(
    network: string | ((record: ProfileRecord) => boolean),
    t?: ProfileTransaction<'readonly'>,
): Promise<ProfileRecord[]> {
    return []
}

/**
 * query profiles with paged
 * @param options
 * @param count
 */
export async function queryProfilesPagedDB(
    options: {
        after?: ProfileIdentifier
        query?: string
    },
    count: number,
): Promise<ProfileRecord[]> {
    return []
}

/**
 * Update a profile.
 */
export async function updateProfileDB(
    updating: Partial<ProfileRecord> & Pick<ProfileRecord, 'identifier'>,
    t?: ProfileTransaction<'readwrite'>,
): Promise<void> {
    return
}

export async function createOrUpdateProfileDB(rec: ProfileRecord, t?: ProfileTransaction<'readwrite'>): Promise<void> {}

/**
 * Detach a profile from it's linking persona.
 * @param identifier The profile want to detach
 * @param t A living transaction
 */
export async function detachProfileDB(
    identifier: ProfileIdentifier,
    t?: FullPersonaDBTransaction<'readwrite'>,
): Promise<void> {}

/**
 * attach a profile.
 */
export async function attachProfileDB(): Promise<void> {
    return
}

/**
 * Delete a profile
 */
export async function deleteProfileDB(id: ProfileIdentifier, t?: ProfileTransaction<'readwrite'>): Promise<void> {}

/**
 * Create a new Relation
 */
export async function createRelationDB(
    record: Omit<RelationRecord, 'network'>,
    t?: RelationTransaction<'readwrite'>,
    silent = false,
): Promise<void> {
    return
}

export async function queryRelations(
    query: (record: RelationRecord) => boolean,
    t?: RelationTransaction<'readonly'>,
): Promise<RelationRecord[]> {
    return []
}

export async function queryRelationsPagedDB(
    linked: PersonaIdentifier,
    options: {
        network: string
        after?: RelationRecord
    },
    count: number,
): Promise<RelationRecord[]> {
    return []
}

/**
 * Update a relation
 * @param updating
 * @param t
 * @param silent
 */
export async function updateRelationDB(
    updating: Omit<RelationRecord, 'network'>,
    t?: RelationTransaction<'readwrite'>,
    silent = false,
): Promise<void> {}