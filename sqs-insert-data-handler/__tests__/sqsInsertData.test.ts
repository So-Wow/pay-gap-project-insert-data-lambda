import {assert} from "chai"
import * as sinon from "sinon"
import "dotenv/config"

import {handler} from "../sqs-insert-data.ts"
import * as putData from "../services/put-data.ts"
import * as patchData from "../services/patch-data.ts"
import mockEvent from "../events/event-sqs.json"
import mockEventNewEmployer from "../events/event-sqs-new-company.json"

const stubbedPutData = sinon.stub(putData, "default")
const stubbedPatchData = sinon.stub(patchData, "default")

describe("It receives an sqs event", () => {
  describe("and the employer doesn't exist", () => {
    let result
    before(async () => {
      stubbedPutData.resolves({status: 201, statusText: "created"})
      result = await handler(mockEventNewEmployer)
    })

    it("should call putData twice and return its response", () => {
      assert.isObject(result)
      sinon.assert.calledTwice(stubbedPutData)
      sinon.assert.calledOnce(stubbedPatchData)
    })
  })
  describe("and the employer already exists", () => {
    let result
    before(async () => {
      sinon.resetHistory()

      stubbedPutData.resolves({status: 201, statusText: "created"})
      stubbedPatchData.resolves({status: 201, statusText: "created"})
      result = await handler(mockEvent)
    })

    it("should call putData once and patchData and return its response", () => {
      sinon.assert.calledOnce(stubbedPutData)
      sinon.assert.calledTwice(stubbedPatchData)
      assert.isObject(result)
      assert.propertyVal(result, "statusCode", 200)
    })
  })
})
