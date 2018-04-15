const bs58check = require('bs58check')
const _ = require('lodash/fp')

const MAIN_PREFIXES = [0x32, 0x49]
const TEST_PREFIXES = [0x8b, 0x13]

module.exports = {depositUrl, parseUrl}

function parseUrl (network, url) {
  const res = /^(xmcc:\/{0,2})?(\w+)/.exec(url)
  const address = res && res[2]

  console.log('DEBUG16: *%s*', address)
  if (!validate(network, address)) return null

  return address
}

function depositUrl (address, amount) {
  return `xmcc:${address}?amount=${amount}`
}

function validate (network, address) {
  try {
    if (!network) throw new Error('No network supplied.')
    if (!address) throw new Error('No address supplied.')

    const buf = bs58check.decode(address)
    const addressType = buf[0]

    if (buf.length !== 21) throw new Error(`Invalid length: ${buf.length}`)

    if (network === 'main' && _.includes(addressType, MAIN_PREFIXES)) return true
    if (network === 'test' && _.includes(addressType, TEST_PREFIXES)) return true

    throw new Error('General error')
  } catch (err) {
    console.log(err)
    console.log('Invalid monoeci address: [%s] %s', network, address)
    return false
  }
}
