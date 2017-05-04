var assert = require('chai').assert
var fs = require('fs')
var nock = require('nock')
var CertificateVerifier = require('../lib/verifier')

describe('Certificate mock', function () {
    it('test a v1 certificate', function (done) {
      this.timeout(3000)
      fs.readFile('tests/sample_cert-expired-1.2.0.json', 'utf8', function (err, data) {
                // curl https://api.blockcypher.com/v1/btc/main/txs/8623beadbc7877a9e20fb7f83eda6c1a1fc350171f0714ff6c6c4054018eb54d > 8623beadbc7877a9e20fb7f83eda6c1a1fc350171f0714ff6c6c4054018eb54d.json
        var targetJson = 'tests/8623beadbc7877a9e20fb7f83eda6c1a1fc350171f0714ff6c6c4054018eb54d-expired.json'
        var mockInterceptor = nock('https://api.blockcypher.com').get(/btc/).reply(200, fs.readFileSync(targetJson, 'utf8'))
        var certVerifier = new CertificateVerifier(data)
        certVerifier.verify(function (err, data) {
          assert.isOk(err)
          expect(data).to.contain('Found an expired certificate.')
          nock.removeInterceptor(mockInterceptor)
          done()
        })
      })
    })
})
