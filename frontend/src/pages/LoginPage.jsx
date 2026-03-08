import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signIn, signUp } from '../lib/auth';
import { Check, X, Info, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Password Validation States
  const [hasMinLength, setHasMinLength] = useState(false);
  const [hasCapital, setHasCapital] = useState(false);
  const [hasNumber, setHasNumber] = useState(false);
  const [hasSpecialAuth, setHasSpecialAuth] = useState(false);

  useEffect(() => {
    setHasMinLength(password.length >= 8);
    setHasCapital(/[A-Z]/.test(password));
    setHasNumber(/[0-9]/.test(password));
    setHasSpecialAuth(/[!@#$%^&*(),.?":{}|<>]/.test(password));
  }, [password]);

  const isValidPassword = hasMinLength && hasCapital && hasNumber && hasSpecialAuth;

  const handleAuth = async (e) => {
    e.preventDefault();
    setError('');
    
    // NUS Email Validation
    if (!email.match(/^[a-zA-Z0-9_.+-]+@u\.nus\.edu$/)) {
      setError('Please use a valid @u.nus.edu email address (e.g., e1234567@u.nus.edu)');
      return;
    }

    if (!isLogin && !isValidPassword) {
      setError('Please resolve all password requirements before continuing.');
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        await signIn.email({
          email,
          password,
        }, {
          onSuccess: () => navigate('/home'),
          onError: (ctx) => setError(ctx.error.message || 'Failed to login'),
        });
      } else {
        if (!name) {
          setError('Name is required');
          setLoading(false);
          return;
        }
        await signUp.email({
          email,
          password,
          name,
        }, {
          onSuccess: () => navigate('/home'),
          onError: (ctx) => setError(ctx.error.message || 'Failed to sign up. Email might already be in use.'),
        });
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again or contact support.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const RequirementItem = ({ fulfilled, text }) => (
    <div className={`flex items-center space-x-2 text-sm ${fulfilled ? 'text-green-600' : 'text-gray-500'}`}>
      {fulfilled ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
      <span>{text}</span>
    </div>
  );

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-10 shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 tracking-tight">
            {isLogin ? 'Sign in to CampusCart' : 'Join CampusCart'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {isLogin ? 'Welcome back! ' : 'Create your account today. '}
            Only available for NUS students using an <span className="font-semibold text-indigo-600">@u.nus.edu</span> email.
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleAuth}>
          <div className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700" htmlFor="name">Full Name</label>
                <input
                  id="name"
                  type="text"
                  required
                  className="mt-1 relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  placeholder="e.g. John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700" htmlFor="email-address">NUS Email Address</label>
              <input
                id="email-address"
                type="email"
                autoComplete="email"
                required
                className="mt-1 relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                placeholder="e.g. e1234567@u.nus.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-gray-700" htmlFor="password">Password</label>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete={isLogin ? "current-password" : "new-password"}
                  required
                  className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 pr-10 text-gray-900 placeholder-gray-400 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  placeholder={isLogin ? 'Enter your password' : 'Create a strong password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-500 focus:outline-none"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex="-1"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" aria-hidden="true" />
                  ) : (
                    <Eye className="h-5 w-5" aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>

            {/* Password Verification UI for New Signups */}
            {!isLogin && password.length > 0 && (
              <div className="rounded-md bg-gray-50 p-4 border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <Info className="h-4 w-4 text-indigo-500" />
                  <p className="text-sm font-medium text-gray-700">Password requirements:</p>
                </div>
                <div className="space-y-1.5 ml-1">
                  <RequirementItem fulfilled={hasMinLength} text="At least 8 characters long" />
                  <RequirementItem fulfilled={hasCapital} text="Contains at least one uppercase letter (A-Z)" />
                  <RequirementItem fulfilled={hasNumber} text="Contains at least one number (0-9)" />
                  <RequirementItem fulfilled={hasSpecialAuth} text="Contains one special character (e.g. !@#$%)" />
                </div>
              </div>
            )}
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-3 border border-red-100">
              <p className="text-sm text-red-600 font-medium break-words">{error}</p>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading || (!isLogin && !isValidPassword && password.length > 0)}
              className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Processing...' : isLogin ? 'Sign in securely' : 'Create account'}
            </button>
          </div>
          
          <div className="mt-4 text-center">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-gray-500">Or</span>
              </div>
            </div>
            
            <button
              type="button"
              className="mt-4 font-semibold text-indigo-600 hover:text-indigo-500 transition-colors"
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setPassword('');
              }}
            >
              {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
