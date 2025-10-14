import { useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { supabase } from "@/lib/supabase"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "./ui/textarea"

export function ProfileModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { user } = useAuth()
  const [name, setName] = useState("")
  const [bio, setBio] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSave = async () => {
    if (!user?.id || !name.trim()) {
      setError("Name is required")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const { error: insertError } = await supabase
        .from("profiles")
        .insert({
          id: user.id,
          name: name.trim(),
          email: user.email || "",
          bio: bio.trim() || null,
        })

      if (insertError) {
        // If profile already exists, update it instead
        if (insertError.code === "23505") {
          const { error: updateError } = await supabase
            .from("profiles")
            .update({
              name: name.trim(),
              bio: bio.trim() || null,
            })
            .eq("id", user.id)

          if (updateError) throw updateError
        } else {
          throw insertError
        }
      }

      onClose()
    } catch (err) {
      console.error("Error saving profile:", err)
      setError("Failed to save profile. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Complete Your Profile</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500 rounded-lg text-red-500 text-sm">
              {error}
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-white mb-2">Name <span className="text-emerald-500">*</span></label>
            <Input
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-black border border-gray-700 text-white placeholder:text-gray-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-2">Email</label>
            <Input
              value={user?.email || ""}
              disabled
              className="bg-black border border-gray-700 text-gray-400 cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-2">Bio</label>
            <Textarea
              placeholder="Tell us about yourself"
              value={bio}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setBio(e.target.value)}
              className="bg-black border border-gray-700 text-white placeholder:text-gray-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/50 min-h-[100px] resize-none"
            />
          </div>
        </div>
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={onClose}
            disabled={loading}
            className="border border-gray-600 text-white hover:bg-gray-800 hover:border-gray-500 transition-colors duration-300"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            disabled={loading || !name.trim()}
            className="bg-emerald-600 hover:bg-emerald-700 text-white border border-emerald-500 transition-colors duration-300 disabled:bg-gray-900 disabled:border-gray-700 disabled:text-gray-600"
          >
            {loading ? "Saving..." : "Save Profile"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}