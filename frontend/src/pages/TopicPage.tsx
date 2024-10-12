import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

interface Topic {
  _id: string;
  name: string;
  description: string;
}

export const TopicPage: React.FC = () => {
  const { name } = useParams<{ name: string }>();
  const [topic, setTopic] = useState<Topic | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTopic = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/topics/${name}`);
        setTopic(response.data);
        setLoading(false);
      } catch (err: any) {
        setError('Failed to fetch topic');
        setLoading(false);
      }
    };

    fetchTopic();
  }, [name]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!topic) return <div>Topic not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">{topic.name}</h1>
      <p className="text-lg">{topic.description}</p>
      {/* Future integration for resources can be added here */}
    </div>
  );
};
