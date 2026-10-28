import 'fake-indexeddb/auto'
import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'

afterEach(() => cleanup())

// O jsdom não implementa rolagem.
window.scrollTo = () => undefined

// O jsdom não implementa Canvas/Lottie. Mock leve para testes.
vi.mock('lottie-react', () => ({
  default: () => null,
  Lottie: () => null,
}))
