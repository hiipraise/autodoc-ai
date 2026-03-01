import { Zap } from 'lucide-react';
import { SectionHeading, Prose } from '../SectionHeading';
import { CodeBlock } from '../CodeBlock';
import { Callout } from '../Callout';
import { Step } from '../Step';

export function QuickStartSection() {
  return (
    <div>
      <SectionHeading
        icon={Zap}
        label="Quick Start"
        title="Up and Running"
        subtitle="From a fresh install to your first generated README in four steps."
      />

      <Step n={1} title="Start the development server">
        <CodeBlock code="npm run dev" />
        <Prose>Both services start together:</Prose>
        <CodeBlock lang="output" code={`[SERVER]   AutoDoc server running on http://localhost:4000\n[FRONTEND] Local:   http://localhost:3000`} />
      </Step>

      <Step n={2} title="Open the dashboard">
        <Prose>
          Navigate to{' '}
          <a href="http://localhost:3000" className="text-[#FE7F2D]">
            http://localhost:3000
          </a>{' '}
          in your browser. You will see the dashboard with an empty file tree and README panel.
        </Prose>
      </Step>

      <Step n={3} title="Point it at a project">
        <Prose>
          Type the <strong>absolute path</strong> to any project on your machine into the input at the top, then click Generate.
        </Prose>
        <CodeBlock lang="path" code={`# Windows\nC:\\Users\\YourName\\Projects\\my-app\n\n# Mac / Linux\n/Users/yourname/projects/my-app\n\n# Or scan the AutoDoc folder itself\n.`} />
        <Callout type="warning">
          Use the full absolute path on Windows. Relative paths like <code>./my-app</code> can resolve to the wrong place depending on where the server process started.
        </Callout>
      </Step>

      <Step n={4} title="View the result" last>
        <Prose>
          The file tree fills in on the left, the README preview renders on the right.
          A <code>README.md</code> is written to the root of the <em>scanned project</em>,
          not inside the AutoDoc folder.
        </Prose>
      </Step>
    </div>
  );
}