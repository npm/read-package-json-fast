# Test Fixtures

## testdir

A test helper for creating temporary directory structures in node:test tests.

### Usage

```javascript
const { test } = require('node:test')
const testdir = require('./fixtures/testdir.js')

test('my test', async (t) => {
  const dir = await testdir(t, {
    'package.json': JSON.stringify({ name: 'my-pkg' }),
    lib: {
      'index.js': 'module.exports = "hello"',
    },
  })
  
  // Use the directory path
  // Cleanup happens automatically after the test
})
```

### Features

- **Automatic cleanup**: Directories are automatically removed after tests complete
- **Directory caching**: Multiple calls with the same test context reuse the same directory
- **Nested structures**: Create complex directory hierarchies
- **Symlink support**: Use `{ symlink: 'target' }` syntax for symbolic links

### Examples

#### Simple package.json
```javascript
await testdir(t, {
  'package.json': JSON.stringify({
    name: 'my-package',
    version: '1.0.0',
  }),
})
```

#### Workspaces
```javascript
await testdir(t, {
  'package.json': JSON.stringify({
    workspaces: ['packages/*'],
  }),
  packages: {
    a: {
      'package.json': JSON.stringify({ name: 'a' }),
    },
    b: {
      'package.json': JSON.stringify({ name: 'b' }),
    },
  },
})
```

#### Symlinks
```javascript
await testdir(t, {
  target: { 'file.txt': 'content' },
  'link': { symlink: 'target' },
})
```

#### Multiple calls (same directory)
```javascript
// First call creates directory
const dir1 = await testdir(t, { 'file1.txt': 'hello' })

// Second call reuses the same directory
const dir2 = await testdir(t, { 'file2.txt': 'world' })

// dir1 === dir2
// Both files exist in the same directory
```

### Compatibility

This helper is designed to be compatible with tap's `t.testdir()` usage patterns in the npm CLI test suite, making it easier to migrate tests from tap to node:test.
