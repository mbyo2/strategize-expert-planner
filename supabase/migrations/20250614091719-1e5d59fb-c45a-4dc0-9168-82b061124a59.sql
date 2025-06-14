
-- Create table for tactical positions and units
CREATE TABLE public.tactical_units (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  unit_id TEXT NOT NULL UNIQUE,
  unit_type TEXT NOT NULL CHECK (unit_type IN ('soldier', 'vehicle', 'base', 'objective')),
  callsign TEXT NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  altitude DECIMAL(8, 2) DEFAULT 0,
  heading DECIMAL(5, 2) DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'compromised', 'destroyed')),
  last_contact TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for drone data
CREATE TABLE public.drones (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  drone_id TEXT NOT NULL UNIQUE,
  model TEXT NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  altitude DECIMAL(8, 2) NOT NULL,
  battery_level INTEGER NOT NULL DEFAULT 100 CHECK (battery_level >= 0 AND battery_level <= 100),
  status TEXT NOT NULL DEFAULT 'operational' CHECK (status IN ('operational', 'maintenance', 'lost', 'returning')),
  mission_type TEXT CHECK (mission_type IN ('reconnaissance', 'surveillance', 'combat', 'supply')),
  target_coordinates JSONB,
  camera_feed_url TEXT,
  operator_id UUID,
  last_telemetry TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for AI tactical recommendations
CREATE TABLE public.ai_recommendations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  recommendation_type TEXT NOT NULL CHECK (recommendation_type IN ('tactical', 'threat_assessment', 'route_optimization', 'resource_allocation')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  affected_units TEXT[] DEFAULT '{}',
  coordinates JSONB,
  confidence_score DECIMAL(3, 2) CHECK (confidence_score >= 0 AND confidence_score <= 1),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'acknowledged', 'implemented', 'dismissed')),
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for threat intelligence
CREATE TABLE public.threat_intelligence (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  threat_type TEXT NOT NULL CHECK (threat_type IN ('enemy_movement', 'weapon_system', 'ied', 'sniper', 'artillery')),
  severity TEXT NOT NULL DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  radius DECIMAL(8, 2) NOT NULL DEFAULT 100,
  description TEXT NOT NULL,
  source TEXT NOT NULL CHECK (source IN ('drone', 'satellite', 'ground_intel', 'signal_int', 'human_int')),
  verified BOOLEAN NOT NULL DEFAULT false,
  reported_by UUID,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for mission objectives
CREATE TABLE public.mission_objectives (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  objective_id TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  objective_type TEXT NOT NULL CHECK (objective_type IN ('secure', 'eliminate', 'extract', 'defend', 'reconnaissance')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  radius DECIMAL(8, 2) NOT NULL DEFAULT 50,
  status TEXT NOT NULL DEFAULT 'assigned' CHECK (status IN ('assigned', 'in_progress', 'completed', 'failed', 'cancelled')),
  assigned_units TEXT[] DEFAULT '{}',
  deadline TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.tactical_units ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.drones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.threat_intelligence ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mission_objectives ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users (military personnel)
CREATE POLICY "Military personnel can view tactical units" ON public.tactical_units FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Military personnel can update tactical units" ON public.tactical_units FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Military personnel can view drones" ON public.drones FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Military personnel can update drones" ON public.drones FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Military personnel can view AI recommendations" ON public.ai_recommendations FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Military personnel can update AI recommendations" ON public.ai_recommendations FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Military personnel can view threat intelligence" ON public.threat_intelligence FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Military personnel can update threat intelligence" ON public.threat_intelligence FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Military personnel can view mission objectives" ON public.mission_objectives FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Military personnel can update mission objectives" ON public.mission_objectives FOR ALL USING (auth.role() = 'authenticated');

-- Enable real-time updates
ALTER TABLE public.tactical_units REPLICA IDENTITY FULL;
ALTER TABLE public.drones REPLICA IDENTITY FULL;
ALTER TABLE public.ai_recommendations REPLICA IDENTITY FULL;
ALTER TABLE public.threat_intelligence REPLICA IDENTITY FULL;
ALTER TABLE public.mission_objectives REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.tactical_units;
ALTER PUBLICATION supabase_realtime ADD TABLE public.drones;
ALTER PUBLICATION supabase_realtime ADD TABLE public.ai_recommendations;
ALTER PUBLICATION supabase_realtime ADD TABLE public.threat_intelligence;
ALTER PUBLICATION supabase_realtime ADD TABLE public.mission_objectives;

-- Create indexes for better performance
CREATE INDEX idx_tactical_units_position ON public.tactical_units (latitude, longitude);
CREATE INDEX idx_drones_position ON public.drones (latitude, longitude);
CREATE INDEX idx_threat_intelligence_position ON public.threat_intelligence (latitude, longitude);
CREATE INDEX idx_mission_objectives_position ON public.mission_objectives (latitude, longitude);
CREATE INDEX idx_tactical_units_status ON public.tactical_units (status);
CREATE INDEX idx_drones_status ON public.drones (status);
CREATE INDEX idx_ai_recommendations_priority ON public.ai_recommendations (priority);
CREATE INDEX idx_threat_intelligence_severity ON public.threat_intelligence (severity);
