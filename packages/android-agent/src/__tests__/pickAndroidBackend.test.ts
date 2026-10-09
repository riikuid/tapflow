import { describe, it, expect } from 'vitest'
import { pickAndroidBackend } from '../AndroidAgent'

describe('pickAndroidBackend', () => {
  it('defaults emulators (emulator-* serial) to the gRPC host-encode path', () => {
    expect(pickAndroidBackend('emulator-5554', {}, 'darwin')).toBe('grpc')
  })

  it('defaults real devices to scrcpy', () => {
    expect(pickAndroidBackend('39021FDH200ABC', {}, 'darwin')).toBe('scrcpy')
  })

  it('honors TAPFLOW_ANDROID_BACKEND=scrcpy on an emulator', () => {
    expect(pickAndroidBackend('emulator-5554', { TAPFLOW_ANDROID_BACKEND: 'scrcpy' })).toBe('scrcpy')
  })

  it('honors TAPFLOW_ANDROID_BACKEND=grpc on a real device', () => {
    expect(pickAndroidBackend('39021FDH200ABC', { TAPFLOW_ANDROID_BACKEND: 'grpc' })).toBe('grpc')
  })

  it('defaults emulators to scrcpy off macOS (the host encoder is a macOS binary)', () => {
    expect(pickAndroidBackend('emulator-5554', {}, 'win32')).toBe('scrcpy')
    expect(pickAndroidBackend('emulator-5554', {}, 'linux')).toBe('scrcpy')
  })
})
