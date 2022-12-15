/* eslint-env mocha, browser */

import { CID } from 'multiformats/cid'
import { multiaddr } from '@multiformats/multiaddr'
import { expect } from 'aegir/chai'
import * as IpfsHttpClient from '../src/index.js'

describe('exports', function () {
  it('should export the expected types and utilities', function () {
    expect(IpfsHttpClient.CID).to.equal(CID)
    expect(IpfsHttpClient.multiaddr).to.equal(multiaddr)
  })
})
