import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ResourceCardProps {
  topicName: string;
  url: string;
  classification: string;
  comprehensiveness: number;
  skillLevel: string;
}

const ResourceCard: React.FC<ResourceCardProps> = ({
  topicName,
  url,
  classification,
  comprehensiveness,
  skillLevel,
}) => {
  return (
    <Card className="w-full max-w-md">
      <CardContent>
        <h2 className="text-lg font-semibold mb-2">{topicName}</h2>
        <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
          {url}
        </a>
        <div className="mt-4 flex flex-wrap gap-2">
          <Badge variant="default">{classification}</Badge>
          <Badge variant="secondary">Comprehensiveness: {comprehensiveness}</Badge>
          <Badge variant="outline">{skillLevel}</Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResourceCard;
