It’s a web-based code analysis tool that explains how Python code works.

The main purpose of this project is to help users understand Python code more clearly  its internal structure and generating an AI explanation.

Our system has two main parts: a frontend built with React, and a backend built with FastAPI. When the user writes Python code and clicks Run, the frontend sends the code to the backend.

The backend performs four things:
It generates the AST, which is the abstract syntax tree.
It creates a flowchart using Mermaid.
It produces a trace log, showing the analysis steps.
And it generates an AI explanation using OpenAI to describe the code in natural language.

The frontend is deployed on Vercel and the backend on Render, so the whole project runs entirely in the cloud and works on any device.

The system is a bit slow to respond when it first starts. This is because we're using a free backend deployment system, so it suspends after one minute of inactivity. It becomes active again within a minute or two when you press the "run" button. Website link is below.
Website link: https://code-assist-x-frontend.vercel.app/
