import { promises as fs } from "node:fs";
import path from "node:path";

import { rimraf } from "rimraf";
import type { Registry } from "shadcn/registry";
import { registrySchema } from "shadcn/registry";


const coreRegistry: Registry = {
  name: "gowtham",
  homepage: "https://gowthamdev.me/components",
  items: [
    {
      name: "utils",
      type: "registry:lib",
      title: "Utility Functions",
      author: "gowtham <gowtham@gowthamdev.me>",
      dependencies: ["clsx", "tailwind-merge"],
      files: [
        {
          path: "src/lib/utils.ts",
          type: "registry:lib",
        },
      ],
    },
    {
      name: "use-controllable-state",
      type: "registry:hook",
      title: "Controllable State Hook",
      files: [
        {
          path: "src/hooks/use-layout-effect.tsx",
          type: "registry:hook",
        },
        {
          path: "src/hooks/use-controllable-state.ts",
          type: "registry:hook",
        },
      ],
    },
    {
      name: "theme-switcher",
      type: "registry:component",
      description:
        "A theme switcher component for Next.js apps with next-themes and Tailwind CSS, supporting system, light, and dark modes.",
      title: "Theme Switcher",
      author: "gowtham <gowtham@gowthamdev.me>",
      dependencies: ["next-themes", "lucide-react", "motion"],
      registryDependencies: ["<registryBaseUrl>/utils.json"],
      files: [
        {
          path: "theme-switcher/theme-switcher.tsx",
          type: "registry:component",
        },
      ],
      docs: "https://gowthamdev.me/components/theme-switcher-component",
    },
    {
      name: "flip-sentences",
      type: "registry:component",
      title: "Flip Sentences",
      author: "gowtham <gowtham@gowthamdev.me>",
      dependencies: ["motion"],
      registryDependencies: ["<registryBaseUrl>/utils.json"],
      files: [
        {
          path: "flip-sentences/flip-sentences.tsx",
          type: "registry:component",
        },
      ],
    },
    {
      name: "apple-hello-effect",
      type: "registry:component",
      description:
        "Create a Xin chào and Hello writing effect inspired by Apple using Motion for React.",
      title: "Apple Hello Effect",
      author: "gowtham <gowtham@gowthamdev.me>",
      dependencies: ["motion"],
      registryDependencies: ["<registryBaseUrl>/utils.json"],
      files: [
        {
          path: "apple-hello-effect/apple-hello-effect.tsx",
          type: "registry:component",
        },
      ],
      docs: "https://gowthamdev.me/components/writing-effect-inspired-by-apple",
    },
    {
      name: "wheel-picker",
      type: "registry:component",
      description:
        "iOS-like wheel picker for React with smooth inertia scrolling and infinite loop support.",
      title: "Wheel Picker",
      author: "gowtham <gowtham@gowthamdev.me>",
      dependencies: ["@ncdai/react-wheel-picker"],
      registryDependencies: ["<registryBaseUrl>/utils.json"],
      files: [
        {
          path: "wheel-picker/wheel-picker.tsx",
          type: "registry:component",
        },
      ],
      docs: "https://gowthamdev.me/components/react-wheel-picker",
    },
    {
      name: "work-experience",
      type: "registry:component",
      description:
        "Displays a list of work experiences with role details and durations.",
      title: "Work Experience",
      author: "gowtham <gowtham@gowthamdev.me>",
      dependencies: ["react-markdown", "lucide-react"],
      devDependencies: ["@tailwindcss/typography"],
      registryDependencies: [
        "<registryBaseUrl>/utils.json",
        "collapsible",
        "separator",
      ],
      files: [
        {
          path: "work-experience/work-experience.tsx",
          type: "registry:component",
        },
      ],
      docs: "https://gowthamdev.me/components/work-experience-component",
    },
    {
      name: "apple-hello-effect-vi-demo",
      type: "registry:example",
      registryDependencies: ["<registryBaseUrl>/apple-hello-effect.json"],
      files: [
        {
          path: "examples/apple-hello-effect-vi-demo.tsx",
          type: "registry:example",
        },
      ],
    },
    {
      name: "apple-hello-effect-en-demo",
      type: "registry:example",
      registryDependencies: ["<registryBaseUrl>/apple-hello-effect.json"],
      files: [
        {
          path: "examples/apple-hello-effect-en-demo.tsx",
          type: "registry:example",
        },
      ],
    },
    {
      name: "theme-switcher-demo",
      type: "registry:example",
      registryDependencies: ["<registryBaseUrl>/theme-switcher.json"],
      files: [
        {
          path: "examples/theme-switcher-demo.tsx",
          type: "registry:example",
        },
      ],
    },
    {
      name: "wheel-picker-demo",
      type: "registry:example",
      registryDependencies: ["<registryBaseUrl>/wheel-picker.json"],
      files: [
        {
          path: "examples/wheel-picker-demo.tsx",
          type: "registry:example",
        },
      ],
    },
    {
      name: "wheel-picker-form-demo",
      type: "registry:example",
      registryDependencies: ["<registryBaseUrl>/wheel-picker.json", "form"],
      files: [
        {
          path: "examples/wheel-picker-form-demo.tsx",
          type: "registry:example",
        },
      ],
    },
    {
      name: "work-experience-demo",
      type: "registry:example",
      registryDependencies: ["<registryBaseUrl>/work-experience.json"],
      files: [
        {
          path: "examples/work-experience-demo.tsx",
          type: "registry:example",
        },
      ],
    },
  ],
};

const REGISTRY_PATH = path.join(process.cwd(), "src/__registry__");

/**
 * Build src/__registry__/registry.autogenerated.json, src/__registry__/index.tsx
 * Thanks @shadcn/ui
 */
export async function buildRegistry(registry: Registry) {
  let index = `/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
// @ts-nocheck
// This file is autogenerated by scripts/build-registry.ts
// Do not edit this file directly.

import React from "react";

export const Index: Record<string, any> = {`;
  for (const item of registry.items) {
    if (!Array.isArray(item.files) || !item.files?.length) {
      continue;
    }

    const componentPath = `@/registry/${item.files[0].path}`;

    index += `
  "${item.name}": {
    name: "${item.name}",
    description: "${item.description ?? ""}",
    type: "${item.type}",
    files: [${item.files.map((file) => {
      const filePath = `src/registry/${file.path}`;
      return `{
      path: "${filePath}",
      type: "${file.type}",
    }`;
    })}],${
      item.type === "registry:example"
        ? `
    component: React.lazy(() => import("${componentPath}")),`
        : ""
    }
  },`;
  }

  index += `
}`;

  // Build /src/__registry__/registry.autogenerated.json
  let registryJSON = JSON.stringify(
    {
      $schema: "https://ui.shadcn.com/schema/registry.json",
      name: "gowtham",
      homepage: "https://gowthamdev.me",
      items: registry.items
        .filter((item) => item.type !== "registry:example")
        .map((item) => {
          return {
            ...item,
            files:
              item.files?.map((file) => {
                if (file.path.startsWith("src/")) {
                  return file;
                }

                return {
                  ...file,
                  path: `src/registry/${file.path}`,
                };
              }) ?? [],
          };
        }),
    },
    null,
    2
  );

  const registryBaseUrl = "https://gowthamdev.me/r";
  const registryBaseUrlRegex = /<registryBaseUrl>/g;
  registryJSON = registryJSON.replace(registryBaseUrlRegex, registryBaseUrl);

  rimraf.sync(path.join(REGISTRY_PATH, "registry.autogenerated.json"));
  await fs.writeFile(
    path.join(REGISTRY_PATH, "registry.autogenerated.json"),
    registryJSON,
    "utf8"
  );

  // Build /src/__registry__/index.tsx
  rimraf.sync(path.join(REGISTRY_PATH, "index.tsx"));
  await fs.writeFile(path.join(REGISTRY_PATH, "index.tsx"), index, "utf8");
}

try {
  console.log("💽 Building registry...");

  const result = registrySchema.safeParse(coreRegistry);

  if (!result.success) {
    console.error(result.error);
    process.exit(1);
  }

  await buildRegistry(result.data);

  console.log("✅ Done!");
} catch (error) {
  console.error(error);
  process.exit(1);
}
