const tape = require('tape')
const testing = require('sophonjs-testing')
const srlp = require('sophonjs-util').srlp
const Block = require('../index.js')

tape('[Block]: block functions', function (t) {
  const testData = require('./testdata.json')

  function testTransactionValidation (st, block) {
    st.equal(block.validateTransactions(), true)

    block.genTxTrie(function () {
      st.equal(block.validateTransactionsTrie(), true)
      st.end()
    })
  }

  t.test('should test transaction validation', function (st) {
    var block = new Block(srlp.decode(testData.blocks[0].srlp))
    st.plan(2)
    testTransactionValidation(st, block)
  })

  t.test('should test transaction validation with empty transaction list', function (st) {
    var block = new Block()
    st.plan(2)
    testTransactionValidation(st, block)
  })

  const testData2 = require('./testdata2.json')
  t.test('should test uncles hash validation', function (st) {
    var block = new Block(srlp.decode(testData2.blocks[2].srlp))
    st.equal(block.validateUnclesHash(), true)
    st.end()
  })

  t.test('should test isGenesis', function (st) {
    var block = new Block()
    st.notEqual(block.isGenesis(), true)
    block.header.number = new Buffer([])
    st.equal(block.isGenesis(), true)
    st.end()
  })

  const testDataGenesis = testing.getSingleFile('BasicTests/genesishashestest.json')
  t.test('should test genesis hashes', function (st) {
    var genesisBlock = new Block()
    genesisBlock.setGenesisParams()
    var srlp = genesisBlock.serialize()
    st.strictEqual(srlp.toString('hex'), testDataGenesis.genesis_srlp_hex, 'srlp hex match')
    st.strictEqual(genesisBlock.hash().toString('hex'), testDataGenesis.genesis_hash, 'genesis hash match')
    st.end()
  })

  t.test('should test toJSON', function (st) {
    var block = new Block(srlp.decode(testData2.blocks[2].srlp))
    st.equal(typeof (block.toJSON()), 'object')
    st.equal(typeof (block.toJSON(true)), 'object')
    st.end()
  })
})

