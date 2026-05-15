const { test } = require('node:test')
const assert = require('node:assert')
const fs = require('fs/promises')
const path = require('node:path')
const testdir = require('./fixtures/testdir.js')

// Example 1: Simple package.json structure (similar to CLI tests)
test('creates simple package.json structure', async (t) => {
  const dir = await testdir(t, {
    'package.json': JSON.stringify({
      name: 'test-pkg',
      version: '1.0.0',
      dependencies: {
        foo: '^1.0.0',
      },
    }),
  })

  const pkgPath = path.join(dir, 'package.json')
  const pkgContent = await fs.readFile(pkgPath, 'utf8')
  const pkg = JSON.parse(pkgContent)

  assert.strictEqual(pkg.name, 'test-pkg')
  assert.strictEqual(pkg.version, '1.0.0')
  assert.deepStrictEqual(pkg.dependencies, { foo: '^1.0.0' })
})

// Example 2: Workspace structure (from arborist audit test)
test('creates workspace structure with multiple packages', async (t) => {
  const dir = await testdir(t, {
    'package.json': JSON.stringify({
      workspaces: ['packages/*'],
      dependencies: {
        mkdirp: '1',
      },
    }),
    packages: {
      a: {
        'package.json': JSON.stringify({
          name: 'a',
          version: '1.2.3',
          dependencies: {
            mkdirp: '0',
          },
        }),
      },
      b: {
        'package.json': JSON.stringify({
          name: 'b',
          version: '1.2.3',
          dependencies: {
            mkdirp: '0',
          },
        }),
      },
    },
  })

  // Verify root package.json
  const rootPkg = JSON.parse(await fs.readFile(path.join(dir, 'package.json'), 'utf8'))
  assert.deepStrictEqual(rootPkg.workspaces, ['packages/*'])

  // Verify workspace packages
  const pkgA = JSON.parse(await fs.readFile(path.join(dir, 'packages/a/package.json'), 'utf8'))
  assert.strictEqual(pkgA.name, 'a')
  assert.strictEqual(pkgA.version, '1.2.3')

  const pkgB = JSON.parse(await fs.readFile(path.join(dir, 'packages/b/package.json'), 'utf8'))
  assert.strictEqual(pkgB.name, 'b')
  assert.strictEqual(pkgB.version, '1.2.3')
})

// Example 3: Multiple file types (from docs test)
test('creates mixed content types', async (t) => {
  const dir = await testdir(t, {
    'package.json': JSON.stringify({
      name: 'mixed-content',
      version: '1.0.0',
    }),
    'README.md': '# Test Package\n\nThis is a test.',
    lib: {
      'index.js': 'module.exports = "hello"',
      'utils.js': 'exports.add = (a, b) => a + b',
    },
    docs: {
      'guide.md': '# Guide\n\nHow to use.',
    },
  })

  // Verify files exist with correct content
  const readme = await fs.readFile(path.join(dir, 'README.md'), 'utf8')
  assert.strictEqual(readme, '# Test Package\n\nThis is a test.')

  const indexJs = await fs.readFile(path.join(dir, 'lib/index.js'), 'utf8')
  assert.strictEqual(indexJs, 'module.exports = "hello"')

  const guideExists = await fs.access(path.join(dir, 'docs/guide.md'))
    .then(() => true)
    .catch(() => false)
  assert.strictEqual(guideExists, true)
})

// Example 4: Symlinks (demonstrating symlink support)
test('creates symlinks', async (t) => {
  const dir = await testdir(t, {
    target: {
      'file.txt': 'target content',
    },
    'link-to-target': { symlink: 'target' },
  })

  // Verify symlink exists and points to target
  const stats = await fs.lstat(path.join(dir, 'link-to-target'))
  assert.strictEqual(stats.isSymbolicLink(), true)

  const linkTarget = await fs.readlink(path.join(dir, 'link-to-target'))
  assert.strictEqual(linkTarget, 'target')
})

// Example 5: Multiple calls to testdir reuse the same directory
test('multiple calls reuse same directory', async (t) => {
  const dir1 = await testdir(t, {
    'file1.txt': 'content 1',
  })

  const dir2 = await testdir(t, {
    'file2.txt': 'content 2',
  })

  // Should be the same directory
  assert.strictEqual(dir1, dir2)

  // Both files should exist
  const file1Content = await fs.readFile(path.join(dir1, 'file1.txt'), 'utf8')
  const file2Content = await fs.readFile(path.join(dir2, 'file2.txt'), 'utf8')

  assert.strictEqual(file1Content, 'content 1')
  assert.strictEqual(file2Content, 'content 2')
})

// Example 6: Complex nested structure (from install-types fixture)
test('creates complex nested node_modules structure', async (t) => {
  const dir = await testdir(t, {
    'package.json': JSON.stringify({
      name: 'complex-app',
      version: '1.0.0',
      dependencies: {
        foo: '^1.0.0',
        bar: '^2.0.0',
      },
    }),
    node_modules: {
      foo: {
        'package.json': JSON.stringify({
          name: 'foo',
          version: '1.0.0',
          dependencies: {
            'foo-dep': '^1.0.0',
          },
        }),
        'index.js': 'module.exports = "foo"',
      },
      bar: {
        'package.json': JSON.stringify({
          name: 'bar',
          version: '2.0.0',
        }),
        'index.js': 'module.exports = "bar"',
      },
      'foo-dep': {
        'package.json': JSON.stringify({
          name: 'foo-dep',
          version: '1.0.0',
        }),
        'index.js': 'module.exports = "foo-dep"',
      },
    },
  })

  // Verify the structure
  const rootPkg = JSON.parse(await fs.readFile(path.join(dir, 'package.json'), 'utf8'))
  assert.strictEqual(rootPkg.name, 'complex-app')

  const fooPkg = JSON.parse(await fs.readFile(path.join(dir, 'node_modules/foo/package.json'), 'utf8'))
  assert.strictEqual(fooPkg.name, 'foo')

  const barIndex = await fs.readFile(path.join(dir, 'node_modules/bar/index.js'), 'utf8')
  assert.strictEqual(barIndex, 'module.exports = "bar"')

  const fooDepPkg = JSON.parse(await fs.readFile(path.join(dir, 'node_modules/foo-dep/package.json'), 'utf8'))
  assert.strictEqual(fooDepPkg.name, 'foo-dep')
})
