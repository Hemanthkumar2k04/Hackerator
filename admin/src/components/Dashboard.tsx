import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useNavigate } from "react-router-dom";
import { LogOut, Users, Search, Loader2 } from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export function Dashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const { data: session } = authClient.useSession();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/admin/users", {
          credentials: 'include', // Important for CORS cookies
          headers: {
              'Content-Type': 'application/json'
          }
        });
        
        if (response.status === 401 || response.status === 403) {
          navigate("/");
          return;
        }
  
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Failed to fetch users", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [navigate]);

  const handleSignOut = async () => {
    await authClient.signOut();
    navigate("/");
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-950">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      {/* Navbar */}
      <nav className="bg-neutral-900 border-b border-neutral-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Users className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">Admin Dashboard</span>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-sm text-neutral-400">
              {session?.user?.email}
            </span>
            <button
              onClick={handleSignOut}
              className="p-2 hover:bg-neutral-800 rounded-full transition-colors text-neutral-400"
              title="Sign Out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">Users</h2>
            <p className="text-neutral-400 mt-1">
              Manage and view all registered users
            </p>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-lg border border-neutral-800 bg-neutral-900 focus:ring-2 focus:ring-blue-500 outline-none w-full sm:w-64"
            />
          </div>
        </div>

        <div className="bg-neutral-900 rounded-xl border border-neutral-800 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-neutral-800/50 border-b border-neutral-800">
                <tr>
                  <th className="px-6 py-4 font-medium text-neutral-400">User</th>
                  <th className="px-6 py-4 font-medium text-neutral-400">Email</th>
                  <th className="px-6 py-4 font-medium text-neutral-400">Joined</th>
                  <th className="px-6 py-4 font-medium text-neutral-400">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-neutral-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-900/30 flex items-center justify-center text-blue-400 font-medium">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-neutral-300">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 text-neutral-300">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-900/30 text-green-400">
                        Active
                      </span>
                    </td>
                  </tr>
                ))}
                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-neutral-400">
                      No users found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
