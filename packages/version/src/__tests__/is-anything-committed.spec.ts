import execa from 'execa';
import { execSync } from '@lerna-lite/core';
import { isAnythingCommitted } from '../lib/is-anything-committed';

import helpers from '@lerna-test/helpers';
const initFixture = helpers.initFixtureFactory(__dirname);

jest.mock('@lerna-lite/core', () => {
  const { execSync } = jest.requireActual('@lerna-lite/core');
  return {
    __esModule: true,
    execSync: jest.fn(execSync),
  };
});

test('isAnythingCommitted', async () => {
  const cwd = await initFixture('root-manifest-only');

  expect(isAnythingCommitted({ cwd })).toBe(true);
});

test('dry-run of isAnythingCommitted', async () => {
  const cwd = await initFixture('root-manifest-only');

  expect(isAnythingCommitted({ cwd }, true)).toBe(true);
  expect(execSync).toHaveBeenCalledWith(
    'git',
    ['rev-list', '--count', '--all', '--max-count=1'],
    { cwd: expect.any(String) },
    true
  );
});

test('isAnythingCommitted without and with a commit', async () => {
  const cwd = await initFixture('root-manifest-only', false);

  expect(isAnythingCommitted({ cwd })).toBe(false);

  await execa('git', ['commit', '--allow-empty', '-m', 'change'], { cwd });

  expect(isAnythingCommitted({ cwd })).toBe(true);
});
