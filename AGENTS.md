<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

When building UI and components, check if you can re-use components from _components/ui/ folder instead of building completely from scratch. If the desired component is not available in the folder, you can install the UI component from either of following places:

- ShadcnUI: (Read ui.shadcn.com/llms.txt) for list of component. Use this default registry to install static base ui components. Installation command: `pnpm dlx shadcn@latest add component-name`

- KokonutUI: (Read https://kokonutui.com/llms.txt) for list of components. Use this registry if you want more orchestrated, tailored for specific purposes components. Installation command: `pnpm dlx shadcn@latest add @kokonutui/profile-dropdown`. Note: The kokonutui installs the component in src/components/kokonutui/ folder and we cannot change that. After installing component from this registry, move the component inside _components/kokonutui/ and fix the linting errors as it is expected to have some ts and eslint errors. Also kokonutui components seem to install icons from lucide-react package, you can change the icons to use from phosphor instead. And make sure to import icons ending with "Icon" from @phosphor-icons/react package. For example, if you want to use "User" icon, import it as `import { UserIcon } from "@phosphor-icons/react";` instead of `import { User } from "@phosphor-icons/react";`

If you ever need access to API documentation for the backend, it is available at `NEXT_PUBLIC_API_URL` environment variable. This route lists all available endpoints, their path and url, then to access the documentation for a specific endpoint, you can use the url provided in the list(must be expanded from NEXT_PUBLIC_API_URL) to access the documentation for that endpoint.
<!-- END:nextjs-agent-rules -->
