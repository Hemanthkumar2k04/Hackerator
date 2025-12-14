import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { WorkspaceBoard } from '@/components/WorkspaceBoard';
import { authClient } from '@/lib/auth-client';
import Loader from '@/components/kokonutui/loader';
import type { Node, Edge } from 'reactflow';

export function WorkspacePage() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { data: session } = authClient.useSession();
  const [isValidating, setIsValidating] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  useEffect(() => {
    const validateAndFetchWorkspace = async () => {
      // If no projectId in URL, allow access (empty workspace state)
      if (!projectId) {
        setIsValidating(false);
        setHasAccess(true);
        return;
      }

      // Must be authenticated
      if (!session?.user?.id) {
        setIsValidating(false);
        setErrorMessage('Please sign in to access projects');
        setTimeout(() => navigate('/auth'), 2000);
        return;
      }

      try {
        const response = await fetch(`http://localhost:3000/api/workspace/${projectId}`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.status === 403) {
          setIsValidating(false);
          setHasAccess(false);
          setErrorMessage('You do not have access to this project. It belongs to another user.');
          setTimeout(() => navigate('/home'), 3000);
          return;
        }

        if (response.status === 404) {
          setIsValidating(false);
          setHasAccess(false);
          setErrorMessage('Project not found.');
          setTimeout(() => navigate('/home'), 3000);
          return;
        }

        if (!response.ok) {
          throw new Error('Failed to validate project access');
        }

        const data = await response.json();
        
        // Access granted
        setHasAccess(true);

        // Check if we need to generate the plan
        if (!data.nodes || data.nodes.length === 0) {
          setIsGenerating(true);
          setIsValidating(false); // Stop validating, start generating
          
          // Call generate endpoint
          const genResponse = await fetch(`http://localhost:3000/api/workspace/${projectId}/generate`, {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (!genResponse.ok) {
            throw new Error('Failed to generate execution plan');
          }

          // Fetch data again after generation
          const refetchResponse = await fetch(`http://localhost:3000/api/workspace/${projectId}`, {
            method: 'GET',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
          });
          
          const newData = await refetchResponse.json();
          setNodes(newData.nodes || []);
          setEdges(newData.edges || []);
          setIsGenerating(false);
        } else {
          setNodes(data.nodes || []);
          setEdges(data.edges || []);
          setIsValidating(false);
        }

      } catch (error) {
        console.error('Error validating/fetching workspace:', error);
        setIsValidating(false);
        setIsGenerating(false);
        setHasAccess(false);
        setErrorMessage('Failed to load workspace.');
        // setTimeout(() => navigate('/home'), 3000);
      }
    };

    validateAndFetchWorkspace();
  }, [projectId, session?.user?.id, navigate]);

  if (isValidating) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <Navbar variant="auth" />
        <main className="flex-1 flex items-center justify-center p-4">
          <Loader size="md" title="Validating project access..." subtitle="" className="!gap-0 !p-0" />
        </main>
      </div>
    );
  }

  if (isGenerating) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <Navbar variant="auth" />
        <main className="flex-1 flex items-center justify-center p-4">
          <Loader 
            size="lg" 
            title="Generating Execution Plan..." 
            subtitle="Our AI is breaking down your project into actionable phases and tasks." 
            className="!gap-0 !p-0" 
          />
        </main>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <Navbar variant="auth" />
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold text-red-400">Access Denied</h2>
            <p className="text-neutral-400 max-w-md">{errorMessage}</p>
            <p className="text-xs text-neutral-500">Redirecting you back...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100%' }}>
      <Navbar variant="auth" />
      <main style={{ flex: 1, width: '100%', height: 'calc(100vh - 64px)', overflow: 'hidden' }}>
        <WorkspaceBoard initialNodes={nodes} initialEdges={edges} projectId={projectId || ''} />
      </main>
    </div>
  );
}
