import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

interface User {
  email: string;
  firstName: string;
  lastName: string;
}

interface ApiError {
  message: string;
}

interface Settings {
  currentEmail: string;
  newEmail: string;
  firstName: string;
  lastName: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const UserProfileMenu = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [settings, setSettings] = useState<Settings>({
    currentEmail: "",
    newEmail: "",
    firstName: "",
    lastName: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    fetchUserProfile();
  }, []);

  // Enhanced token handling
  const getAuthToken = (): string | null => {
    return localStorage.getItem("token");
  };

  const clearAuthData = () => {
    localStorage.removeItem("token");
    sessionStorage.clear(); // Clear any session data
  };

  const fetchUserProfile = async () => {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error("No authentication token found");
      }

      const API_URL = import.meta.env.VITE_API_URL || "/api";
      const response = await fetch(`${API_URL}/users/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        // Token expired or invalid
        clearAuthData();
        navigate("/login");
        throw new Error("Your session has expired. Please login again.");
      }

      if (!response.ok) {
        const error: ApiError = await response.json();
        throw new Error(error.message || "Failed to fetch user profile");
      }

      const data = await response.json();
      setUser(data.user);
      setSettings((prev) => ({
        ...prev,
        currentEmail: data.user?.email || "",
        firstName: data.user?.firstName || "",
        lastName: data.user?.lastName || "",
      }));
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load user profile. Please try again.",
        variant: "destructive",
      });

      // If token issue, redirect to login
      if (
        error instanceof Error &&
        (error.message.includes("token") || error.message.includes("session"))
      ) {
        navigate("/login");
      }
    }
  };

  const handleLogout = () => {
    try {
      // Clear auth data from storage
      clearAuthData();

      // Close dialog
      setShowLogoutDialog(false);

      // Show success message
      toast({
        title: "Logged Out",
        description: "You have been logged out successfully",
      });

      // Navigate to login page
      navigate("/login");
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred during logout",
        variant: "destructive",
      });
    }
  };

  const handleSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate new password fields if attempting to change password
    if (settings.newPassword || settings.confirmPassword) {
      if (settings.newPassword !== settings.confirmPassword) {
        toast({
          title: "Error",
          description: "New passwords do not match",
          variant: "destructive",
        });
        return;
      }

      if (!settings.currentPassword) {
        toast({
          title: "Error",
          description: "Current password is required to change password",
          variant: "destructive",
        });
        return;
      }
    }

    // Validate email format if attempting to change email
    if (settings.newEmail && !/^\S+@\S+\.\S+$/.test(settings.newEmail)) {
      toast({
        title: "Error",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    // Validate names if they are changed
    if (settings.firstName && settings.firstName.trim().length < 2) {
      toast({
        title: "Error",
        description: "First name must be at least 2 characters",
        variant: "destructive",
      });
      return;
    }

    if (settings.lastName && settings.lastName.trim().length < 2) {
      toast({
        title: "Error",
        description: "Last name must be at least 2 characters",
        variant: "destructive",
      });
      return;
    }

    // Check if any changes are being made
    if (
      !settings.newEmail &&
      !settings.currentPassword &&
      !settings.newPassword &&
      settings.firstName === user?.firstName &&
      settings.lastName === user?.lastName
    ) {
      toast({
        title: "No Changes",
        description: "No changes to save",
        variant: "default",
      });
      return;
    }

    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error("No authentication token found");
      }

      const API_URL = import.meta.env.VITE_API_URL || "/api";
      const response = await fetch(`${API_URL}/users/settings`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: settings.newEmail || settings.currentEmail,
          firstName: settings.firstName,
          lastName: settings.lastName,
          currentPassword: settings.currentPassword,
          newPassword: settings.newPassword,
        }),
      });

      if (!response.ok) {
        const error: ApiError = await response.json();
        throw new Error(error.message || "Failed to update settings");
      }

      const data = await response.json();
      setUser(data.user);
      toast({
        title: "Success",
        description: "Settings updated successfully",
      });
      setShowSettingsDialog(false);

      // Clear sensitive fields but keep email
      setSettings((prev) => ({
        ...prev,
        newEmail: "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));

      // Refresh user profile to ensure we have the latest data
      fetchUserProfile();
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to update settings",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-16 w-20 rounded-full">
            <span className="sr-only">Open user menu</span>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
              {user?.firstName?.[0] || "U"}
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuItem onClick={() => navigate("/profile")}>
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setShowSettingsDialog(true)}>
            Settings
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-red-600"
            onClick={() => setShowLogoutDialog(true)}
          >
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Logout Confirmation Dialog */}
      <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Logout</DialogTitle>
            <DialogDescription>
              Are you sure you want to logout? You will need to login again to
              access your account.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowLogoutDialog(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleLogout}>
              Logout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Settings Dialog */}
      <Dialog open={showSettingsDialog} onOpenChange={setShowSettingsDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Account Settings</DialogTitle>
            <DialogDescription>
              Update your email and password here.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSettingsSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={settings.firstName}
                    onChange={(e) =>
                      setSettings({ ...settings, firstName: e.target.value })
                    }
                    placeholder="First Name"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={settings.lastName}
                    onChange={(e) =>
                      setSettings({ ...settings, lastName: e.target.value })
                    }
                    placeholder="Last Name"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="currentEmail">Current Email</Label>
                <Input
                  id="currentEmail"
                  type="email"
                  value={settings.currentEmail}
                  readOnly
                  disabled
                  className="bg-gray-100"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="newEmail">New Email</Label>
                <Input
                  id="newEmail"
                  type="email"
                  value={settings.newEmail}
                  onChange={(e) =>
                    setSettings({ ...settings, newEmail: e.target.value })
                  }
                  placeholder="new.email@example.com"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={settings.currentPassword}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      currentPassword: e.target.value,
                    })
                  }
                  placeholder="Enter current password"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={settings.newPassword}
                  onChange={(e) =>
                    setSettings({ ...settings, newPassword: e.target.value })
                  }
                  placeholder="Enter new password"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={settings.confirmPassword}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      confirmPassword: e.target.value,
                    })
                  }
                  placeholder="Confirm new password"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowSettingsDialog(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UserProfileMenu;
