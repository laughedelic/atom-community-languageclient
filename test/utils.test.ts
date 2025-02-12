import * as Utils from "../lib/utils"
import { createFakeEditor } from "./helpers"
import { expect } from "chai"
import { Point } from "atom"
import { join } from "path"
import * as fs from "fs"
import * as sinon from "sinon"

describe("Utils", () => {
  describe("getWordAtPosition", () => {
    let editor: any
    beforeEach(() => {
      editor = createFakeEditor("test.txt")
      editor.setText("blah test1234 test-two")
    })

    it("gets the word at position from a text editor", () => {
      // "blah"
      let range = Utils.getWordAtPosition(editor, new Point(0, 0))
      expect(range.serialize()).eql([
        [0, 0],
        [0, 4],
      ])

      // "test1234"
      range = Utils.getWordAtPosition(editor, new Point(0, 7))
      expect(range.serialize()).eql([
        [0, 5],
        [0, 13],
      ])

      // "test"
      range = Utils.getWordAtPosition(editor, new Point(0, 14))
      expect(range.serialize()).eql([
        [0, 14],
        [0, 18],
      ])
    })

    it("returns empty ranges for non-words", () => {
      const range = Utils.getWordAtPosition(editor, new Point(0, 4))
      expect(range.serialize()).eql([
        [0, 4],
        [0, 4],
      ])
    })
  })

  describe("getExePath", () => {
    it("returns the exe path under bin folder by default", () => {
      let expectedExe = join(process.cwd(), "bin", `${process.platform}-${process.arch}`, "serve-d")
      if (process.platform === "win32") {
        expectedExe = expectedExe + ".exe"
      }

      const fsMock = sinon.mock(fs)
      fsMock.expects("existsSync").withArgs(expectedExe).returns(true)

      const exePath = Utils.getExePath("serve-d")
      expect(exePath).eq(expectedExe)

      fsMock.restore()
    })
    it("returns the exe path for the given root", () => {
      const rootPath = join(__dirname, `${process.platform}-${process.arch}`)
      let expectedExe = join(rootPath, "serve-d")
      if (process.platform === "win32") {
        expectedExe = expectedExe + ".exe"
      }

      const fsMock = sinon.mock(fs)
      fsMock.expects("existsSync").withArgs(expectedExe).returns(true)

      const exePath = Utils.getExePath("serve-d", rootPath)
      expect(exePath).eq(expectedExe)

      fsMock.restore()
    })
    it("returns the exe name if the file does not exist under rootPath", () => {
      const exePath = Utils.getExePath("python")
      expect(exePath).eq("python")
    })
  })
})
