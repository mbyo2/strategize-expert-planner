import { Navigate } from 'react-router-dom';

// Index redirects to Dashboard (handled by App.tsx routes)
const Index = () => <Navigate to="/" replace />;

export default Index;
