import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

const html = await readFile(new URL('../dist/index.html', import.meta.url), 'utf8')

test('친구 선택 문과 캐릭터 이미지가 있다', () => {
  assert.match(html, /박건후의 문 열기/)
  assert.match(html, /김시아의 문 열기/)
  assert.match(html, /assets\/geonhu\.png/)
  assert.match(html, /assets\/sia\.png/)
})

test('각 상황은 다섯 개 답변을 제공한다', () => {
  const answerGroups = [...html.matchAll(/answers: \[(.*?)\n\s*\]\}/gs)]
  assert.equal(answerGroups.length, 6)
  answerGroups.forEach(group => {
    assert.equal((group[1].match(/^\s*\[/gm) || []).length, 5)
  })
})

test('모바일 화면과 접근성 레이블을 포함한다', () => {
  assert.match(html, /width=device-width/)
  assert.match(html, /aria-live="polite"/)
  assert.match(html, /친구 선택으로 돌아가기/)
})
