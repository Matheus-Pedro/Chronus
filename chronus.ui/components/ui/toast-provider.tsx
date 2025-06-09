"use client";

import { useToast } from "@/lib/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, CheckCircle, AlertTriangle, AlertCircle, Info } from "lucide-react";

const variantIcons = {
  default: Info,
  success: CheckCircle,
  destructive: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const variantClasses = {
  default: "bg-background text-foreground border",
  success: "bg-green-50 text-green-900 border-green-200 dark:bg-green-950 dark:text-green-100",
  destructive: "bg-red-50 text-red-900 border-red-200 dark:bg-red-950 dark:text-red-100",
  warning: "bg-yellow-50 text-yellow-900 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-100",
  info: "bg-blue-50 text-blue-900 border-blue-200 dark:bg-blue-950 dark:text-blue-100",
};

export function ToastProvider() {
  const { toasts, dismiss } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[100] space-y-2 max-w-sm w-full">
      {toasts.map((toast) => {
        const Icon = variantIcons[toast.variant || 'default'];
        const classes = variantClasses[toast.variant || 'default'];
        
        return (
          <Card 
            key={toast.id}
            className={`${classes} shadow-lg animate-in slide-in-from-right duration-300`}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Icon className="h-5 w-5 flex-shrink-0 mt-0.5" />
                
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm">{toast.title}</div>
                  {toast.description && (
                    <div className="text-sm opacity-90 mt-1">
                      {toast.description}
                    </div>
                  )}
                  {toast.action && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-2 h-8 px-2"
                      onClick={toast.action.onClick}
                    >
                      {toast.action.label}
                    </Button>
                  )}
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-1 h-auto opacity-70 hover:opacity-100"
                  onClick={() => dismiss(toast.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
} 