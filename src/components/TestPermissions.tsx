
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, Maximize, AlertTriangle, Monitor, CheckCircle2, XCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface TestPermissionsProps {
  permissions: {
    fullscreen: boolean;
    audio: boolean;
    video: boolean;
    screenshare: boolean;
  };
  actions: {
    askPermission: (permissions: string[]) => Promise<void>;
  };
  proctorParams: any;
}

const TestPermissions: React.FC<TestPermissionsProps> = ({ 
  permissions, 
  actions,
  proctorParams
}) => {
  const { askPermission } = actions;
  const [loading, setLoading] = useState<string | null>(null);

  const handleGrantPermission = async (permissionType: string) => {
    setLoading(permissionType);
    try {
      if (permissionType === 'fullscreen') {
        // Manually request fullscreen to ensure it works reliably with user gesture
        try {
          if (!document.fullscreenElement) {
            await document.documentElement.requestFullscreen();
          }
        } catch (err) {
          console.error("Manual fullscreen request failed:", err);
        }
      }
      
      if (permissionType === 'audio') {
        try {
          await navigator.mediaDevices.getUserMedia({ audio: true });
        } catch (err) {
          console.error("Manual audio permission request failed:", err);
        }
      }
      
      // Call library method as well to ensure state sync
      await askPermission([permissionType]);
    } catch (error) {
      console.error(`Error granting ${permissionType} permission:`, error);
    } finally {
      setLoading(null);
    }
  };

  // Map permission keys to readable labels and icons
  const permissionConfig: Record<string, { label: string; description: string; icon: any }> = {
    fullscreen: {
      label: 'Full Screen Mode',
      description: 'The test requires full screen mode to prevent distractions.',
      icon: Maximize
    },
    audio: {
      label: 'Microphone Access',
      description: 'Required for audio proctoring.',
      icon: Shield
    },
    video: {
      label: 'Camera Access',
      description: 'Required for video proctoring.',
      icon: Monitor
    },
    screenshare: {
      label: 'Screen Check',
      description: 'Required to ensure no other windows are open.',
      icon: Monitor
    },
    // Fallback for others
  };

  const getPermissionDetails = (key: string) => {
    return permissionConfig[key] || {
      label: key.charAt(0).toUpperCase() + key.slice(1),
      description: `Permission for ${key} is required.`,
      icon: Shield
    };
  };

  // Filter out permissions that are strictly false in proctorParams (if library passes them anyway)
  // But usually library passes only relevant ones in 'permissions' object based on config? 
  // We'll iterate over the 'permissions' object keys passed to us.
  
  const permissionKeys = Object.keys(permissions);
  const allGranted = permissionKeys.every(key => permissions[key as keyof typeof permissions]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg bg-white/95 backdrop-blur shadow-2xl border-0">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Shield className="w-6 h-6 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-slate-900">System Check Required</CardTitle>
          <CardDescription className="text-slate-600 text-base">
            Please grant the following permissions to start your proctored test.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-4">
          <Alert className="bg-blue-50 border-blue-200">
            <Monitor className="h-4 w-4 text-blue-600" />
            <AlertTitle className="text-blue-800 font-semibold">Proctored Environment</AlertTitle>
            <AlertDescription className="text-blue-700">
              Your actions will be monitored. Switching tabs or exiting full screen may be flagged as a violation.
            </AlertDescription>
          </Alert>

          <div className="space-y-3">
            {permissionKeys.map((key) => {
              const info = getPermissionDetails(key);
              const granted = permissions[key as keyof typeof permissions];
              const Icon = info.icon;
              
              // Skip if explicitly disabled in params and not required (naive check)
              // But if it's in 'permissions' prop, library likely expects it or tracks it.
              
              return (
                <div 
                  key={key}
                  className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-200 ${
                    granted 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-slate-50 border-slate-200 hover:border-blue-300'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-lg ${granted ? 'bg-green-100' : 'bg-slate-200'}`}>
                      <Icon className={`w-5 h-5 ${granted ? 'text-green-600' : 'text-slate-600'}`} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 flex items-center gap-2">
                        {info.label}
                        {granted && <CheckCircle2 className="w-4 h-4 text-green-600" />}
                      </h4>
                      <p className="text-sm text-slate-500">{info.description}</p>
                    </div>
                  </div>
                  
                  {!granted && (
                    <Button 
                      onClick={() => handleGrantPermission(key)}
                      disabled={loading === key}
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                    >
                      {loading === key ? 'Allowing...' : 'Allow'}
                    </Button>
                  )}
                </div>
              );
            })}
            
            {permissionKeys.length === 0 && (
                <div className="text-center text-gray-500 italic">No specific permissions required.</div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-100">
             {allGranted ? (
               <div className="text-center animate-in fade-in zoom-in duration-300">
                 <p className="text-green-600 font-medium mb-2">All checks passed!</p>
                 <p className="text-sm text-slate-500">Starting test environment...</p>
                 {/* Fallback button if auto-start hangs */}
                 <Button variant="link" className="mt-2 text-xs text-blue-500" onClick={() => window.location.reload()}>
                    Stuck? Click to reload
                 </Button>
               </div>
             ) : (
               <p className="text-center text-sm text-slate-400">
                 Complete all checks to proceed
               </p>
             )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TestPermissions;
