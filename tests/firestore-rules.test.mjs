import { test, before, after } from 'node:test'
import { readFileSync } from 'node:fs'
import { initializeTestEnvironment, assertFails, assertSucceeds } from '@firebase/rules-unit-testing'
import { doc, setDoc, updateDoc } from 'firebase/firestore'

let env

before(async () => {
  env = await initializeTestEnvironment({
    projectId: 'demo-usic',
    firestore: { rules: readFileSync('firestore.rules', 'utf8') },
  })
})

after(() => env.cleanup())

const seed = (fn) => env.withSecurityRulesDisabled((ctx) => fn(ctx.firestore()))

const as = (uid, token) => env.authenticatedContext(uid, token).firestore()

const validComment = (uid) => ({
  postId: 'p1',
  content: 'hi',
  author: 'Name',
  authorId: uid,
  likes: 0,
  createdAt: new Date(),
  updatedAt: new Date(),
})

async function reset() {
  await env.clearFirestore()
  await seed(async (db) => {
    await setDoc(doc(db, 'admins/admin'), { email: 'a@x' })
    await setDoc(doc(db, 'admins/admin2'), { email: 'b@x' })
    await setDoc(doc(db, 'users/admin2'), { restricted: true })
    await setDoc(doc(db, 'users/flagged'), { restricted: true })
    await setDoc(doc(db, 'users/legacy'), { displayName: 'no restricted field' })
    await setDoc(doc(db, 'approved_posts/p1'), { title: 't', likes: 0 })
    await setDoc(doc(db, 'comments/c1'), { authorId: 'author', postId: 'p1', content: 'hi', likes: 0 })
  })
}

test('unrestricted admin can edit a post', async () => {
  await reset()
  await assertSucceeds(updateDoc(doc(as('admin'), 'approved_posts/p1'), { title: 'new' }))
})

test('restricted admin (db flag) cannot edit a post', async () => {
  await reset()
  await assertFails(updateDoc(doc(as('admin2'), 'approved_posts/p1'), { title: 'new' }))
})

test('restricted admin (claim) cannot edit a post', async () => {
  await reset()
  await assertFails(updateDoc(doc(as('admin', { restricted: true }), 'approved_posts/p1'), { title: 'new' }))
})

test('user without a user doc can like', async () => {
  await reset()
  await assertSucceeds(updateDoc(doc(as('nodoc'), 'approved_posts/p1'), { likes: 1 }))
})

test('legacy user doc lacking restricted can like', async () => {
  await reset()
  await assertSucceeds(updateDoc(doc(as('legacy'), 'approved_posts/p1'), { likes: 1 }))
})

test('flagged user cannot like', async () => {
  await reset()
  await assertFails(updateDoc(doc(as('flagged'), 'approved_posts/p1'), { likes: 1 }))
})

test('comment author can edit content with a valid string', async () => {
  await reset()
  await assertSucceeds(updateDoc(doc(as('author'), 'comments/c1'), { content: 'edited' }))
})

test('comment author cannot set content to a non-string', async () => {
  await reset()
  await assertFails(updateDoc(doc(as('author'), 'comments/c1'), { content: { x: 1 } }))
})

test('comment author cannot set empty or oversized content', async () => {
  await reset()
  await assertFails(updateDoc(doc(as('author'), 'comments/c1'), { content: '' }))
  await assertFails(updateDoc(doc(as('author'), 'comments/c1'), { content: 'x'.repeat(10001) }))
})

test('comment create accepts the browser schema', async () => {
  await reset()
  await assertSucceeds(setDoc(doc(as('u1'), 'comments/ok'), validComment('u1')))
})

test('comment create rejects a non-string author', async () => {
  await reset()
  await assertFails(setDoc(doc(as('u1'), 'comments/bad-author'), {
    ...validComment('u1'),
    author: { name: 'obj' },
  }))
})

test('comment create rejects non-timestamp createdAt or updatedAt', async () => {
  await reset()
  await assertFails(setDoc(doc(as('u1'), 'comments/bad-created'), {
    ...validComment('u1'),
    createdAt: 'now',
  }))
  await assertFails(setDoc(doc(as('u1'), 'comments/bad-updated'), {
    ...validComment('u1'),
    updatedAt: 'now',
  }))
})
