const tape = require('tape')
const params = require('sophon-common')
const utils = require('sophonjs-util')
const srlp = utils.srlp
const testing = require('sophonjs-testing')
const Header = require('../header.js')
const Block = require('../index.js')

tape('[Block]: Header functions', function (t) {
  t.test('should create with default constructor', function (st) {
    function compareDefaultHeader (st, header) {
      st.deepEqual(header.parentHash, utils.zeros(32))
      st.equal(header.uncleHash.toString('hex'), utils.SHA3_SRLP_ARRAY_S)
      st.deepEqual(header.coinbase, utils.zeros(20))
      st.deepEqual(header.stateRoot, utils.zeros(32))
      st.equal(header.transactionsTrie.toString('hex'), utils.SHA3_SRLP_S)
      st.equal(header.receiptTrie.toString('hex'), utils.SHA3_SRLP_S)
      st.deepEqual(header.bloom, utils.zeros(256))
      st.deepEqual(header.difficulty, new Buffer([]))
      st.deepEqual(header.number, utils.intToBuffer(params.homeSteadForkNumber.v))
      st.deepEqual(header.gasLimit, new Buffer('ffffffffffffff', 'hex'))
      st.deepEqual(header.gasUsed, new Buffer([]))
      st.deepEqual(header.timestamp, new Buffer([]))
      st.deepEqual(header.extraData, new Buffer([]))
      st.deepEqual(header.mixHash, utils.zeros(32))
      st.deepEqual(header.nonce, new Buffer([]))
    }

    var header = new Header()
    compareDefaultHeader(st, header)

    var block = new Block()
    header = block.header
    compareDefaultHeader(st, header)

    st.end()
  })

  t.test('should test validateGasLimit', function (st) {
    const testData = testing.getSingleFile('BlockchainTests/bcBlockGasLimitTest.json')

    var parentBlock = new Block(srlp.decode(testData['BlockGasLimit2p63m1'].genesisSRLP))
    var block = new Block(srlp.decode(testData['BlockGasLimit2p63m1'].blocks[0].srlp))
    st.equal(block.header.validateGasLimit(parentBlock), true)
    st.end()
  })

  t.test('should test isGenesis', function (st) {
    var header = new Header()
    st.equal(header.isGenesis(), false)
    header.number = new Buffer([])
    st.equal(header.isGenesis(), true)
    st.end()
  })
})

