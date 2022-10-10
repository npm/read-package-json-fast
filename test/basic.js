const t = require('tap')

const rpj = require('../')

t.test('errors for bad/missing data', async t => {
  t.test('raises an error for missing file', t =>
    t.rejects(rpj(t.testdir() + '/package.json'), { code: 'ENOENT' }))

  t.test('rejects if file is not json', t =>
    t.rejects(rpj(t.testdir({
      'package.json': 'this is not json',
    }) + '/package.json'), { code: 'EJSONPARSE' }))
})

t.test('clean up bundleddddddDependencies', async t => {
  t.test('change name if bundleDependencies is not present', t =>
    t.resolveMatch(rpj(t.testdir({
      'package.json': JSON.stringify({ bundledDependencies: [] }),
    }) + '/package.json'), { bundleDependencies: [] }))

  t.test('dont array-ify if its an array already', t =>
    t.resolveMatch(rpj(t.testdir({
      'package.json': JSON.stringify({ bundleDependencies: ['a'] }),
    }) + '/package.json'), { bundleDependencies: ['a'] }))

  t.test('handle bundledDependencies: true', t =>
    t.resolveMatch(rpj(t.testdir({
      'package.json': JSON.stringify({
        bundledDependencies: true,
        dependencies: { a: '1.2.3' },
      }),
    }) + '/package.json'), { bundleDependencies: ['a'] }))

  t.test('handle bundleDependencies: true', t =>
    t.resolveMatch(rpj(t.testdir({
      'package.json': JSON.stringify({
        bundleDependencies: true,
        dependencies: { a: '1.2.3' },
      }),
    }) + '/package.json'), { bundleDependencies: ['a'] }))

  t.test('handle bundleDependencies: true with no deps', t =>
    t.resolveMatch(rpj(t.testdir({
      'package.json': JSON.stringify({
        bundleDependencies: true,
      }),
    }) + '/package.json'), { bundleDependencies: [] }))

  t.test('handle bundleDependencies: false', t =>
    t.resolveMatch(rpj(t.testdir({
      'package.json': JSON.stringify({
        bundleDependencies: false,
        dependencies: { a: '1.2.3' },
      }),
    }) + '/package.json'), { bundleDependencies: [] }))

  t.test('handle bundleDependencies object', t =>
    t.resolveMatch(rpj(t.testdir({
      'package.json': JSON.stringify({
        bundleDependencies: { a: '1.2.3' },
        dependencies: { a: '1.2.3' },
      }),
    }) + '/package.json'), { bundleDependencies: ['a'] }))
})

t.test('clean up scripts', async t => {
  t.test('delete non-object scripts', t =>
    t.resolveMatch(rpj(t.testdir({
      'package.json': JSON.stringify({
        scripts: 1234,
      }),
    }) + '/package.json'), { scripts: undefined }))

  t.test('delete non-string script targets', t =>
    t.resolveMatch(rpj(t.testdir({
      'package.json': JSON.stringify({
        scripts: {
          foo: 'bar',
          bar: ['baz'],
          baz: { bar: { foo: 'barbaz' } },
        },
      }),
    }) + '/package.json'), {
      scripts: {
        foo: 'bar',
        bar: undefined,
        baz: undefined,
      },
    }))
})

t.test('convert funding string to object', t =>
  t.resolveMatch(rpj(t.testdir({
    'package.json': JSON.stringify({ funding: 'hello' }),
  }) + '/package.json'), { funding: { url: 'hello' } }))

t.test('cleanup bins', async t => {
  t.test('handle string when a name is set', t =>
    t.resolveMatch(rpj(t.testdir({
      'package.json': JSON.stringify({ name: 'x', bin: 'y' }),
    }) + '/package.json'), { bin: { x: 'y' } }))

  t.test('delete string bin when no name', t =>
    t.resolveMatch(rpj(t.testdir({
      'package.json': JSON.stringify({ bin: 'y' }),
    }) + '/package.json'), { bin: undefined }))

  t.test('remove non-object bin', t =>
    t.resolveMatch(rpj(t.testdir({
      'package.json': JSON.stringify({ bin: 1234 }),
    }) + '/package.json'), { bin: undefined }))

  t.test('remove non-string bin values', t =>
    t.resolveMatch(rpj(t.testdir({
      'package.json': JSON.stringify({ bin: {
        x: 'y',
        y: 1234,
        z: { a: 'b' },
      } }),
    }) + '/package.json'), { bin: { x: 'y', y: undefined, z: undefined } }))
})

t.test('dedupe optional deps out of regular deps', async t => {
  t.test('choose optional deps in conflict', t =>
    t.resolveMatch(rpj(t.testdir({
      'package.json': JSON.stringify({
        optionalDependencies: {
          whowins: '1.2.3-optional',
        },
        dependencies: {
          whowins: '1.2.3-prod',
        },
      }),
    }) + '/package.json'), {
      optionalDependencies: {
        whowins: '1.2.3-optional',
      },
    }))

  t.test('do not create regular deps if only optional specified', t =>
    t.resolveMatch(rpj(t.testdir({
      'package.json': JSON.stringify({
        optionalDependencies: {
          whowins: '1.2.3-optional',
        },
      }),
    }) + '/package.json'), {
      optionalDependencies: {
        whowins: '1.2.3-optional',
      },
    }))
})

t.test('set _id if name and version set', t =>
  t.resolveMatch(rpj(t.testdir({
    'package.json': JSON.stringify({ name: 'a', version: '1.2.3' }),
  }) + '/package.json'), { _id: 'a@1.2.3' }))

t.test('exports the normalize function', async t =>
  t.same(rpj.normalize({ bundledDependencies: true, dependencies: { a: '1' } }),
    { bundleDependencies: ['a'], dependencies: { a: '1' } }))

t.test('preserve indentation', async t => {
  const obj = {
    name: 'object',
    version: '1.2.3',
  }
  const path = t.testdir({
    none: {
      'package.json': JSON.stringify(obj),
    },
    twospace: {
      'package.json': JSON.stringify(obj, null, 2),
    },
    tab: {
      'package.json': JSON.stringify(obj, null, '\t'),
    },
    weird: {
      'package.json': JSON.stringify(obj, null, ' \t \t '),
    },
    winEol: {
      none: {
        'package.json': JSON.stringify(obj).replace(/\n/g, '\r\n'),
      },
      twospace: {
        'package.json': JSON.stringify(obj, null, 2).replace(/\n/g, '\r\n'),
      },
      tab: {
        'package.json': JSON.stringify(obj, null, '\t').replace(/\n/g, '\r\n'),
      },
      weird: {
        'package.json': JSON.stringify(obj, null, ' \t \t ').replace(/\n/g, '\r\n'),
      },
    },
    doubleSpaced: {
      none: {
        'package.json': JSON.stringify(obj).replace(/\n/g, '\n\n'),
      },
      twospace: {
        'package.json': JSON.stringify(obj, null, 2).replace(/\n/g, '\n\n'),
      },
      tab: {
        'package.json': JSON.stringify(obj, null, '\t').replace(/\n/g, '\n\n'),
      },
      weird: {
        'package.json': JSON.stringify(obj, null, ' \t \t ').replace(/\n/g, '\n\n'),
      },
    },
    doubleWin: {
      none: {
        'package.json': JSON.stringify(obj).replace(/\n/g, '\r\n\r\n'),
      },
      twospace: {
        'package.json': JSON.stringify(obj, null, 2).replace(/\n/g, '\r\n\r\n'),
      },
      tab: {
        'package.json': JSON.stringify(obj, null, '\t').replace(/\n/g, '\r\n\r\n'),
      },
      weird: {
        'package.json': JSON.stringify(obj, null, ' \t \t ').replace(/\n/g, '\r\n\r\n'),
      },
    },
  })
  const i = Symbol.for('indent')
  const n = Symbol.for('newline')
  t.equal((await rpj(`${path}/none/package.json`))[i], '')
  t.equal((await rpj(`${path}/none/package.json`))[n], '')
  t.equal((await rpj(`${path}/twospace/package.json`))[i], '  ')
  t.equal((await rpj(`${path}/twospace/package.json`))[n], '\n')
  t.equal((await rpj(`${path}/tab/package.json`))[i], '\t')
  t.equal((await rpj(`${path}/tab/package.json`))[n], '\n')
  t.equal((await rpj(`${path}/weird/package.json`))[i], ' \t \t ')
  t.equal((await rpj(`${path}/weird/package.json`))[n], '\n')
  t.equal((await rpj(`${path}/winEol/none/package.json`))[i], '')
  t.equal((await rpj(`${path}/winEol/none/package.json`))[n], '')
  t.equal((await rpj(`${path}/winEol/twospace/package.json`))[i], '  ')
  t.equal((await rpj(`${path}/winEol/twospace/package.json`))[n], '\r\n')
  t.equal((await rpj(`${path}/winEol/tab/package.json`))[i], '\t')
  t.equal((await rpj(`${path}/winEol/tab/package.json`))[n], '\r\n')
  t.equal((await rpj(`${path}/winEol/weird/package.json`))[i], ' \t \t ')
  t.equal((await rpj(`${path}/winEol/weird/package.json`))[n], '\r\n')
  t.equal((await rpj(`${path}/doubleSpaced/none/package.json`))[i], '')
  t.equal((await rpj(`${path}/doubleSpaced/none/package.json`))[n], '')
  t.equal((await rpj(`${path}/doubleSpaced/twospace/package.json`))[i], '  ')
  t.equal((await rpj(`${path}/doubleSpaced/twospace/package.json`))[n], '\n\n')
  t.equal((await rpj(`${path}/doubleSpaced/tab/package.json`))[i], '\t')
  t.equal((await rpj(`${path}/doubleSpaced/tab/package.json`))[n], '\n\n')
  t.equal((await rpj(`${path}/doubleSpaced/weird/package.json`))[i], ' \t \t ')
  t.equal((await rpj(`${path}/doubleSpaced/weird/package.json`))[n], '\n\n')
  t.equal((await rpj(`${path}/doubleWin/none/package.json`))[i], '')
  t.equal((await rpj(`${path}/doubleWin/none/package.json`))[n], '')
  t.equal((await rpj(`${path}/doubleWin/twospace/package.json`))[i], '  ')
  t.equal((await rpj(`${path}/doubleWin/twospace/package.json`))[n], '\r\n\r\n')
  t.equal((await rpj(`${path}/doubleWin/tab/package.json`))[i], '\t')
  t.equal((await rpj(`${path}/doubleWin/tab/package.json`))[n], '\r\n\r\n')
  t.equal((await rpj(`${path}/doubleWin/weird/package.json`))[i], ' \t \t ')
  t.equal((await rpj(`${path}/doubleWin/weird/package.json`))[n], '\r\n\r\n')
})

t.test('strip _fields', async t => {
  const path = t.testdir({
    'package.json': JSON.stringify({
      name: 'underscore',
      version: '1.2.3',
      _lodash: true,
    }),
  })
  t.strictSame(await rpj(`${path}/package.json`), {
    // add _id, this is the only one allowed
    _id: 'underscore@1.2.3',
    name: 'underscore',
    version: '1.2.3',
    // no _lodash
  })
})

t.test('load directories.bin', async t => {
  const { basename } = require('path')
  const fs = require('fs')
  const rpjMock = t.mock('../', {
    fs: {
      ...fs,
      lstat: (p, cb) => {
        if (basename(p) === 'staterror') {
          cb(new Error('stat error'))
        } else {
          return fs.lstat(p, cb)
        }
      },
      readdir: (p, cb) => {
        if (basename(p) === 'readdirerror') {
          cb(new Error('readdir error'))
        } else {
          return fs.readdir(p, cb)
        }
      },
    },
  })
  const path = t.testdir({
    'package.json': JSON.stringify({
      name: 'foo',
      version: '1.2.3',
      directories: {
        bin: 'bin',
      },
    }),
    bin: {
      foo: 'foo',
      bar: 'bar',
      '.ignorethis': 'should be ignored',
      linky: t.fixture('symlink', './foo'),
      subdir: {
        a: 'a',
        b: 'b',
        sub: {
          suba: 'dub',
        },
      },
      staterror: 'do not stat me please',
      readdirerror: {
        do: 'not',
        read: 'this',
        dir: 'please',
      },
    },
  })
  t.strictSame(await rpjMock(`${path}/package.json`), {
    name: 'foo',
    version: '1.2.3',
    _id: 'foo@1.2.3',
    directories: {
      bin: 'bin',
    },
    bin: {
      foo: 'bin/foo',
      bar: 'bin/bar',
      a: 'bin/subdir/a',
      b: 'bin/subdir/b',
      suba: 'bin/subdir/sub/suba',
    },
  })
})
