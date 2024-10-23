import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ResourceCardProps {
  topicName: string;
  url: string;
  classification: string;
  comprehensiveness: string;
  skillLevel: string;
}

export default function ResourceCard({
  topicName,
  url,
  classification,
  comprehensiveness,
  skillLevel,
}: ResourceCardProps) {
  const formatUrl = (url: string) => {
    const maxLength = 50;
    // Remove protocol
    const cleanUrl = url.replace(/^https?:\/\//, '');
    
    if (cleanUrl.length <= maxLength) return cleanUrl;
    
    const start = cleanUrl.substring(0, 30);
    const end = cleanUrl.substring(cleanUrl.length - 15);
    return `${start}...${end}`;
  };

  return (
    <Card className="w-full max-w-2xl hover:shadow-lg transition-all duration-200">
      <CardContent className="p-6">
        <h2 className="text-lg font-semibold mb-2">{topicName}</h2>
        <a 
          href={url} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-blue-500 hover:text-blue-700 transition-colors duration-200 hover:underline"
          title={url} // Shows full URL on hover
        >
          {formatUrl(url)}
        </a>
        <div className="mt-4 flex flex-wrap gap-2">
          <Badge variant="default">{classification}</Badge>
          <Badge variant="secondary">Comprehensiveness: {comprehensiveness}</Badge>
          <Badge variant="outline">{skillLevel}</Badge>
        </div>
      </CardContent>
    </Card>
  );
}
