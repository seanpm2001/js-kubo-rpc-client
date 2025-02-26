
import http from 'http'
// @ts-expect-error no types
import { setup } from 'mock-ipfs-pinning-service'
import getPort from 'aegir/get-port'

const defaultPort = 1139
const defaultToken = 'secret'

export class PinningService {
  /**
   * @param {object} options
   * @param {number} [options.port]
   * @param {string|null} [options.token]
   * @returns {Promise<PinningService>}
   */
  static async start ({ port = defaultPort, token = defaultToken } = {}) {
    const service = await setup({ token })
    const server = http.createServer(service)
    const host = '127.0.0.1'
    port = await getPort(port)
    await new Promise(resolve => server.listen(port, host, () => {
      resolve(null)
    }))

    return new PinningService({ server, host, port, token })
  }

  /**
   * @param {object} config
   * @param {any} config.server
   * @param {string} config.host
   * @param {number} config.port
   * @param {any} config.token
   */
  constructor ({ server, host, port, token }) {
    this.server = server
    this.host = host
    this.port = port
    this.token = token
  }

  get endpoint () {
    return `http://${this.host}:${this.port}`
  }

  /**
   * @returns {Promise<void>}
   */
  stop () {
    return new Promise((resolve, reject) => {
      this.server.close((/** @type {any} */ error) => {
        if (error) {
          reject(error)
        } else {
          resolve()
        }
      })
    })
  }
}
