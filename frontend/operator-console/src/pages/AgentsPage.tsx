import { useQuery } from "@tanstack/react-query";

interface Agent {
  id: string;
  name: string;
  agent_type: string;
  verification_state: string;
  autonomy_mode: string;
  is_active: boolean;
  created_at: string;
}

function AgentsPage() {
  const { data: agents, isLoading } = useQuery<Agent[]>({
    queryKey: ["agents"],
    queryFn: async () => {
      const res = await fetch("/api/v1/agents", {
        headers: { "X-Tenant-Id": "00000000-0000-0000-0000-000000000000" },
      });
      if (!res.ok) throw new Error("Failed to fetch agents");
      return res.json();
    },
  });

  if (isLoading) {
    return <p className="text-muted-foreground">Loading agents...</p>;
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Agent Registry</h2>
      {agents && agents.length > 0 ? (
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="text-left p-3">Name</th>
                <th className="text-left p-3">Type</th>
                <th className="text-left p-3">Verification</th>
                <th className="text-left p-3">Autonomy</th>
                <th className="text-left p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {agents.map((agent) => (
                <tr key={agent.id} className="border-t">
                  <td className="p-3 font-medium">{agent.name}</td>
                  <td className="p-3">{agent.agent_type}</td>
                  <td className="p-3">{agent.verification_state}</td>
                  <td className="p-3">{agent.autonomy_mode}</td>
                  <td className="p-3">
                    {agent.is_active ? "Active" : "Inactive"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-muted-foreground">No agents registered yet.</p>
      )}
    </div>
  );
}

export default AgentsPage;
