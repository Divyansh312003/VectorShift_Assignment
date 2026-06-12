import { PipelineToolbar } from './toolbar';
import { PipelineUI } from './ui';
import { SubmitButton } from './submit';

function App() {
  return (
    <main className="pipeline-app">
      <PipelineToolbar />
      <PipelineUI />
      <SubmitButton />
    </main>
  );
}

export default App;
