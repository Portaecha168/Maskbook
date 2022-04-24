import { test, expect } from '@jest/globals'
import {
    makeTypedMessageText,
    encodeTypedMessageToDocument,
    makeTypedMessageSerializableTupleFromList,
    decodeTypedMessageFromDocument,
} from '../dist/base/index.js'

const meta = new Map<string, any>([
    ['com.example.test', 'hi'],
    ['com.example.test2', { a: 1, b: [2], c: new Uint8Array([1, 2, 3, 4]) }],
])

test('Serialize Text', async () => {
    // eslint-disable-next-line @typescript-eslint/await-thenable
    const result = await encodeTypedMessageToDocument(makeTypedMessageText('Hello world', meta))
    expect(result).toMatchSnapshot()
    // eslint-disable-next-line @typescript-eslint/await-thenable
    expect(await decodeTypedMessageFromDocument(result)).toMatchSnapshot()
})

test('Serialize Tuple', async () => {
    const msg = makeTypedMessageSerializableTupleFromList(
        makeTypedMessageText('Hello world', meta),
        makeTypedMessageText('another'),
    )
    // eslint-disable-next-line @typescript-eslint/await-thenable
    const result = await encodeTypedMessageToDocument(msg)
    expect(result).toMatchSnapshot()
    // eslint-disable-next-line @typescript-eslint/await-thenable
    expect(await decodeTypedMessageFromDocument(result)).toMatchSnapshot()
})
