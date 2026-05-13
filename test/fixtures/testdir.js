const fs = require('fs/promises')
const os = require('os')
const path = require('path')

// WeakMap to cache test directories per test context
const testdirCache = new WeakMap()

/**
 * Create a temporary test directory with the specified structure
 * Automatically cleans up after the test completes
 * Multiple calls with the same test context will reuse the same directory
 * @param {import('node:test').TestContext} t - The test context
 * @param {Object} structure - Directory structure to create
 * @returns {Promise<string>} Path to the created temporary directory
 */
async function testdir (t, structure = {}) {
  // Check if we already have a directory for this test context
  let tmpDir = testdirCache.get(t)

  if (!tmpDir) {
    // Create new directory and cache it
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'test-'))
    testdirCache.set(t, tmpDir)

    // Register cleanup hook
    t.after(async () => {
      try {
        await fs.rm(tmpDir, { recursive: true, force: true })
      } catch (err) {
        // Ignore cleanup errors
      }
    })
  }

  async function createStructure (base, struct) {
    for (const [name, content] of Object.entries(struct)) {
      const filePath = path.join(base, name)
      if (typeof content === 'object' && content !== null && !content.symlink) {
        await fs.mkdir(filePath, { recursive: true })
        await createStructure(filePath, content)
      } else if (content && content.symlink) {
        await fs.symlink(content.symlink, filePath)
      } else {
        await fs.mkdir(path.dirname(filePath), { recursive: true })
        await fs.writeFile(filePath, content)
      }
    }
  }

  await createStructure(tmpDir, structure)
  return tmpDir
}

module.exports = testdir
