import React, { useState } from "react";
import { PenSquare } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Page } from "../types";

interface SignupPageProps {
  onNavigate: (page: Page) => void;
  onSignup: (name: string, email: string, password: string) => void;
}

export function SignupPage({ onNavigate, onSignup }: SignupPageProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await onSignup(name, email, password);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
            <PenSquare className="text-white" />
          </div>
          <CardTitle>Create account</CardTitle>
          <CardDescription>Join BlogHub</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Name</Label>
              <Input value={name} onChange={e => setName(e.target.value)} required />
            </div>

            <div>
              <Label>Email</Label>
              <Input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>

            <div>
              <Label>Password</Label>
              <Input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating..." : "Sign up"}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="justify-center text-sm">
          Already have an account?
          <button
            onClick={() => onNavigate("login")}
            className="ml-1 text-blue-600 hover:underline"
          >
            Login
          </button>
        </CardFooter>
      </Card>
    </div>
  );
}
