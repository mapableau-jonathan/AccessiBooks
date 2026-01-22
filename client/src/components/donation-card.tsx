import { useState } from "react";
import { Heart, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const SUGGESTED_AMOUNTS = [5, 10, 25, 50];

export function DonationCard() {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(10);
  const [customAmount, setCustomAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleDonate = async () => {
    const amountInCents = selectedAmount 
      ? selectedAmount * 100 
      : parseInt(customAmount) * 100;
    
    if (!amountInCents || amountInCents < 100) {
      toast({
        title: "Invalid amount",
        description: "Minimum donation is $1",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiRequest("POST", "/api/donation/create-checkout", {
        amount: amountInCents,
      });
      const data = await response.json();
      
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create donation checkout",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount("");
  };

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value);
    setSelectedAmount(null);
  };

  const currentAmount = selectedAmount || (customAmount ? parseInt(customAmount) : 0);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto mb-2">
          <Heart className="h-10 w-10 text-rose-500" />
        </div>
        <CardTitle>Support AccessiBooks</CardTitle>
        <CardDescription>
          Your donation helps us keep audiobooks accessible for everyone
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="grid grid-cols-4 gap-2">
          {SUGGESTED_AMOUNTS.map((amount) => (
            <Button
              key={amount}
              variant={selectedAmount === amount ? "default" : "outline"}
              className="w-full"
              onClick={() => handleAmountSelect(amount)}
            >
              ${amount}
            </Button>
          ))}
        </div>

        <div className="space-y-2">
          <Label htmlFor="custom-amount">Or enter a custom amount</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              $
            </span>
            <Input
              id="custom-amount"
              type="number"
              min="1"
              max="1000"
              placeholder="Custom amount"
              value={customAmount}
              onChange={(e) => handleCustomAmountChange(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>

        <Button
          className="w-full"
          size="lg"
          onClick={handleDonate}
          disabled={isLoading || currentAmount < 1}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Heart className="h-4 w-4 mr-2" />
              Donate {currentAmount > 0 ? `$${currentAmount}` : ""}
            </>
          )}
        </Button>

        <p className="text-xs text-center text-muted-foreground">
          Donations are processed securely via Stripe
        </p>
      </CardContent>
    </Card>
  );
}
