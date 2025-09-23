"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function SignupPage() {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/dashboard');
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Sign Up</CardTitle>
        <CardDescription>
          Create your account to join the Kaito Kompass community.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
              className="bg-background"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" required className="bg-background" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="invite-code">Invite Code</Label>
            <Input
              id="invite-code"
              type="text"
              placeholder="Enter your invite code"
              required
              className="bg-background"
            />
          </div>
          <Button type="submit" className="w-full">
            Create account
          </Button>
        </CardContent>
      </form>
      <div className="mt-4 mb-6 text-center text-sm">
        Already have an account?{' '}
        <Link href="/login" className="underline text-accent">
          Sign in
        </Link>
      </div>
    </Card>
  );
}
