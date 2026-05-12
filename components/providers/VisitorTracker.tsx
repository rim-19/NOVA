"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase";

export function VisitorTracker() {
  useEffect(() => {
    // 1. Real-time Presence (Existing logic)
    const channel = supabase.channel('online_presence', {
      config: {
        presence: {
          key: 'visitor',
        },
      },
    });

    channel
      .on('presence', { event: 'sync' }, () => {
        // Presence synced
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({
            online_at: new Date().toISOString(),
            id: Math.random().toString(36).substring(7)
          });
        }
      });

    // 2. Persistent History Tracking
    const logVisit = async () => {
      try {
        // Use sessionStorage to only log once per session
        const SESSION_KEY = "nova_visitor_session";
        let sessionId = sessionStorage.getItem(SESSION_KEY);
        
        if (!sessionId) {
          sessionId = Math.random().toString(36).substring(2) + Date.now().toString(36);
          sessionStorage.setItem(SESSION_KEY, sessionId);
          
          // Log the visit to the database
          await supabase.from("visitor_logs").insert({
            session_id: sessionId,
            page_path: window.location.pathname
          });
        }
      } catch (error) {
        console.error("Error logging visitor:", error);
      }
    };

    logVisit();

    return () => {
      void channel.unsubscribe();
    };
  }, []);

  return null;
}
