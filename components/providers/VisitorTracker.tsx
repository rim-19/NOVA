"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase";

export function VisitorTracker() {
  useEffect(() => {
    console.log("VisitorTracker: Starting tracking...");
    
    // Create a channel for tracking presence
    const channel = supabase.channel('online_presence', {
      config: {
        presence: {
          key: 'visitor',
        },
      },
    });

    channel
      .on('presence', { event: 'sync' }, () => {
        console.log('VisitorTracker: Presence synced', channel.presenceState());
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          console.log("VisitorTracker: Subscribed successfully");
          const trackStatus = await channel.track({
            online_at: new Date().toISOString(),
            id: Math.random().toString(36).substring(7)
          });
          console.log("VisitorTracker: Track status:", trackStatus);
        }
      });

    return () => {
      console.log("VisitorTracker: Cleaning up...");
      void channel.unsubscribe();
    };
  }, []);

  return null;
}
