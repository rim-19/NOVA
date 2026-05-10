"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase";

export function VisitorTracker() {
  useEffect(() => {
    // Generate a robust unique session ID for this visitor
    const sessionId = `visitor_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    
    const channel = supabase.channel('online-visitors', {
      config: {
        presence: {
          key: sessionId,
        },
      },
    });

    channel
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({
            online_at: new Date().toISOString(),
          });
        }
      });

    return () => {
      void channel.unsubscribe();
    };
  }, []);

  return null; // This component doesn't render anything
}
