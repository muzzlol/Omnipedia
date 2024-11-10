import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { PlusCircle } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"
import axios from 'axios';

interface ResourceData {
  _id: string;
  type: string;
  url: string;
  classification: string;
  comprehensiveness: number;
  skillLevel: string;
  upvotes?: number;
  downvotes?: number;
  hasUpvoted?: boolean;
  hasDownvoted?: boolean;
  isBookmarked?: boolean;
}

interface Props {
  topicId: string;
  onAddResource: (resource: ResourceData) => void;
}

export default function AddResource({ topicId, onAddResource }: Props) {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState('');
  const [type, setType] = useState('');
  const [skillLevel, setSkillLevel] = useState('');
  const [comprehensiveness, setComprehensiveness] = useState(50);
  const [classification, setClassification] = useState('');

  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'http://localhost:5001/resources',
        {
          type,
          url,
          classification,
          comprehensiveness,
          skillLevel,
          topicId,
        },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      onAddResource(response.data);
      setOpen(false);
      // Reset form fields
      setUrl('');
      setType('');
      setSkillLevel('');
      setComprehensiveness(50);
      setClassification('');
      toast({
        title: 'Resource Added',
        description: 'Your resource has been successfully added.',
      });
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.response?.data?.message || 'Failed to add resource.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <PlusCircle className="h-4 w-4" />
          Add Resource
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Resource</DialogTitle>
          <DialogDescription>
            Enter the details of the new resource you'd like to add.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 py-4 px-2">
            {/* URL Field */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="url" className="text-right">
                URL
              </Label>
              <Input
                id="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            
            {/* Type Field */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">
                Type
              </Label>
              <Input
                id="type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            
            {/* Skill Level Select */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="skillLevel" className="text-right">
                Skill
              </Label>
              <Select value={skillLevel} onValueChange={setSkillLevel} required>
                <SelectTrigger className="col-span-3" id="skillLevel">
                  <SelectValue placeholder="Select skill level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner" className="text-green-400 font-medium">Beginner</SelectItem>
                  <SelectItem value="intermediary" className="text-yellow-400 font-medium">Intermediary</SelectItem>
                  <SelectItem value="advanced" className="text-red-400 font-medium">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Classification Select */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="classification" className="text-right">
                Classify
              </Label>
              <Select value={classification} onValueChange={setClassification} required>
                <SelectTrigger className="col-span-3" id="classification">
                  <SelectValue placeholder="Select classification" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="free" className="text-green-400 font-medium">Free</SelectItem>
                  <SelectItem value="paid" className="text-red-400 font-medium">Paid</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Comprehensiveness Slider */}
            <div className="grid gap-4">
              <Label htmlFor="comprehensiveness" className="text-center">
                Comprehensiveness
              </Label>
              <div className="space-y-2">
                <Slider
                  id="comprehensiveness"
                  min={1}
                  max={100}
                  step={1}
                  value={[comprehensiveness]}
                  onValueChange={(value) => setComprehensiveness(value[0])}
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span className="text-green-400">1</span>
                  <span>{comprehensiveness}</span>
                  <span className="text-red-400">100</span>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Add Resource</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
