import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { createClient } from "@supabase/supabase-js";
import SavedIdeaItem from "./savedIdeaItem";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
 import.meta.env.VITE_SUPABASE_ANON_KEY!
);

const SavedIdeas = () => {
  const { user } = useUser();
  const [ideas, setIdeas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchIdeas = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("saved_ideas")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (!error) setIdeas(data || []);
      setLoading(false);
    };
    fetchIdeas();
  }, [user]);

  if (!user) return <div>Please sign in to view your saved ideas.</div>;
  if (loading) return <div>Loading...</div>;
  if (ideas.length === 0) return <div>No saved ideas yet.</div>;
  
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Your Saved Ideas</h2>
      <div className="space-y-4">
        {ideas.map((idea) => (
          <SavedIdeaItem key={idea.id} idea={idea} />
        ))}
      </div>
    </div>
  );
};

export default SavedIdeas;