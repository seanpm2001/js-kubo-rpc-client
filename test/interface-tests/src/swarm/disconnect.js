/* eslint-env mocha */

import { expect } from 'aegir/chai'
import { getDescribe, getIt } from '../utils/mocha.js'
import { isWebWorker } from 'ipfs-utils/src/env.js'
import { ipfsOptionsWebsocketsFilterAll } from '../utils/ipfs-options-websockets-filter-all.js'

/**
 * @typedef {import('ipfsd-ctl').Factory} Factory
 */

/**
 * @param {Factory} factory
 * @param {object} options
 */
export function testDisconnect (factory, options) {
  const ipfsOptions = ipfsOptionsWebsocketsFilterAll()
  const describe = getDescribe(options)
  const it = getIt(options)

  describe('.swarm.disconnect', function () {
    this.timeout(80 * 1000)

    /** @type {import('ipfs-core-types').IPFS} */
    let ipfsA
    /** @type {import('ipfs-core-types').IPFS} */
    let ipfsB
    /** @type {import('ipfs-core-types/src/root').IDResult} */
    let ipfsBId

    before(async function () {
      ipfsA = (await factory.spawn({ type: 'go', ipfsOptions })).api
      // webworkers are not dialable because webrtc is not available
      ipfsB = (await factory.spawn({ type: isWebWorker ? 'go' : undefined })).api
      ipfsBId = await ipfsB.id()
    })

    beforeEach(async function () {
      await ipfsA.swarm.connect(ipfsBId.addresses[0])
    })

    after(function () { factory.clean() })

    it('should disconnect from a peer', async function () {
      let peers

      peers = await ipfsA.swarm.peers()
      expect(peers).to.have.length.above(0)

      await ipfsA.swarm.disconnect(ipfsBId.addresses[0])

      peers = await ipfsA.swarm.peers()
      expect(peers).to.have.length(0)
    })
  })
}
