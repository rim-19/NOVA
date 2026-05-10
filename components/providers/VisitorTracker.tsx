"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase";

export function VisitorTracker() {
  useEffect(() => {
    // Generate a simple unique session ID for this visitor
    const sessionId = Math.random().toString(36).substring(7);
    
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
