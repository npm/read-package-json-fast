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
          bar: [ 'baz' ],
          baz: { bar: { foo: 'barbaz' } },
        },
      })
    }) + '/package.json'), {
      scripts: {
        foo: 'bar',
        bar: undefined,
        baz: undefined,
      }
    }))
})

t.test('convert funding string to object', t =>
  t.resolveMatch(rpj(t.testdir({
    'package.json': JSON.stringify({ funding: 'hello' })
  }) + '/package.json'), { funding: { url: 'hello' } }))

t.test('cleanup bins', async t => {
  t.test('handle string when a name is set', t =>
    t.resolveMatch(rpj(t.testdir({
      'package.json': JSON.stringify({ name: 'x', bin: 'y' }),
    }) + '/package.json'), { bin: { x: 'y' }}))

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
      }}),
    }) + '/package.json'), { bin: {x:'y', y: undefined, z: undefined }}))
})

t.test('fold in optional deps to regular deps', async t => {
  t.test('choose optional deps in conflict', t =>
    t.resolveMatch(rpj(t.testdir({
      'package.json': JSON.stringify({
        optionalDependencies: {
          whowins: '1.2.3-optional'
        },
        dependencies: {
          whowins: '1.2.3-prod'
        }
      }),
    }) + '/package.json'), {
      optionalDependencies: {
        whowins: '1.2.3-optional'
      },
      dependencies: {
        whowins: '1.2.3-optional'
      }
    }))

  t.test('create regular deps if only optional specified', t =>
    t.resolveMatch(rpj(t.testdir({
      'package.json': JSON.stringify({
        optionalDependencies: {
          whowins: '1.2.3-optional'
        },
      }),
    }) + '/package.json'), {
      optionalDependencies: {
        whowins: '1.2.3-optional'
      },
      dependencies: {
        whowins: '1.2.3-optional'
      }
    }))
})

t.test('set _id if name and version set', t =>
  t.resolveMatch(rpj(t.testdir({
    'package.json': JSON.stringify({name:'a', version: '1.2.3'}),
  }) + '/package.json'), { _id: 'a@1.2.3' }))

t.test('exports the normalize function', async t =>
  t.same(rpj.normalize({ bundledDependencies: true, dependencies: {a:'1'}}),
    { bundleDependencies: ['a'], dependencies: {a:'1'}}))
