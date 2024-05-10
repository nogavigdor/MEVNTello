import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/vue'
import { afterEach } from 'vitest'

//cleanup the dom after each test
afterEach(() => {
  cleanup()
})
