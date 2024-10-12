import { Button } from "./button";
import { useToast } from '@/hooks/use-toast';

export const ToastDemo: React.FC = () => {
  const { toast } = useToast();

  return (
    <Button
      onClick={() => {
        toast({
          title: "Test Toast",
          description: "This is a test toast notification.",
        });
      }}
    >
      Show Toast
    </Button>
  );
};