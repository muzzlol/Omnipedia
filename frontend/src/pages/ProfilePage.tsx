import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookmarkIcon, Edit3Icon } from "lucide-react"; // Changed UserIcon to Edit3Icon
import { useAuth } from "@/contexts/AuthContext";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

export default function ProfilePage() {
  const { userId } = useParams<{ userId: string }>();
  const { isAuthenticated, token, currentUser } = useAuth(); // Removed login and logout if not used
  const isOwnProfile = !userId || userId === currentUser?._id;

  const [profile, setProfile] = useState<any>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newAvatarUrl, setNewAvatarUrl] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const API_BASE_URL = 'http://localhost:5001'; // Define the backend API base URL
        const url = isOwnProfile 
          ? `${API_BASE_URL}/users/profile`  // **Updated endpoint for own profile**
          : `${API_BASE_URL}/users/${userId}`; // Corrected endpoint for public profiles
        console.log("Fetching URL:", url); // Log the URL being fetched

        const res = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        console.log("Response status:", res.status); // Log the response status
        console.log("Response headers:", Object.fromEntries(res.headers.entries())); // Log response headers
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const text = await res.text();
        console.log("Raw response:", text.substring(0, 500)); // Log first 500 characters of the response

        let data;
        try {
          data = JSON.parse(text);
        } catch (parseError) {
          console.error("JSON parse error:", parseError);
          throw new Error("Invalid JSON in response");
        }
        setProfile(data);
        if (!isOwnProfile && currentUser) {
          setIsFollowing(data.followers.includes(currentUser._id));
        }
      } catch (error) {
        console.error("Fetch error:", error);
        toast({
          title: 'Error',
          description: 'Failed to load profile. Please try again later.',
          variant: 'destructive',
        });
      }
    };

    if (isAuthenticated) {
      fetchProfile();
    }
  }, [userId, isOwnProfile, token, isAuthenticated, currentUser]);

  const handleFollow = async () => {
    try {
      const API_BASE_URL = 'http://localhost:5001'; // Define the backend API base URL
      const res = await fetch(`${API_BASE_URL}/users/follow`, { // **Updated to absolute URL**
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ userIdToFollow: profile._id }),
      });
      if (!res.ok) {
        throw new Error('Failed to follow user');
      }
      const data = await res.json();
      setIsFollowing(true);
      setProfile((prev: any) => ({ ...prev, followers: data.followers }));
      toast({
        title: 'Following',
        description: `You are now following ${profile.username}.`,
      });
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Failed to follow user.',
        variant: 'destructive',
      });
    }
  };

  const handleUnfollow = async () => {
    try {
      const API_BASE_URL = 'http://localhost:5001'; // Define the backend API base URL
      const res = await fetch(`${API_BASE_URL}/users/unfollow`, { // **Updated to absolute URL**
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ userIdToUnfollow: profile._id }),
      });
      if (!res.ok) {
        throw new Error('Failed to unfollow user');
      }
      const data = await res.json();
      setIsFollowing(false);
      setProfile((prev: any) => ({ ...prev, followers: data.followers }));
      toast({
        title: 'Unfollowed',
        description: `You have unfollowed ${profile.username}.`,
      });
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Failed to unfollow user.',
        variant: 'destructive',
      });
    }
  };

  const handleAvatarUpdate = async () => {
    try {
      const API_BASE_URL = 'http://localhost:5001'; // Define the backend API base URL
      const res = await fetch(`${API_BASE_URL}/users/profile`, { // **Updated to absolute URL**
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ avatarUrl: newAvatarUrl }),
      });
      if (!res.ok) {
        throw new Error('Failed to update avatar');
      }
      const data = await res.json();
      setProfile(data);
      setIsDialogOpen(false);
      toast({
        title: 'Avatar Updated',
        description: 'Your profile picture has been updated.',
      });
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Failed to update avatar.',
        variant: 'destructive',
      });
    }
  };

  if (!profile) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex flex-col items-center mb-8">
        <div className="relative mb-4 group">
          <img
            src={profile.avatarUrl || '/placeholder.svg'}
            alt="Profile picture"
            className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg transition-transform duration-300 ease-in-out group-hover:scale-105"
          />
          {isOwnProfile && (
            <div className="absolute inset-0 rounded-full bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-white">
                    <Edit3Icon className="h-6 w-6" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogTitle>Edit Profile Picture</DialogTitle>
                  <DialogDescription>
                    Enter the URL of your new profile picture.
                  </DialogDescription>
                  <Input
                    type="text"
                    placeholder="Avatar URL"
                    value={newAvatarUrl}
                    onChange={(e) => setNewAvatarUrl(e.target.value)}
                    className="mt-4"
                  />
                  <DialogFooter className="mt-4 flex justify-end space-x-2">
                    <Button onClick={handleAvatarUpdate}>Save</Button>
                    <Button variant="ghost" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          )}
        </div>
        <h1 className="text-2xl font-bold mb-2">{profile.username}</h1>
        {!isOwnProfile && (
          <Button
            onClick={isFollowing ? handleUnfollow : handleFollow}
            variant={isFollowing ? "secondary" : "default"}
            className="mb-4"
          >
            {isFollowing ? "Following" : "Follow"}
          </Button>
        )}
        <div className="flex space-x-4 text-sm text-muted-foreground">
          <span>{profile.followers.length} followers</span>
          <span>•</span>
          <span>{profile.followedUsers.length} following</span>
        </div>
      </div>

      <Tabs defaultValue="saved" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="saved">Bookmarks</TabsTrigger>
          <TabsTrigger value="created">Created</TabsTrigger>
        </TabsList>
        <TabsContent value="saved" className="space-y-4">
          <div className="flex flex-col items-center gap-6">
            {profile.bookmarkedResources.length > 0 ? (
              profile.bookmarkedResources.map((resource: any, i: number) => (
                <Card key={i} className="group overflow-hidden w-full max-w-md">
                  <CardContent className="p-0 aspect-video relative">
                    <img
                      src={resource.url || `/placeholder.svg?height=360&width=640&text=Resource ${i + 1}`}
                      alt={`Saved resource ${i + 1}`}
                      className="w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <Button variant="ghost" size="icon" className="text-white">
                        <BookmarkIcon className="h-6 w-6" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center text-muted-foreground">
                No bookmarks yet.
              </div>
            )}
          </div>
        </TabsContent>
        <TabsContent value="created">
          <div className="flex flex-col items-center gap-6">
            {profile.resources.length > 0 ? (
              profile.resources.map((resource: any, i: number) => (
                <Card key={i} className="group overflow-hidden w-full max-w-md">
                  <CardContent className="p-0 aspect-video relative">
                    <img
                      src={resource.url || `/placeholder.svg?height=360&width=640&text=Resource ${i + 1}`}
                      alt={`Created resource ${i + 1}`}
                      className="w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <Button variant="ghost" size="icon" className="text-white">
                        <BookmarkIcon className="h-6 w-6" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center text-muted-foreground">
                No created resources yet.
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
