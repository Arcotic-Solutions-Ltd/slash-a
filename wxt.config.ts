import { defineConfig } from "wxt"
import react from "@vitejs/plugin-react"
import topLevelAwait from "vite-plugin-top-level-await"

const chromeMV3Permissions = [
  "storage",
  "sidePanel",
  "activeTab",
  "scripting",
  "declarativeNetRequest",
  "action",
  "unlimitedStorage",
  "contextMenus",
  "tts",
  "notifications"
]

const firefoxMV2Permissions = [
  "storage",
  "activeTab",
  "scripting",
  "unlimitedStorage",
  "contextMenus",
  "webRequest",
  "webRequestBlocking",
  "notifications",
  "http://*/*",
  "https://*/*",
  "file://*/*"
]

// See https://wxt.dev/api/config.html
export default defineConfig({
  vite: () => ({
    plugins: [
      react(),
      topLevelAwait({
        promiseExportName: "__tla",
        promiseImportName: (i) => `__tla_${i}`
      }) as any
    ],
    build: {
      rollupOptions: {
        external: ["langchain", "@langchain/community"]
      }
    }
  }),
  entrypointsDir:
    process.env.TARGET === "firefox" ? "entries-firefox" : "entries",
  srcDir: "src",
  outDir: "build",

  manifest: {
    version: "1.0.1",
    name:
      process.env.TARGET === "firefox"
        ? "Slash Engine - Web based interface for local AI models."
        : "__MSG_extName__",
    description: "__MSG_extDescription__",
    default_locale: "en",
    action: {},
    author: "Arcotic-Solutions-Ltd",
    browser_specific_settings:
      process.env.TARGET === "firefox"
        ? {
          gecko: {
            id: "slash-engine@Arcotic-Solutions-Ltd"
          }
        }
        : undefined,
    host_permissions:
      process.env.TARGET !== "firefox"
        ? ["http://*/*", "https://*/*", "file://*/*"]
        : undefined,
    commands: {
      _execute_action: {
        description: "Open the Web UI",
        suggested_key: {
          default: "Ctrl+Shift+L"
        }
      },
      execute_side_panel: {
        description: "Open the side panel",
        suggested_key: {
          default: "Ctrl+Shift+Y"
        }
      }
    },
    content_security_policy:
      process.env.TARGET !== "firefox" ?
        {
          extension_pages:
            "script-src 'self' 'wasm-unsafe-eval'; object-src 'self';"
        } :  "script-src 'self' 'wasm-unsafe-eval' blob:; object-src 'self'; worker-src 'self' blob:;",
    permissions:
      process.env.TARGET === "firefox"
        ? firefoxMV2Permissions
        : chromeMV3Permissions
  }
}) as any