import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

// Define the request body structure
interface CodeExecutionRequest {
    language: string;
    version?: string;
    files: { name: string; content: string }[];
    args?: string[];
    compile_timeout?: number;
    run_timeout?: number;
    compile_memory_limit?: number;
    run_memory_limit?: number;
}

// Handle the POST request
export async function POST(req: NextRequest) {
    try {
        const body: CodeExecutionRequest = await req.json();
        const { language, version = "latest", files} = body;

        if (!language || !files || files.length === 0) {
            return NextResponse.json({ error: "Language and code are required" }, { status: 400 });
        }

        // Piston API for code execution
        const PISTON_API_URL = "https://emkc.org/api/v2/piston/execute";

        // Payload for the Piston API
        const payload = {
            language,
            version,
            files,
            args: ["1", "2", "3"],
            compile_timeout: 10000,
            run_timeout: 3000,
            compile_memory_limit: -1,
            run_memory_limit: -1
        };

        // Execute code using Piston API
        const response = await axios.post(PISTON_API_URL, payload, {
            headers: { "Content-Type": "application/json" },
        });

        return NextResponse.json({ output: response.data.run.output }, { status: 200 });
    } catch (err: unknown) {
        if (err instanceof Error) {
            return NextResponse.json({ error: "Code execution failed", details: err.message }, { status: 500 });
        }
        return NextResponse.json({ error: "An unknown error occurred" }, { status: 500 });
    }
}
