import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Editor from "@monaco-editor/react";

/*
  Advanced UI without Tailwind: uses Monaco editor and framer-motion.
  Make sure to `npm install @monaco-editor/react framer-motion`
*/

export default function App() {
  const [code, setCode] = useState("a = 5\nb = a * 2\nprint(b)");
  const [result, setResult] = useState(null);
  const [tab, setTab] = useState("flow");

  async function run() {
    try {
      const res = await fetch("https://backend-1-9xla.onrender.com/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();
      setResult(data);
      setTimeout(() => renderMermaid(data.mermaid), 300);
    } catch (e) {
      console.error(e);
      setResult({ error: String(e) });
    }
  }

  function renderMermaid(m) {
    if (!m) return;
    import("https://unpkg.com/mermaid@10/dist/mermaid.esm.min.mjs").then(
      (mermaid) => {
        try {
          mermaid.default.initialize({ startOnLoad: false, theme: "dark" });
          const el = document.getElementById("mermaidDiv");
          el.innerHTML = `<div class="mermaid">${m}</div>`;
          mermaid.default.run();
        } catch (e) {
          console.error(e);
        }
      }
    );
  }

  useEffect(() => {
    renderMermaid(result?.mermaid);
  }, [result]);

  const containerStyle = {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    background:
      "linear-gradient(135deg, #071024 0%, #0b1320 40%, #0f172a 100%)",
    color: "#e6eef8",
    fontFamily: "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
  };

  const mainStyle = {
    display: "flex",
    gap: 20,
    padding: 24,
    flex: 1,
  };

  const leftStyle = {
    width: "36%",
    display: "flex",
    flexDirection: "column",
    background: "#071022aa",
    borderRadius: 12,
    padding: 16,
    boxShadow: "0 6px 18px rgba(0,0,0,0.6)",
    border: "1px solid rgba(255,255,255,0.04)",
  };

  const rightStyle = {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    background: "#07102266",
    borderRadius: 12,
    padding: 16,
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.02)",
    border: "1px solid rgba(255,255,255,0.03)",
  };

  const tabBtn = (active) => ({
    padding: "8px 14px",
    borderRadius: 8,
    marginRight: 8,
    border: "none",
    cursor: "pointer",
    background: active ? "#0b63d6" : "#0b1624",
    color: active ? "white" : "#bcd4ff",
    boxShadow: active ? "0 6px 16px rgba(11,99,214,0.18)" : "none",
  });

  return (
    <div style={containerStyle}>
      <motion.header
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          padding: 24,
          textAlign: "center",
          borderBottom: "1px solid rgba(255,255,255,0.03)",
        }}
      >
        <h1 style={{ margin: 0, fontSize: 36, color: "#6ec0ff" }}>
          CodeAssistX
        </h1>
        <div style={{ color: "#9fbbe6", marginTop: 6 }}>
          AI-Powered Code Analysis & Visualization
        </div>
      </motion.header>

      <main style={mainStyle}>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          style={leftStyle}
        >
          <h3 style={{ marginTop: 0, color: "#9ad0ff" }}>Code</h3>

          <div style={{ flex: 1, borderRadius: 8, overflow: "hidden" }}>
            <Editor
              height="56vh"
              defaultLanguage="python"
              value={code}
              theme="vs-dark"
              onChange={(v) => setCode(v)}
              options={{
                fontSize: 13,
                minimap: { enabled: false },
                scrollbar: { vertical: "hidden" },
              }}
            />
          </div>

          <button
            onClick={run}
            style={{
              marginTop: 12,
              padding: "10px 14px",
              background: "#0b63d6",
              color: "white",
              border: "none",
              borderRadius: 10,
              cursor: "pointer",
              boxShadow: "0 8px 22px rgba(11,99,214,0.16)",
            }}
          >
            Run Analysis
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          style={rightStyle}
        >
          <div style={{ marginBottom: 12, display: "flex", alignItems: "center" }}>
            <div style={{ display: "flex", flex: 1 }}>
              <button style={tabBtn(tab === "flow")} onClick={() => setTab("flow")}>
                Flowchart
              </button>
              <button style={tabBtn(tab === "ast")} onClick={() => setTab("ast")}>
                AST
              </button>
              <button style={tabBtn(tab === "trace")} onClick={() => setTab("trace")}>
                Trace
              </button>
              <button style={tabBtn(tab === "explain")} onClick={() => setTab("explain")}>
                Explain
              </button>
            </div>
          </div>

          <div style={{ flex: 1, borderRadius: 8, padding: 12, background: "#031027" }}>
            {tab === "flow" && (
              <div id="mermaidDiv" style={{ width: "100%", height: "100%", overflow: "auto" }} />
            )}

            {tab === "ast" && (
              <pre style={{ color: "#9ed0ff", fontSize: 13 }}>
                {JSON.stringify(result?.ast, null, 2) || "No result yet"}
              </pre>
            )}

            {tab === "trace" && (
              <pre style={{ color: "#9ed0ff", fontSize: 13 }}>
                {JSON.stringify(result?.trace, null, 2) || "No trace yet"}
              </pre>
            )}

            {tab === "explain" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                { (result?.explanation || "No explanation yet").split("\n").map((line, i) => (
                  <div key={i} style={{
                    background: "#06203b",
                    borderRadius: 12,
                    padding: 12,
                    color: "#cfe9ff",
                    boxShadow: "0 6px 18px rgba(3,16,39,0.6)"
                  }}>{line}</div>
                )) }
              </div>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
