import { createAddAll } from './add-all.js'
import { createAdd } from './add.js'
import { createCat } from './cat.js'
import { createCommands } from './commands.js'
import { createGet } from './get.js'
import { createLs } from './ls.js'
import { createId } from './id.js'
import { createVersion } from './version.js'
import { createDns } from './dns.js'
import { createStop } from './stop.js'
import { createPing } from './ping.js'
import { createResolve } from './resolve.js'
import { createMount } from './mount.js'
import { createIsOnline } from './is-online.js'
import { createGetEndpointConfig } from './get-endpoint-config.js'
import type { Client } from './lib/core.js'
import type { CID, Version as CIDVersion } from 'multiformats/cid'
import type { Mtime } from 'ipfs-unixfs'
import type { Multiaddr } from '@multiformats/multiaddr'
import type { PeerId } from '@libp2p/interface-peer-id'
import type { ClientOptions, EndpointConfig, ImportCandidate, ImportCandidateStream, IPFSPath, PreloadOptions } from './index.js'

export function createRoot (client: Client): RootAPI {
  return {
    addAll: createAddAll(client),
    add: createAdd(client),
    cat: createCat(client),
    get: createGet(client),
    ls: createLs(client),
    id: createId(client),
    version: createVersion(client),
    dns: createDns(client),
    stop: createStop(client),
    ping: createPing(client),
    resolve: createResolve(client),
    commands: createCommands(client),
    mount: createMount(client),
    isOnline: createIsOnline(client),
    getEndpointConfig: createGetEndpointConfig(client)
  }
}

export interface RootAPI {
  /**
   * Import a file or data into IPFS
   */
  add: (entry: ImportCandidate, options?: AddOptions) => Promise<AddResult>

  /**
   * Import multiple files and data into IPFS
   */
  addAll: (source: ImportCandidateStream, options?: AddAllOptions) => AsyncIterable<AddResult>

  /**
   * Returns content of the file addressed by a valid IPFS Path or CID
   */
  cat: (ipfsPath: IPFSPath, options?: CatOptions) => AsyncIterable<Uint8Array>

  /**
   * Fetch a file or an entire directory tree from IPFS that is addressed by a
   * valid IPFS Path
   */
  get: (ipfsPath: IPFSPath, options?: GetOptions) => AsyncIterable<Uint8Array>

  /**
   * Lists a directory from IPFS that is addressed by a valid IPFS Path
   */
  ls: (ipfsPath: IPFSPath, options?: ListOptions) => AsyncIterable<IPFSEntry>

  /**
   * Returns the identity of the Peer
   *
   * @example
   * ```js
   * const identity = await ipfs.id()
   * console.log(identity)
   * ```
   */
  id: (options?: IDOptions) => Promise<IDResult>

  /**
   * Returns the implementation version
   *
   * @example
   * ```js
   * const version = await ipfs.version()
   * console.log(version)
   * ```
   */
  version: (options?: ClientOptions) => Promise<VersionResult>

  /**
   * Resolve DNS links
   */
  dns: (domain: string, options?: DNSOptions) => Promise<string>

  /**
   * Stop the node
   */
  stop: (options?: ClientOptions) => Promise<void>

  /**
   * Send echo request packets to IPFS hosts.
   *
   * @example
   * ```js
   * for await (const res of ipfs.ping('Qmhash')) {
   *   if (res.time) {
   *     console.log(`Pong received: time=${res.time} ms`)
   *   } else {
   *     console.log(res.text)
   *   }
   * }
   * ```
   */
  ping: (peerId: PeerId, options?: PingOptions) => AsyncIterable<PingResult>

  /**
   * Resolve the value of names to IPFS
   *
   * There are a number of mutable name protocols that can link among themselves
   * and into IPNS. For example IPNS references can (currently) point at an IPFS
   * object, and DNS links can point at other DNS links, IPNS entries, or IPFS
   * objects. This command accepts any of these identifiers and resolves them
   * to the referenced item.
   *
   * @example
   * ```js
   * // Resolve the value of your identity:
   * const name = '/ipns/QmatmE9msSfkKxoffpHwNLNKgwZG8eT9Bud6YoPab52vpy'
   *
   * const res = await ipfs.resolve(name)
   * console.log(res)
   * // Logs: /ipfs/Qmcqtw8FfrVSBaRmbWwHxt3AuySBhJLcvmFYi3Lbc4xnwj
   *
   * // Resolve the value of another name recursively:
   * const name = '/ipns/QmbCMUZw6JFeZ7Wp9jkzbye3Fzp2GGcPgC3nmeUjfVF87n'
   *
   * // Where:
   * // /ipns/QmbCMUZw6JFeZ7Wp9jkzbye3Fzp2GGcPgC3nmeUjfVF87n
   * // ...resolves to:
   * // /ipns/QmatmE9msSfkKxoffpHwNLNKgwZG8eT9Bud6YoPab52vpy
   * // ...which in turn resolves to:
   * // /ipfs/Qmcqtw8FfrVSBaRmbWwHxt3AuySBhJLcvmFYi3Lbc4xnwj
   *
   * const res = await ipfs.resolve(name, { recursive: true })
   * console.log(res)
   * // Logs: /ipfs/Qmcqtw8FfrVSBaRmbWwHxt3AuySBhJLcvmFYi3Lbc4xnwj
   *
   * // Resolve the value of an IPFS path:
   * const name = '/ipfs/QmeZy1fGbwgVSrqbfh9fKQrAWgeyRnj7h8fsHS1oy3k99x/beep/boop'
   * const res = await ipfs.resolve(name)
   * console.log(res)
   * // Logs: /ipfs/QmYRMjyvAiHKN9UTi8Bzt1HUspmSRD8T8DwxfSMzLgBon1
   * ```
   */
  resolve: (name: string, options?: ResolveOptions) => Promise<string>

  /**
   * Returns a list of available commands
   */
  commands: (options?: ClientOptions) => Promise<string[]>

  mount: (options?: MountOptions) => Promise<MountResult>

  /**
   * Returns true if this IPFS node is online - that is, it's listening on network addresses
   * for incoming connections
   */
  isOnline: () => Promise<boolean>

  getEndpointConfig: () => EndpointConfig
}

export interface IPFSEntry {
  readonly type: 'dir' | 'file'
  readonly cid: CID
  readonly name: string
  readonly path: string
  mode?: number
  mtime?: Mtime
  size: number
}

export interface AddProgressFn { (bytes: number, path?: string): void }

export interface AddOptions extends ClientOptions {
  /**
   * Chunking algorithm used to build ipfs DAGs. (defaults to 'size-262144')
   */
  chunker?: string
  /**
   * The CID version to use when storing the data
   */
  cidVersion?: CIDVersion

  /**
   * Multihash hashing algorithm to use. (Defaults to 'sha2-256')
   */
  hashAlg?: string

  /**
   * If true, will not add blocks to the blockstore. (Defaults to `false`)
   */
  onlyHash?: boolean

  /**
   * Pin this object when adding. (Defaults to `true`)
   */
  pin?: boolean

  /**
   * A function that will be called with the number of bytes added as a file is
   * added to ipfs and the path of the file being added.
   *
   * **Note** It will not be called for directory entries.
   */
  progress?: AddProgressFn

  /**
   * If true, DAG leaves will contain raw file data and not be wrapped in a
   * protobuf. (Defaults to `false`)
   */
  rawLeaves?: boolean

  /**
   * If true will use the
   * [trickle DAG](https://godoc.org/github.com/ipsn/go-ipfs/gxlibs/github.com/ipfs/go-unixfs/importer/trickle)
   * format for DAG generation. (Defaults to `false`).
   */
  trickle?: boolean

  /**
   * Adds a wrapping node around the content. (Defaults to `false`)
   */
  wrapWithDirectory?: boolean

  /**
   * Whether to preload all blocks created during this operation
   */
  preload?: boolean

  /**
   * How many blocks from a file to write concurrently
   */
  blockWriteConcurrency?: number
}

export interface AddAllOptions extends AddOptions {

  /**
   * Allows to create directories with an unlimited number of entries currently
   * size of unixfs directories is limited by the maximum block size.
   * ** Note ** that this is an experimental feature. (Defaults to `false`)
   */
  enableShardingExperiment?: boolean

  /**
   * Directories with more than this number of files will be created as HAMT -
   * sharded directories. (Defaults to 1000)
   */
  shardSplitThreshold?: number

  /**
   * How many files to write concurrently
   */
  fileImportConcurrency?: number
}

export interface AddResult {
  cid: CID
  size: number
  path: string
  mode?: number
  mtime?: Mtime
}

export interface ShardingOptions {
  sharding?: boolean
}

export interface CatOptions extends ClientOptions, PreloadOptions {
  /**
   * An offset to start reading the file from
   */
  offset?: number
  /**
   * An optional max length to read from the file
   */
  length?: number
}

export interface GetOptions extends ClientOptions, PreloadOptions {
  archive?: boolean
  compress?: boolean
  compressionLevel?: -1 | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
}

export interface ListOptions extends ClientOptions, PreloadOptions {

}

export interface IDOptions extends ClientOptions {
  peerId?: PeerId
}

export interface IDResult {
  id: PeerId
  publicKey: string
  addresses: Multiaddr[]
  agentVersion: string
  protocolVersion: string
  protocols: string[]
}

/**
 * An object with the version information for the implementation,
 * the commit and the Repo. `js-ipfs` instances will also return
 * the version of `interface-ipfs-core` and `ipfs-http-client`
 * supported by this node
 */
export interface VersionResult {
  version: string
  commit?: string
  repo?: string
  system?: string
  golang?: string
  'kubo-rpc-client': string
}

export interface DNSOptions extends ClientOptions {
  recursive?: boolean
}

export interface PingOptions extends ClientOptions {
  count?: number
}

export interface PingResult {
  success: boolean
  time: number
  text: string
}

export interface ResolveOptions extends ClientOptions {
  recursive?: boolean
  cidBase?: string
}

export interface MountOptions extends ClientOptions {
  ipfsPath?: string
  ipnsPath?: string
}

export interface MountResult {
  fuseAllowOther?: boolean
  ipfs?: string
  ipns?: string
}
