import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  IconBrandGithub,
  IconBrandGoogle,
} from "@tabler/icons-react";
import { Navbar } from "@/components/Navbar";
import { authClient } from "@/lib/auth-client";


export function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isSignUp) {
        await authClient.signUp.email({
          email,
          password,
          name: `${firstName} ${lastName}`,
        }, {
          onSuccess: () => {
            navigate("/home");
          },
          onError: (ctx) => {
            alert(ctx.error.message);
          }
        });
      } else {
        await authClient.signIn.email({
          email,
          password,
        }, {
          onSuccess: () => {
            navigate("/home");
          },
          onError: (ctx) => {
            alert(ctx.error.message);
          }
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar variant="public" />
      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-black border border-neutral-800">
          <h2 className="text-xl font-bold text-neutral-200">
            {isSignUp ? "Create an account" : "Welcome back"}
          </h2>
          <p className="text-neutral-300 text-sm max-w-sm mt-2">
            {isSignUp
              ? "Enter your details to get started with Hackerator."
              : "Login to access your projects and templates."}
          </p>

          <form className="my-8" onSubmit={handleSubmit}>
            {isSignUp && (
              <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
                <LabelInputContainer>
                  <Label htmlFor="firstname">First name</Label>
                  <Input 
                    id="firstname" 
                    placeholder="Tyler" 
                    type="text" 
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </LabelInputContainer>
                <LabelInputContainer>
                  <Label htmlFor="lastname">Last name</Label>
                  <Input 
                    id="lastname" 
                    placeholder="Durden" 
                    type="text" 
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </LabelInputContainer>
              </div>
            )}
            <LabelInputContainer className="mb-4">
              <Label htmlFor="email">Email Address</Label>
              <Input 
                id="email" 
                placeholder="projectmayhem@fc.com" 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </LabelInputContainer>
            <LabelInputContainer className="mb-4">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                placeholder="••••••••" 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </LabelInputContainer>
            
            {isSignUp && (
                 <LabelInputContainer className="mb-8">
                 <Label htmlFor="confirmPassword">Confirm Password</Label>
                 <Input id="confirmPassword" placeholder="••••••••" type="password" />
               </LabelInputContainer>
            )}

            <button
              className="bg-gradient-to-br relative group/btn from-zinc-900 to-zinc-900 block bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset]"
              type="submit"
              disabled={loading}
            >
              {loading ? "Loading..." : (isSignUp ? "Sign up" : "Sign in")} &rarr;
              <BottomGradient />
            </button>

            <div className="bg-gradient-to-r from-transparent via-neutral-700 to-transparent my-8 h-[1px] w-full" />

            <div className="flex flex-col space-y-4">
              <button
                className=" relative group/btn flex space-x-2 items-center justify-start px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-zinc-900 shadow-[0px_0px_1px_1px_#262626]"
                type="button"
                onClick={async () => {
                  await authClient.signIn.social({
                    provider: "github",
                    callbackURL: window.location.origin + "/home",
                  });
                }}
              >
                <IconBrandGithub className="h-4 w-4 text-neutral-300" />
                <span className="text-neutral-300 text-sm">
                  {isSignUp ? "Sign up with GitHub" : "Sign in with GitHub"}
                </span>
                <BottomGradient />
              </button>
              <button
                className=" relative group/btn flex space-x-2 items-center justify-start px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-zinc-900 shadow-[0px_0px_1px_1px_#262626]"
                type="button"
                onClick={async () => {
                  await authClient.signIn.social({
                    provider: "google",
                    callbackURL: window.location.origin + "/home",
                  });
                }}
              >
                <IconBrandGoogle className="h-4 w-4 text-neutral-300" />
                <span className="text-neutral-300 text-sm">
                  {isSignUp ? "Sign up with Google" : "Sign in with Google"}
                </span>
                <BottomGradient />
              </button>
            </div>
          </form>
          
          <div className="text-center mt-4">
            <p className="text-neutral-400 text-sm">
              {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-blue-500 hover:underline font-medium"
              >
                {isSignUp ? "Sign in" : "Sign up"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};
