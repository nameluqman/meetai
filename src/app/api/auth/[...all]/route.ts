export const runtime = 'nodejs'; // Ensure this is not 'edge'
export const dynamic = 'force-dynamic';

import { auth } from "@/lib/auth"; // path to your auth file
import { toNextJsHandler } from "better-auth/next-js";

export const { POST, GET } = toNextJsHandler(auth);