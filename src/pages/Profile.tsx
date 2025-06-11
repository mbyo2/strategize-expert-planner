
import React from 'react';
import PageLayout from '@/components/PageLayout';
import { User } from 'lucide-react';
import UserProfileEditor from '@/components/UserProfileEditor';

const Profile = () => {
  return (
    <PageLayout 
      title="User Profile" 
      subtitle="Manage your profile and preferences"
      icon={<User className="h-6 w-6" />}
    >
      <UserProfileEditor />
    </PageLayout>
  );
};

export default Profile;
