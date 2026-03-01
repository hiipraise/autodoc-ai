import { Download, ExternalLink } from 'lucide-react';
import { SectionHeading, Prose } from '../SectionHeading';
import { CodeBlock } from '../CodeBlock';
import { Callout } from '../Callout';
import { Step } from '../Step';

export function InstallationSection() {
  return (
    <div>
      <SectionHeading
        icon={Download}
        label="Installation"
        title="Install AutoDoc.ai"
        subtitle="One npm install from the root wires up all three packages — CLI, frontend, and server."
      />

      <Step n={1} title="Clone the repository">
        <CodeBlock code={`git clone https://github.com/your-org/autodoc-ai.git\ncd autodoc-ai`} />
      </Step>

      <Step n={2} title="Install all dependencies">
        <CodeBlock code="npm install" />
        <Callout type="info">
          npm workspaces installs all packages in one command. No need to <code>cd</code> into sub-folders separately.
        </Callout>
      </Step>

      <Step n={3} title="Copy the environment file" last>
        <CodeBlock code={`# Mac / Linux / PowerShell\ncp .env.example .env\n\n# Windows Command Prompt\ncopy .env.example .env`} />
        <Prose>
          Open <code>.env</code> and paste your Groq key. Get one free at{' '}
          <a href="https://console.groq.com" target="_blank" rel="noreferrer"
             className="inline-flex items-center gap-1 text-[#FE7F2D]">
            console.groq.com <ExternalLink size={10} />
          </a>{' '}
          — no credit card required.
        </Prose>
        <CodeBlock code="GROQ_API_KEY=gsk_your_key_here" lang="env" />
        <Callout type="tip">
          AutoDoc works without a key. File tree, install detection, and license sections all work. Only AI feature extraction requires Groq or Ollama.
        </Callout>
      </Step>
    </div>
  );
}