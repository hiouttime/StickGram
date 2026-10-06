import assert from 'node:assert/strict'
import { readdirSync, readFileSync, existsSync } from 'node:fs'
import { dirname, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { test } from 'node:test'
import ts from 'typescript'

const root = fileURLToPath(new URL('../../src/', import.meta.url))
function files(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = resolve(directory, entry.name)
    return entry.isDirectory() ? files(path) : /\.(ts|vue)$/.test(path) ? [path] : []
  })
}
const sources = files(root)
function imports(path: string) {
  let text = readFileSync(path, 'utf8')
  if (path.endsWith('.vue'))
    text = [...text.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)]
      .map((match) => match[1])
      .join('\n')
  const source = ts.createSourceFile(path, text, ts.ScriptTarget.Latest, true)
  const imports: { name: string; eager: boolean }[] = []
  function visit(node: ts.Node) {
    if (ts.isImportDeclaration(node) && ts.isStringLiteral(node.moduleSpecifier)) {
      imports.push({ name: node.moduleSpecifier.text, eager: !node.importClause?.isTypeOnly })
    }
    if (
      ts.isCallExpression(node) &&
      node.expression.kind === ts.SyntaxKind.ImportKeyword &&
      ts.isStringLiteral(node.arguments[0])
    ) {
      imports.push({ name: node.arguments[0].text, eager: false })
    }
    ts.forEachChild(node, visit)
  }
  visit(source)
  return imports.map((entry) => {
    if (!entry.name.startsWith('.') && !entry.name.startsWith('@/'))
      return { ...entry, target: undefined }
    const base = entry.name.startsWith('@/')
      ? resolve(root, entry.name.slice(2))
      : resolve(dirname(path), entry.name)
    const target = [base, `${base}.ts`, `${base}.vue`, `${base}/index.ts`].find(existsSync)
    assert.ok(target, `${relative(root, path)} imports a missing file: ${entry.name}`)
    return { ...entry, target }
  })
}

test('every source import resolves and obeys the module boundaries', () => {
  for (const path of sources) {
    const source = relative(root, path),
      layer = source.split('/')[0]
    for (const entry of imports(path)) {
      const target = entry.target && relative(root, entry.target)
      if (layer === 'core')
        assert.ok(
          target?.startsWith('core/'),
          `${source} must remain platform-independent: ${entry.name}`,
        )
      if (layer === 'shared' && target)
        assert.match(target, /^(shared|core)\//, `${source} depends on a higher layer: ${target}`)
      if (layer === 'infrastructure' && target)
        assert.match(
          target,
          /^(infrastructure|core|shared)\//,
          `${source} knows application composition: ${target}`,
        )
      if (layer === 'features' && target?.startsWith('features/')) {
        assert.ok(
          target === 'features/types.ts' || target.split('/')[1] === source.split('/')[1],
          `${source} reaches into another feature: ${target}`,
        )
      }
      if (
        layer === 'application' &&
        target?.startsWith('features/') &&
        target !== 'features/types.ts'
      ) {
        assert.ok(
          source === 'application/catalog.ts' && target.endsWith('/module.ts'),
          `${source} bypasses the feature registration boundary: ${target}`,
        )
      }
    }
  }
})

test('eager source imports do not form runtime dependency cycles', () => {
  const visited = new Set<string>(),
    stack = new Set<string>()
  function visit(path: string) {
    assert.ok(!stack.has(path), `Runtime import cycle includes ${relative(root, path)}`)
    if (visited.has(path)) return
    stack.add(path)
    for (const entry of imports(path))
      if (entry.eager && entry.target && /\.(ts|vue)$/.test(entry.target)) visit(entry.target)
    stack.delete(path)
    visited.add(path)
  }
  sources.forEach(visit)
})
