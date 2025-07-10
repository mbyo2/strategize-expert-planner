
import { useState, useEffect, useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { notifyEvent } from '@/services/notificationsService';

// This hook centralizes all real-time updates and triggers notifications
export const useRealTimeUpdates = () => {
  const [isConnected, setIsConnected] = useState(false);
  
  // Setup real-time listeners
  const setupRealtimeListeners = useCallback(() => {
    // Set up real-time subscription for strategy reviews
    const reviewsChannel = supabase
      .channel('strategy-reviews-changes')
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'strategy_reviews' 
        },
        async (payload) => {
          console.log('Strategy review change detected:', payload);
          
          if (payload.eventType === 'INSERT') {
            // Notify about new strategy review
            await notifyEvent(
              'strategy_review_created',
              payload.new.id,
              'strategy_review',
              ['manager', 'admin']
            );
          } else if (payload.eventType === 'UPDATE') {
            // Notify about updated strategy review
            await notifyEvent(
              'strategy_review_updated',
              payload.new.id,
              'strategy_review',
              ['manager', 'admin']
            );
          }
        }
      )
      .subscribe();
      
    // Set up real-time subscription for strategic goals
    const goalsChannel = supabase
      .channel('strategic-goals-changes')
      .on(
        'postgres_changes',
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'strategic_goals' 
        },
        async (payload) => {
          console.log('Strategic goal change detected:', payload);
          
          // If status changed to completed or target reached
          if (
            (payload.old.status !== 'completed' && payload.new.status === 'completed') ||
            (payload.new.progress === 100 && payload.old.progress !== 100)
          ) {
            // Notify about goal achievement
            await notifyEvent(
              'goal_achieved',
              payload.new.id,
              'strategic_goal',
              ['analyst', 'manager', 'admin']
            );
          }
        }
      )
      .subscribe();
      
    // Set up real-time subscription for planning initiatives
    const initiativesChannel = supabase
      .channel('planning-initiatives-changes')
      .on(
        'postgres_changes',
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'planning_initiatives' 
        },
        async (payload) => {
          console.log('Planning initiative change detected:', payload);
          
          // If status changed to completed
          if (payload.old.status !== 'completed' && payload.new.status === 'completed') {
            // Notify about initiative completion
            await notifyEvent(
              'initiative_completed',
              payload.new.id,
              'planning_initiative',
              ['manager', 'admin']
            );
          }
        }
      )
      .subscribe();
      
    // Set up real-time subscription for market changes
    const marketChangesChannel = supabase
      .channel('market-changes-changes')
      .on(
        'postgres_changes',
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'market_changes' 
        },
        async (payload) => {
          console.log('New market change detected:', payload);
          
          // Only notify for high impact changes
          if (payload.new.impact_level === 'high') {
            // Notify about market change
            await notifyEvent(
              'market_change_detected',
              payload.new.id,
              'market_change',
              ['analyst', 'manager', 'admin']
            );
          }
        }
      )
      .subscribe();
      
    setIsConnected(true);
    
    return { 
      reviewsChannel,
      goalsChannel,
      initiativesChannel,
      marketChangesChannel
    };
  }, []);
  
  // Cleanup real-time listeners
  const cleanupRealtimeListeners = useCallback((channels) => {
    if (channels) {
      supabase.removeChannel(channels.reviewsChannel);
      supabase.removeChannel(channels.goalsChannel);
      supabase.removeChannel(channels.initiativesChannel);
      supabase.removeChannel(channels.marketChangesChannel);
    }
    setIsConnected(false);
  }, []);
  
  // Return hook state and functions
  return { 
    isConnected,
    setupRealtimeListeners,
    cleanupRealtimeListeners 
  };
};
