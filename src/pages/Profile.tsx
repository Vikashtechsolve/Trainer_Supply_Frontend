import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  lastLogin?: string;
}

const Profile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          "http://localhost:5000/api/users/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch user profile");
        }

        const data = await response.json();
        setUser(data.user);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load user profile. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [toast]);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">User Profile</h1>
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Your personal and account details</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-4 w-[300px]" />
              <Skeleton className="h-4 w-[150px]" />
            </div>
          ) : user ? (
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-2">
                <div className="font-medium">Name:</div>
                <div>{`${user.firstName} ${user.lastName}`}</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="font-medium">Email:</div>
                <div>{user.email}</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="font-medium">Role:</div>
                <div className="capitalize">{user.role}</div>
              </div>
              {user.lastLogin && (
                <div className="grid grid-cols-2 gap-2">
                  <div className="font-medium">Last Login:</div>
                  <div>{new Date(user.lastLogin).toLocaleString()}</div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              Failed to load profile information
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
