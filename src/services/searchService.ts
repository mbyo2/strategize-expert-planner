
import { customSupabase } from "@/integrations/supabase/customClient";
import { sanitizeInput } from "@/utils/securityUtils";

export interface SearchResult {
  id: string;
  title: string;
  description?: string;
  type: 'goal' | 'initiative' | 'review' | 'recommendation' | 'metric' | 'change';
  url: string;
  relevance: number;
}

export interface SearchFilters {
  types?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  status?: string[];
}

export const searchContent = async (
  query: string,
  filters?: SearchFilters,
  limit: number = 20
): Promise<SearchResult[]> => {
  const sanitizedQuery = sanitizeInput(query.trim());
  
  if (!sanitizedQuery || sanitizedQuery.length < 2) {
    return [];
  }

  try {
    const results: SearchResult[] = [];

    // Search strategic goals
    if (!filters?.types || filters.types.includes('goal')) {
      const { data: goals } = await customSupabase
        .from('strategic_goals')
        .select('id, name, description, status')
        .or(`name.ilike.%${sanitizedQuery}%,description.ilike.%${sanitizedQuery}%`)
        .limit(limit);

      if (goals) {
        results.push(...goals.map(goal => ({
          id: goal.id,
          title: goal.name,
          description: goal.description,
          type: 'goal' as const,
          url: `/goals#${goal.id}`,
          relevance: calculateRelevance(sanitizedQuery, goal.name, goal.description),
        })));
      }
    }

    // Search planning initiatives
    if (!filters?.types || filters.types.includes('initiative')) {
      const { data: initiatives } = await customSupabase
        .from('planning_initiatives')
        .select('id, name, description, status')
        .or(`name.ilike.%${sanitizedQuery}%,description.ilike.%${sanitizedQuery}%`)
        .limit(limit);

      if (initiatives) {
        results.push(...initiatives.map(initiative => ({
          id: initiative.id,
          title: initiative.name,
          description: initiative.description,
          type: 'initiative' as const,
          url: `/planning#${initiative.id}`,
          relevance: calculateRelevance(sanitizedQuery, initiative.name, initiative.description),
        })));
      }
    }

    // Search strategy reviews
    if (!filters?.types || filters.types.includes('review')) {
      const { data: reviews } = await customSupabase
        .from('strategy_reviews')
        .select('id, title, description, status')
        .or(`title.ilike.%${sanitizedQuery}%,description.ilike.%${sanitizedQuery}%`)
        .limit(limit);

      if (reviews) {
        results.push(...reviews.map(review => ({
          id: review.id,
          title: review.title,
          description: review.description,
          type: 'review' as const,
          url: `/planning#reviews`,
          relevance: calculateRelevance(sanitizedQuery, review.title, review.description),
        })));
      }
    }

    // Search recommendations
    if (!filters?.types || filters.types.includes('recommendation')) {
      const { data: recommendations } = await customSupabase
        .from('recommendations')
        .select('id, title, description, status')
        .or(`title.ilike.%${sanitizedQuery}%,description.ilike.%${sanitizedQuery}%`)
        .limit(limit);

      if (recommendations) {
        results.push(...recommendations.map(rec => ({
          id: rec.id,
          title: rec.title,
          description: rec.description,
          type: 'recommendation' as const,
          url: `/#recommendations`,
          relevance: calculateRelevance(sanitizedQuery, rec.title, rec.description),
        })));
      }
    }

    // Search industry metrics
    if (!filters?.types || filters.types.includes('metric')) {
      const { data: metrics } = await customSupabase
        .from('industry_metrics')
        .select('id, name, category, source')
        .or(`name.ilike.%${sanitizedQuery}%,category.ilike.%${sanitizedQuery}%`)
        .limit(limit);

      if (metrics) {
        results.push(...metrics.map(metric => ({
          id: metric.id,
          title: metric.name,
          description: `Category: ${metric.category}`,
          type: 'metric' as const,
          url: `/industry#metrics`,
          relevance: calculateRelevance(sanitizedQuery, metric.name, metric.category),
        })));
      }
    }

    // Search market changes
    if (!filters?.types || filters.types.includes('change')) {
      const { data: changes } = await customSupabase
        .from('market_changes')
        .select('id, title, description, category')
        .or(`title.ilike.%${sanitizedQuery}%,description.ilike.%${sanitizedQuery}%`)
        .limit(limit);

      if (changes) {
        results.push(...changes.map(change => ({
          id: change.id,
          title: change.title,
          description: change.description,
          type: 'change' as const,
          url: `/industry#changes`,
          relevance: calculateRelevance(sanitizedQuery, change.title, change.description),
        })));
      }
    }

    // Sort by relevance and limit results
    return results
      .sort((a, b) => b.relevance - a.relevance)
      .slice(0, limit);

  } catch (error) {
    console.error('Search error:', error);
    return [];
  }
};

const calculateRelevance = (query: string, title: string, description?: string): number => {
  const queryLower = query.toLowerCase();
  const titleLower = title.toLowerCase();
  const descLower = description?.toLowerCase() || '';

  let relevance = 0;

  // Exact title match gets highest score
  if (titleLower === queryLower) {
    relevance += 100;
  }
  // Title starts with query
  else if (titleLower.startsWith(queryLower)) {
    relevance += 80;
  }
  // Title contains query
  else if (titleLower.includes(queryLower)) {
    relevance += 60;
  }

  // Description contains query
  if (descLower.includes(queryLower)) {
    relevance += 30;
  }

  // Boost score for shorter titles (more specific matches)
  if (title.length < 50) {
    relevance += 10;
  }

  return relevance;
};

export const getSearchSuggestions = async (query: string): Promise<string[]> => {
  const sanitizedQuery = sanitizeInput(query.trim());
  
  if (!sanitizedQuery || sanitizedQuery.length < 2) {
    return [];
  }

  try {
    const suggestions = new Set<string>();

    // Get suggestions from goal names
    const { data: goals } = await customSupabase
      .from('strategic_goals')
      .select('name')
      .ilike('name', `%${sanitizedQuery}%`)
      .limit(5);

    goals?.forEach(goal => suggestions.add(goal.name));

    // Get suggestions from initiative names
    const { data: initiatives } = await customSupabase
      .from('planning_initiatives')
      .select('name')
      .ilike('name', `%${sanitizedQuery}%`)
      .limit(5);

    initiatives?.forEach(initiative => suggestions.add(initiative.name));

    return Array.from(suggestions).slice(0, 8);
  } catch (error) {
    console.error('Failed to get search suggestions:', error);
    return [];
  }
};
