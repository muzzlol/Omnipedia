import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Edit3Icon } from "lucide-react"; 
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
import ResourceCard from "@/components/ResourceCard";
import VoteModal from "@/components/VoteModal";
import axios from "axios";

const API_BASE_URL = 'http://localhost:5001';

interface Profile {
  _id: string;
  username: string;
  avatarUrl: string;
  followers: string[];
  followedUsers: string[];
  bookmarkedResources: any[];
  resources: any[];
}

interface User {
  _id: string;
  username: string;
  avatarUrl: string;
}

export default function ProfilePage() {
  const { userId } = useParams<{ userId: string }>();
  const { isAuthenticated, token, currentUser } = useAuth();
  const isOwnProfile = !userId || userId === currentUser?._id;

  const [profile, setProfile] = useState<Profile | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newAvatarUrl, setNewAvatarUrl] = useState("");
  const [followers, setFollowers] = useState<User[]>([]);
  const [following, setFollowing] = useState<User[]>([]);


  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const url = isOwnProfile 
          ? `${API_BASE_URL}/users/profile`
          : `${API_BASE_URL}/users/${userId}`; 

        const res = await axios.get<Profile>(url, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        console.log('Profile data received:', res.data);
        setProfile(res.data);
        if (!isOwnProfile && currentUser) {
          setIsFollowing(res.data.followers.includes(currentUser._id));
        }
      } catch (error) {
        console.error(error);
        toast({
          title: 'Error',
          description: 'Failed to load profile.',
          variant: 'destructive',
        });
      }
    };

    if (isAuthenticated) {
      fetchProfile();
    }
  }, [userId, isOwnProfile, token, isAuthenticated, currentUser]);

  const handleFollow = async () => {
    if (!profile) return;
    try {
      const res = await axios.post<{followers: string[]}>(
        `${API_BASE_URL}/users/follow`,
        { userIdToFollow: profile._id },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      setIsFollowing(true);
      setProfile(prev => prev ? { ...prev, followers: res.data.followers } : null);
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
    if (!profile) return;
    try {
      const res = await axios.post<{followers: string[]}>(
        `${API_BASE_URL}/users/unfollow`,
        { userIdToUnfollow: profile._id },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      setIsFollowing(false);
      setProfile(prev => prev ? { ...prev, followers: res.data.followers } : null);
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
      const res = await axios.put<Profile>(
        `${API_BASE_URL}/users/profile`,
        { avatarUrl: newAvatarUrl },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      setProfile(res.data);
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

  const fetchFollowers = async(username : string) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/users/${username}/followers`);
      console.log('Followers:', res.data);
      setFollowers(res.data);
    }
    catch (err: any) {
      console.error('Failed to fetch followers:', err);
      toast({
        title: 'Error',
        description: 'Failed to fetch followers.',
        variant: 'destructive',
      });
    }
  }

  const fetchFollowing = async(username : string) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/users/${username}/following`);
      console.log('Followers:', res.data);
      return res.data;
      setFollowing(res.data);
    }
    catch (err: any) {
      console.error('Failed to fetch followers:', err);
      toast({
        title: 'Error',
        description: 'Failed to fetch followers.',
        variant: 'destructive',
      });
    }
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
        {/* <VoteModal
            triggerText="Followers"
            title="Followers"
            users={followers}
            fetchUsers={() => fetchFollowers(username)}
          /> */}
          <span>{profile.followers.length || 0} {profile.followers.length === 1 ? 'follower' : 'followers'}</span>
          <span>•</span>
          <span>{profile.followedUsers.length || 0} following</span>
        </div>
      </div>

      <Tabs defaultValue="saved" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="saved">Bookmarks</TabsTrigger>
          <TabsTrigger value="created">Created</TabsTrigger>
        </TabsList>
        <TabsContent value="saved" className="space-y-4">
          <div className="flex flex-col items-center gap-6">
            {profile.bookmarkedResources && profile.bookmarkedResources.length > 0 ? (
              profile.bookmarkedResources.map((resource: any) => (
                <ResourceCard
                  key={resource._id}
                  topicName={resource.topic?.name || 'Unknown Topic'} 
                  url={resource.url}
                  classification={resource.classification}
                  comprehensiveness={resource.comprehensiveness}
                  skillLevel={resource.skillLevel}
                />
              ))
            ) : (
              <div className="text-center text-muted-foreground">
                No bookmarks yet.
              </div>
            )}
          </div>
        </TabsContent>
        <TabsContent value="created" className="space-y-4">
          <div className="flex flex-col items-center gap-6">
            {profile.resources && profile.resources.length > 0 ? (
              profile.resources.map((resource: any) => {
                console.log('Resource being rendered:', resource);
                return (
                  <ResourceCard
                    key={resource._id}
                    topicName={resource.topic?.name || 'Unknown Topic'}
                    url={resource.url}
                    classification={resource.classification}
                    comprehensiveness={resource.comprehensiveness}
                    skillLevel={resource.skillLevel}
                  />
                );
              })
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
