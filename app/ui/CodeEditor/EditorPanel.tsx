"use client";
import React, { useState } from "react";
import axios, { AxiosError } from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const languageVersions: Record<string, string> = {
    javascript: "1.32.3",
    python: "3.10.0",
    cpp: "10.2.0",
    java: "15.0.2",
};

const getDefaultCode = (language: string) =>
    language === "javascript"
        ? `console.log("Hello, JavaScript!");`
        : language === "python"
        ? `print("Hello, Python!")`
        : language === "cpp"
        ? `#include <iostream>\nusing namespace std;\nint main() {\n    cout << "Hello, C++!" << endl;\n    return 0;\n}`
        : language === "java"
        ? `public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, Java!");\n    }\n}`
        : "";

const EditorPanel: React.FC = () => {
    const [language, setLanguage] = useState("javascript");
    const [code, setCode] = useState(getDefaultCode("javascript"));
    const [version, setVersion] = useState(languageVersions["javascript"]);
    const [output, setOutput] = useState("Output will be shown here...");

    const getCodeOutput = async () => {
        try {
            const response = await axios.post(`/api/auth/postCode`, {
                language,
                version,
                files: [
                    {
                        name: `code.${language}`,
                        content: code,
                    }
                ]
            });

            setOutput(response.data.output || "No output returned.");
        } catch (error) {
            if (error instanceof AxiosError) {
                setOutput(`Error: ${error.response?.data.message || "Failed to execute code."}`);
            } else {
                setOutput("An unexpected error occurred.");
            }
        }
    };

    const handleRunCode = () => {
        if (!code.trim()) {
            setOutput("Please enter some code before running.");
            return;
        }
        setOutput(`Running ${language} code...`);
        getCodeOutput();
    };

    const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedLanguage = e.target.value;
        setLanguage(selectedLanguage);
        setCode(getDefaultCode(selectedLanguage));
        setVersion(languageVersions[selectedLanguage]);
    };

    return (
        <div className="container mt-4">
            <div className="row align-items-center mb-3">
                <div className="col-md-6 text-start">
                    <select className="form-select w-50" value={language} onChange={handleLanguageChange}>
                        <option value="javascript">JavaScript</option>
                        <option value="python">Python</option>
                        <option value="cpp">C++</option>
                        <option value="java">Java</option>
                    </select>
                </div>
                <div className="col-md-6 text-end">
                    <button className="btn btn-success" onClick={handleRunCode}>
                        <i className="bi bi-play-fill"></i> Run
                    </button>
                </div>
            </div>

            <div className="row">
                <div className="col-md-6">
                    <label className="form-label">Code Editor</label>
                    <textarea
                        className="form-control bg-dark text-white p-3"
                        rows={12}
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        placeholder={`Write your ${language} code here...`}
                    />
                </div>

                <div className="col-md-6">
                    <label className="form-label">Output</label>
                    <div className="border p-3 bg-light" style={{ minHeight: "250px" }}>
                        {output}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditorPanel;
