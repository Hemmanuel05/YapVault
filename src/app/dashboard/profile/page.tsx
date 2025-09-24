
"use client";

import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/page-header';
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { Skeleton } from '@/components/ui/skeleton';
import { auth, db } from '@/lib/firebase';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { updateProfile } from 'firebase/auth';


export default function ProfilePage() {
  const { user, isLoading } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState('');
  const [avatarFallback, setAvatarFallback] = useState('');
  const [newAvatarFile, setNewAvatarFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      setEmail(user.email || '');
      const emailUsername = user.email?.split('@')[0] || '';
      setUsername(user.displayName || emailUsername);
      setAvatar(user.photoURL || '');
      setAvatarFallback((user.displayName || emailUsername).charAt(0).toUpperCase());
    }
  }, [user]);
  
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setNewAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({ title: "Not Authenticated", description: "You must be logged in to update your profile.", variant: "destructive" });
      return;
    }

    setIsSaving(true);
    try {
      let newAvatarUrl = user.photoURL;

      if (newAvatarFile) {
        const storage = getStorage();
        const storageRef = ref(storage, `avatars/${user.uid}/${newAvatarFile.name}`);
        const snapshot = await uploadBytes(storageRef, newAvatarFile);
        newAvatarUrl = await getDownloadURL(snapshot.ref);
      }

      await updateProfile(user, {
        displayName: username,
        photoURL: newAvatarUrl,
      });

      // Force a reload of the user to get the latest profile info
      await user.reload();

      toast({
        title: 'Profile Updated',
        description: 'Your changes have been saved successfully.',
      });

    } catch (error: any) {
       toast({
        title: 'Update Failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
      setNewAvatarFile(null);
    }
  };
  
  if (isLoading || !user) {
    return (
        <div className="space-y-8">
            <PageHeader
                title="Profile Settings"
                description="Manage your account details and preferences."
            />
            <Card>
                <CardHeader>
                    <h2>Edit Profile</h2>
                    <CardDescription>
                        Loading your profile information...
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <Skeleton className="h-20 w-20 rounded-full" />
                            <Skeleton className="h-10 w-48" />
                        </div>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                             <div className="space-y-2">
                                <Skeleton className="h-4 w-1/4" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-1/4" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                        </div>
                        <Skeleton className="h-10 w-32" />
                    </div>
                </CardContent>
            </Card>
        </div>
    )
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Profile Settings"
        description="Manage your account details and preferences."
      />
      <Card>
        <CardHeader>
          <h2>Edit Profile</h2>
          <CardDescription>
            Update your public profile information.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label>Profile Picture</Label>
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={avatar} alt="User avatar" data-ai-hint="person portrait" />
                  <AvatarFallback>{avatarFallback}</AvatarFallback>
                </Avatar>
                <Input
                  id="picture"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="max-w-xs"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-background"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  readOnly
                  className="bg-background cursor-not-allowed text-muted-foreground"
                />
              </div>
            </div>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? <Loader2 className="animate-spin mr-2" /> : null}
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
