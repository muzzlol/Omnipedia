import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import VoteModal from '@/components/VoteModal';
import { BiUpvote, BiSolidUpvote, BiDownvote, BiSolidDownvote } from "react-icons/bi";

interface Topic {
  _id: string;
  name: string;
  description: string;
  slug: string;
}

interface ResourceData {
  _id: string;
  type: string;
  url: string;
  classification: string;
  skillLevel: string;
  comprehensiveness: number;
  upvotes?: number; // Existing
  downvotes?: number; // Existing
  hasUpvoted?: boolean; // **Added to track user interaction**
  hasDownvoted?: boolean; // **Added to track user interaction**
}

interface User {
  _id: string;
  username: string;
  avatarUrl: string;
}

export const TopicPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [topic, setTopic] = useState<Topic | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [resources, setResources] = useState<ResourceData[]>([]);
  const [generating, setGenerating] = useState<boolean>(false);
  const [upvoters, setUpvoters] = useState<User[]>([]);
  const [downvoters, setDownvoters] = useState<User[]>([]);

  const { toast } = useToast();

  // Update API URLs to match the voteRoutes mounting
  const VOTE_BASE_URL = 'http://localhost:5001/vote';

  useEffect(() => {
    const fetchTopic = async () => {
      try {
        // **Ensure the request includes the Authorization header**
        const response = await axios.get(`http://localhost:5001/topics/${slug}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setTopic(response.data);
        setResources(response.data.resources); // Resources now include upvotes, downvotes, hasUpvoted, hasDownvoted
        setLoading(false);
      } catch (err: any) {
        setError('Failed to fetch topic');
        setLoading(false);
      }
    };

    if (slug) {
      fetchTopic();
    } else {
      setError('No topic specified');
      setLoading(false);
    }
  }, [slug]);

  const handleGenerateResources = async () => {
    if (!topic) return;

    setGenerating(true);

    try {
      const response = await axios.post(
        'http://localhost:5001/resources/generate',
        { topicId: topic._id },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } } // Adjust as needed
      );
      setResources(response.data);
      toast({
        title: 'Resources Generated',
        description: 'New resources have been added.',
      });
    } catch (err: any) {
      toast({
        title: 'Error',
        description: 'Failed to generate resources.',
        variant: 'destructive',
      });
    } finally {
      setGenerating(false);
    }
  };

  // Fetch upvoters list
  const fetchUpvoters = async (resourceId: string) => {
    try {
      const response = await axios.get(`${VOTE_BASE_URL}/${resourceId}/upvoters`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setUpvoters(response.data);
    } catch (err: any) {
      console.error('Failed to fetch upvoters:', err);
      toast({
        title: 'Error',
        description: 'Failed to fetch upvoters.',
        variant: 'destructive',
      });
    }
  };

  // Fetch downvoters list
  const fetchDownvoters = async (resourceId: string) => {
    try {
      const response = await axios.get(`${VOTE_BASE_URL}/${resourceId}/downvoters`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setDownvoters(response.data);
    } catch (err: any) {
      console.error('Failed to fetch downvoters:', err);
      toast({
        title: 'Error',
        description: 'Failed to fetch downvoters.',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-10 w-1/2 mb-4" />
        <Skeleton className="h-6 w-full mb-6" />
        <Skeleton className="h-10 w-1/4" />
      </div>
    )
  }

  if (error) return <div className="text-red-500">{error}</div>;
  if (!topic) return <div>Topic not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">{topic.name}</h1>
      <p className="text-lg mb-6">{topic.description}</p>
      
      {/* Generate Resources Button */}
      {resources.length === 0 && (
        <Button onClick={handleGenerateResources} disabled={generating}>
          {generating ? 'Generating...' : 'Generate Resources'}
        </Button>
      )}

      {/* Loading Indicator for Resource Generation */}
      {generating && (
        <div className="mt-4">
          <Skeleton className="h-6 w-40 mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
        </div>
      )}

      {/* Resources Rendering */}
      <div className="mt-8 grid grid-cols-1 gap-4">
        {resources.map((resource) => (
          <Card key={resource._id}>
            <CardHeader className="flex justify-between">
              <div>
                <h2 className="text-xl font-semibold">
                  <a href={resource.url} target="_blank" rel="noopener noreferrer">
                    {resource.type.toUpperCase()}
                  </a>
                </h2>
                <p className="text-muted-foreground">
                  <a href={resource.url} target="_blank" rel="noopener noreferrer">
                    {resource.url}
                  </a>
                </p>
              </div>
              {/* Future: User profile link */}
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant={resource.classification === 'paid' ? 'destructive' : 'default'}>
                  {resource.classification}
                </Badge>
                <Badge variant={
                  resource.skillLevel === 'beginner' ? 'default' :
                  resource.skillLevel === 'intermediary' ? 'secondary' :
                  'destructive'
                }>
                  {resource.skillLevel}
                </Badge>
              </div>
              <Progress className="w-3/4" value={resource.comprehensiveness} />
              <p className="text-sm text-muted-foreground mt-2">{resource.comprehensiveness}% Topic Coverage</p>
              <div className="flex justify-between items-center mt-4">
                <div className="flex space-x-4">
                  {/* **Upvote Button with Icons** */}
                  <Button
                    variant="ghost"
                    onClick={async () => {
                      try {
                        const response = await axios.post(
                          `${VOTE_BASE_URL}/upvote/${resource._id}`,
                          {},
                          { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
                        );
                        // Update resource with new upvote/downvote counts and vote status
                        setResources(prev =>
                          prev.map(r => r._id === resource._id ? { 
                            ...r, 
                            upvotes: response.data.upvotes, 
                            downvotes: response.data.downvotes, 
                            hasUpvoted: true, 
                            hasDownvoted: false 
                          } : r)
                        );
                      } catch (err: any) {
                        toast({
                          title: 'Error',
                          description: err.response?.data?.message || 'Failed to upvote.',
                          variant: 'destructive',
                        });
                      }
                    }}
                  >
                    {/* **Use solid icon if upvoted, else outline icon** */}
                    {resource.hasUpvoted ? <BiSolidUpvote /> : <BiUpvote />}
                  </Button>

                  {/* **Downvote Button with Icons** */}
                  <Button
                    variant="ghost"
                    onClick={async () => {
                      try {
                        const response = await axios.post(
                          `${VOTE_BASE_URL}/downvote/${resource._id}`,
                          {},
                          { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
                        );
                        // Update resource with new upvote/downvote counts and vote status
                        setResources(prev =>
                          prev.map(r => r._id === resource._id ? { 
                            ...r, 
                            upvotes: response.data.upvotes, 
                            downvotes: response.data.downvotes, 
                            hasUpvoted: false, 
                            hasDownvoted: true 
                          } : r)
                        );
                      } catch (err: any) {
                        toast({
                          title: 'Error',
                          description: err.response?.data?.message || 'Failed to downvote.',
                          variant: 'destructive',
                        });
                      }
                    }}
                  >
                    {/* **Use solid icon if downvoted, else outline icon** */}
                    {resource.hasDownvoted ? <BiSolidDownvote /> : <BiDownvote />}
                  </Button>
                </div>
                {/* will be adding other elements here */}
              </div>

              {/* Upvoters Modal */}
              <VoteModal
                triggerText={`${resource.upvotes || 0} Upvotes`}
                title="Upvoters"
                users={upvoters}
                fetchUsers={() => fetchUpvoters(resource._id)}
              />

              {/* Downvoters Modal */}
              <VoteModal
                triggerText={`${resource.downvotes || 0} Downvotes`}
                title="Downvoters"
                users={downvoters}
                fetchUsers={() => fetchDownvoters(resource._id)}
              />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
