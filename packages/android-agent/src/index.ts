import { AgentRegistry } from '@tapflowio/agent-core'
import type { AgentConnectOpts } from '@tapflowio/agent-core'
import { AndroidAgent } from './AndroidAgent.js'
import { getAdbPath } from './sdk.js'

export { AndroidAgent } from './AndroidAgent.js'
export type { AndroidAgentOptions } from './AndroidAgent.js'
export { AdbWrapper } from './AdbWrapper.js'
export { EmulatorLauncher } from './EmulatorLauncher.js'
export { AndroidTouchHelper } from './AndroidTouchHelper.js'
export { ScrcpySession } from './scrcpy/ScrcpySession.js'
export { ScrcpyControl } from './scrcpy/ScrcpyControl.js'
export { ScrcpyVideo } from './scrcpy/ScrcpyVideo.js'

// The same lookup the agent runs adb through (SDK candidates, then PATH) rather than `which adb`:
// `which` does not exist on Windows, and an SDK found via ANDROID_HOME alone would otherwise pass
// every later lookup yet leave the platform unregistered.
function hasAdb(): boolean {
  try {
    return getAdbPath().length > 0
  } catch {
    return false
  }
}

AgentRegistry.register('android', AndroidAgent, {
  canRun: hasAdb,
  connect: async (relayUrl: string, opts?: AgentConnectOpts) => {
    const agent = new AndroidAgent({ deviceFilter: opts?.deviceFilter, token: opts?.token, lean: opts?.lean })
    await agent.connect(relayUrl)
    return agent
  },
})
