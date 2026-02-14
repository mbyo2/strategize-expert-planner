
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface TestUser {
  email: string;
  password: string;
  name: string;
  role: 'admin' | 'manager' | 'analyst' | 'viewer';
  organization?: string;
}

// Test users with different roles for easy testing
export const TEST_USERS: TestUser[] = [
  {
    email: 'admin@techcorp.com',
    password: 'password123',
    name: 'Alex Admin',
    role: 'admin',
    organization: 'Tech Corp'
  },
  {
    email: 'manager@techcorp.com',
    password: 'password123',
    name: 'Morgan Manager',
    role: 'manager',
    organization: 'Tech Corp'
  },
  {
    email: 'analyst@techcorp.com',
    password: 'password123',
    name: 'Ana Analyst',
    role: 'analyst',
    organization: 'Tech Corp'
  },
  {
    email: 'viewer@techcorp.com',
    password: 'password123',
    name: 'Victor Viewer',
    role: 'viewer',
    organization: 'Tech Corp'
  },
  {
    email: 'ops@defensecommand.mil',
    password: 'password123',
    name: 'Colonel Ops',
    role: 'admin',
    organization: 'Defense Command'
  },
  {
    email: 'intel@defensecommand.mil',
    password: 'password123',
    name: 'Major Intel',
    role: 'manager',
    organization: 'Defense Command'
  },
];

const createSampleData = async (userId: string, role: string) => {
  console.log(`Creating sample data for ${role}...`);

  // Create sample strategic goals
  const goals = [
    {
      user_id: userId,
      name: 'Increase Market Share',
      description: 'Expand our market presence by 25% in the next quarter',
      status: 'in_progress',
      priority: 'high',
      category: 'growth',
      progress: 65,
      target_value: 100,
      current_value: 65,
      start_date: new Date('2024-01-01').toISOString(),
      due_date: new Date('2024-06-30').toISOString(),
    },
    {
      user_id: userId,
      name: 'Digital Transformation',
      description: 'Modernize our technology stack and improve operational efficiency',
      status: 'planned',
      priority: 'medium',
      category: 'technology',
      progress: 30,
      target_value: 100,
      current_value: 30,
      start_date: new Date('2024-02-01').toISOString(),
      due_date: new Date('2024-12-31').toISOString(),
    }
  ];

  await supabase.from('strategic_goals').upsert(goals, { onConflict: 'user_id,name' });

  // Create sample planning initiatives (for managers and admins)
  if (role === 'admin' || role === 'manager') {
    const initiatives = [
      {
        name: 'Product Launch Campaign',
        description: 'Launch our new product line with comprehensive marketing strategy',
        status: 'in_progress',
        priority: 'high',
        progress: 45,
        budget: 150000,
        currency: 'USD',
        start_date: new Date('2024-03-01').toISOString(),
        end_date: new Date('2024-08-30').toISOString(),
        owner_id: userId,
      },
      {
        name: 'Team Expansion Initiative',
        description: 'Hire 15 new team members across engineering and sales',
        status: 'planned',
        priority: 'medium',
        progress: 20,
        budget: 500000,
        currency: 'USD',
        start_date: new Date('2024-04-01').toISOString(),
        end_date: new Date('2024-10-31').toISOString(),
        owner_id: userId,
      }
    ];

    await supabase.from('planning_initiatives').upsert(initiatives, { onConflict: 'name' });
  }

  // Create sample industry metrics (for admins and managers)
  if (role === 'admin' || role === 'manager') {
    const metrics = [
      {
        name: 'Market Growth Rate',
        category: 'market',
        value: 8.5,
        previous_value: 7.2,
        change_percentage: 18.1,
        trend: 'up',
        source: 'Industry Report Q1 2024'
      },
      {
        name: 'Customer Satisfaction Score',
        category: 'customer',
        value: 4.2,
        previous_value: 3.9,
        change_percentage: 7.7,
        trend: 'up',
        source: 'Customer Survey'
      },
      {
        name: 'Competitive Index',
        category: 'competition',
        value: 75.3,
        previous_value: 78.1,
        change_percentage: -3.6,
        trend: 'down',
        source: 'Market Analysis'
      }
    ];

    await supabase.from('industry_metrics').upsert(metrics, { onConflict: 'name,category' });
  }

  // Create sample market changes (for analysts and above)
  if (role !== 'viewer') {
    const changes = [
      {
        title: 'New Competitor Enters Market',
        description: 'A well-funded startup has launched a competing product with innovative features',
        impact_level: 'high',
        category: 'competition',
        source: 'Market Intelligence',
      },
      {
        title: 'Regulatory Changes in Industry',
        description: 'New compliance requirements will affect product development timelines',
        impact_level: 'medium',
        category: 'regulatory',
        source: 'Government Announcement',
      }
    ];

    await supabase.from('market_changes').upsert(changes, { onConflict: 'title' });
  }

  console.log(`Sample data created successfully for ${role}`);
};

export const createTestUser = async (testUser: TestUser) => {
  try {
    console.log(`Creating test user: ${testUser.email}`);
    
    // Sign up the user
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email: testUser.email,
      password: testUser.password,
      options: {
        data: {
          name: testUser.name
        },
        emailRedirectTo: `${window.location.origin}/`
      }
    });

    if (signUpError) {
      console.error('Sign up error:', signUpError);
      
      // If user already exists, that's fine for test purposes
      if (signUpError.message?.includes('already registered')) {
        console.log(`User ${testUser.email} already exists, that's okay for testing`);
        return { user: null, session: null, message: 'User already exists' };
      }
      
      throw signUpError;
    }

    if (!authData.user) {
      throw new Error('User creation failed - no user returned');
    }

    console.log(`Successfully created user: ${testUser.email} with ID: ${authData.user.id}`);

    // Wait a moment for the user to be fully created
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Create or update profile
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: authData.user.id,
        name: testUser.name,
        email: testUser.email,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${testUser.email}`,
        organization_id: testUser.organization === 'Tech Corp' ? '550e8400-e29b-41d4-a716-446655440001' : null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'id'
      });

    if (profileError) {
      console.error('Profile creation error:', profileError);
      // Don't throw here, profile creation is secondary
    } else {
      console.log(`Created profile for user: ${testUser.email}`);
    }

    // Set or update user role
    const { error: roleError } = await supabase
      .from('user_roles')
      .upsert({
        user_id: authData.user.id,
        role: testUser.role,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      });

    if (roleError) {
      console.error('Role assignment error:', roleError);
      // Don't throw here, role assignment is secondary
    } else {
      console.log(`Assigned role ${testUser.role} to user: ${testUser.email}`);
    }

    // Create sample data for the user
    await createSampleData(authData.user.id, testUser.role);

    return { user: authData.user, session: authData.session };
  } catch (error) {
    console.error('Error creating test user:', error);
    throw error;
  }
};

export const createAllTestUsers = async () => {
  const results = [];
  
  for (const testUser of TEST_USERS) {
    try {
      console.log(`Creating test user: ${testUser.email}`);
      const result = await createTestUser(testUser);
      
      if (result.message === 'User already exists') {
        results.push({ email: testUser.email, success: true, message: 'Already exists' });
        toast.info(`User ${testUser.email} already exists`);
      } else {
        results.push({ email: testUser.email, success: true });
        toast.success(`Created test user: ${testUser.name}`);
      }
    } catch (error: any) {
      console.error(`Failed to create ${testUser.email}:`, error);
      results.push({ email: testUser.email, success: false, error: error.message });
      
      // If user already exists, that's okay
      if (error.message?.includes('already registered')) {
        toast.info(`User ${testUser.email} already exists`);
      } else {
        toast.error(`Failed to create ${testUser.email}: ${error.message}`);
      }
    }
    
    // Add a small delay between user creations
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  return results;
};
