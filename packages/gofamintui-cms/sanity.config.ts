import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { CodeIcon, RocketIcon } from "@sanity/icons";
import { schemaTypes } from "./schemaTypes";

/**
 * ⚠️  CRITICAL WARNING FOR DEVELOPERS ⚠️
 *
 * 🔥 READ THIS BEFORE MAKING ANY CHANGES 🔥
 *
 * There appears to be a potential issue with Sanity's multi-workspace deployment:
 *
 * 🚨 WORKSPACE ORDER MATTERS:
 *    • The FIRST workspace in the defineConfig array becomes the default in the CMS
 *    • Currently: PRODUCTION workspace is first (intentional for safety)
 *    • DO NOT reorder without understanding the implications
 *
 * 🔍 OBSERVED BEHAVIOR:
 *    • Works FLAWLESSLY in local development environment
 *    • Issues ONLY occur in the deployed/hosted Studio interface
 *    • Content from non-default workspaces may still exist in the content lake
 *    • You just won't be able to access/manage it through the hosted Studio
 *    • This could lead to "invisible" content that's hard to manage in production
 *
 * 💡 POSSIBLE CAUSES:
 *    • Could be a limitation of the free tier
 *    • Might be resolved in paid plans with better documentation
 *    • Limited community discussions found on this specific issue
 *
 * 📋 ACTION ITEMS FOR FUTURE DEVELOPERS:
 *    1. Test workspace switching thoroughly after any config changes
 *    2. Verify content accessibility in both workspaces
 *    3. Document any additional quirks you discover
 *    4. Consider upgrading to paid plan for better support/docs
 *
 * 💬 If you encounter this issue or find a solution, please update this comment and create a discussion on the github
 */

export default defineConfig([
  {
    name: "production-workspace",
    title: "GOFAMINT UI - Production",
    basePath: "/production",
    subtitle: "Live content",
    icon: RocketIcon,
    projectId: "276it5za",
    dataset: "production",
    plugins: [structureTool(), visionTool()],
    schema: {
      types: schemaTypes,
    },
  },
  {
    name: "development-workspace",
    title: "GOFAMINT UI - Development",
    basePath: "/development",
    subtitle: "Development workspace",
    icon: CodeIcon,
    projectId: "276it5za",
    dataset: "development",
    plugins: [structureTool(), visionTool()],
    schema: {
      types: schemaTypes,
    },
  },
]);
