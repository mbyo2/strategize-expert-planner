
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
  }
];

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
        }
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
