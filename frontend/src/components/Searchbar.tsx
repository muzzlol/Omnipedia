import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"; // Import Dialog components

interface Topic {
  _id: string;
  name: string;
  description: string;
  slug: string;
}

export const SearchBar: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<Topic[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [noResults, setNoResults] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false); // Dialog state
  const [newTopicName, setNewTopicName] = useState(""); // New topic name state

  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchTerm.length > 2) {
        try {
          const response = await axios.get(
            `http://localhost:5001/search/topics?query=${encodeURIComponent(
              searchTerm
            )}`
          );

          if (response.data.topics) {
            setSuggestions(response.data.topics);
            setNoResults(response.data.topics.length === 0);
            setError(null);
          } else {
            setError("Unexpected server response.");
            setSuggestions([]);
            setNoResults(false);
          }
        } catch (error: any) {
          setError("Unable to retrieve suggestions. Please try again later.");
          setSuggestions([]);
          setNoResults(false);
        }
      } else {
        setSuggestions([]);
        setError(null);
        setNoResults(false);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 500); // Debounce time: 500ms

    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const trimmedTerm = searchTerm.trim();
      if (trimmedTerm === "") {
        toast({
          title: "Empty Search",
          description: "Please enter a topic name to search.",
          variant: "destructive",
        });
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:5001/topics/${encodeURIComponent(trimmedTerm)}`
        );
        if (response.status === 200) {
          navigate(`/topics/${response.data.slug}`); // Navigate using slug
        }
      } catch (err: any) {
        if (err.response && err.response.status === 404) {
          toast({
            title: "Topic Not Found",
            description: `The topic "${trimmedTerm}" does not exist.`,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Search Error",
            description:
              "An unexpected error occurred. Please try again later.",
            variant: "destructive",
          });
        }
      }
    }
  };

  // Function to handle creating a new topic
  const handleCreateTopic = async () => {
    const trimmedName = newTopicName.trim();
    console.log(`Attempting to create topic with name: "${trimmedName}"`);

    if (trimmedName === "") {
      toast({
        title: "Invalid Input",
        description: "Topic name cannot be empty.",
        variant: "destructive",
      });
      console.log("Creation aborted: Topic name is empty.");
      return;
    }

    try {
      // Await the POST request to ensure topic is created before redirecting
      const response = await axios.post("http://localhost:5001/topics", {
        name: trimmedName,
      });
      console.log(`POST response status: ${response.status}`);
      if (response.status === 201) {
        const { slug } = response.data;
        console.log(`Topic created with slug: ${slug}`);
        toast({
          title: "Topic Created",
          description: `Topic "${trimmedName}" has been created successfully.`,
          variant: "default",
        });
        setIsDialogOpen(false); // Close the dialog
        setNewTopicName(""); // Reset the input
        navigate(`/topics/${slug}`); // Navigate to the new topic page
      }
    } catch (error: any) {
      console.error("Error during topic creation:", error);
      if (error.response && error.response.status === 400) {
        toast({
          title: "Creation Failed",
          description:
            error.response.data.message || "Topic already exists.",
          variant: "destructive",
        });
      } else if (error.response && error.response.status === 401) {
        toast({
          title: "Unauthorized",
          description: "You need to be logged in to create a topic.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Server Error",
          description:
            "An error occurred while creating the topic. Please try again later.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="w-full max-w-md space-y-4">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
        <Input
          type="search"
          placeholder="Search for a topic..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
          onKeyDown={handleKeyDown}
        />
        {error && <div className="text-red-500">{error}</div>}
        {showSuggestions && (
          <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg">
            {noResults ? (
              <div className="px-3 py-2 text-gray-500">No results found</div>
            ) : (
              suggestions.map((suggestion) => (
                <div
                  key={suggestion._id}
                  className="flex items-center px-3 py-2 cursor-pointer hover:bg-gray-100"
                  onMouseDown={() => {
                    setSearchTerm(suggestion.name);
                    navigate(`/topics/${suggestion.slug}`); // Navigate on click
                  }}
                >
                  <Search className="h-4 w-4 mr-2 text-gray-400" />
                  {suggestion.name}
                </div>
              ))
            )}
            <div className="flex justify-center p-2 border-t">
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full">Create Topic</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create a New Topic</DialogTitle>
                    <DialogDescription>
                      Enter the name of the topic you want to create.
                    </DialogDescription>
                  </DialogHeader>
                  <Input
                    type="text"
                    placeholder="Topic Name"
                    value={newTopicName}
                    onChange={(e) => setNewTopicName(e.target.value)}
                    className="mt-4"
                  />
                  <DialogFooter>
                    <Button onClick={handleCreateTopic}>Create</Button>
                    <Button
                      variant="ghost"
                      onClick={() => setIsDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        )}
      </div>
      {/* Optional: Another Create Topic Button outside suggestions */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button className="w-full">Create Topic</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create a New Topic</DialogTitle>
            <DialogDescription>
              Enter the name of the topic you want to create.
            </DialogDescription>
          </DialogHeader>
          <Input
            type="text"
            placeholder="Topic Name"
            value={newTopicName}
            onChange={(e) => setNewTopicName(e.target.value)}
            className="mt-4"
          />
          <DialogFooter>
            <Button onClick={handleCreateTopic}>Create</Button>
            <Button variant="ghost" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

console.log("Searchbar component loaded");
