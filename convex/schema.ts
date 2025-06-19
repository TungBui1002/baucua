import { defineSchema } from "convex/server";
import { authTables } from "@convex-dev/auth/server";

// Empty application tables since we're using cookies for storage
const applicationTables = {};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
