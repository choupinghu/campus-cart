import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signIn, signUp } from '../lib/auth';
import { Check, X, Info, Eye, EyeOff, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [emailPrefix, setEmailPrefix] = useState('');
  const [domain, setDomain] = useState('@u.nus.edu');
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
    
    const fullEmail = domain === 'custom' ? emailPrefix : `${emailPrefix}${domain}`;

    // Validation
    if (domain !== 'custom' && (!emailPrefix || !/^[a-zA-Z0-9_.+-]+$/.test(emailPrefix))) {
      setError('Please enter a valid NUS Net ID (e.g., e1234567)');
      return;
    }
    
    if (domain === 'custom' && (!emailPrefix || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailPrefix))) {
      setError('Please enter a valid email address');
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
          email: fullEmail,
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
          email: fullEmail,
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
            Only available for NUS students and verified members.
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
                  className="mt-1 relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:z-10 focus:border-nus-blue focus:outline-none focus:ring-nus-blue sm:text-sm"
                  placeholder="e.g. John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700" htmlFor="nus-id">
                {domain === 'custom' ? 'Full Email Address' : 'NUS Net ID'}
              </label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <input
                  id="nus-id"
                  type={domain === 'custom' ? 'email' : 'text'}
                  required
                  className={`relative flex-1 block w-full appearance-none rounded-none rounded-l-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:z-10 focus:border-nus-blue focus:outline-none focus:ring-nus-blue sm:text-sm ${domain === 'custom' ? 'rounded-md' : ''}`}
                  placeholder={domain === 'custom' ? "e.g. name@example.com" : "e.g. e1234567"}
                  value={emailPrefix}
                  onChange={(e) => {
                    let val = e.target.value;
                    if (domain !== 'custom' && val.includes('@')) {
                      const parts = val.split('@');
                      val = parts[0];
                      if (parts[1] === 'u.nus.edu' || parts[1] === 'comp.nus.edu.sg') {
                        setDomain('@' + parts[1]);
                      } else {
                        setDomain('custom');
                        setEmailPrefix(e.target.value);
                        return;
                      }
                    }
                    setEmailPrefix(val);
                  }}
                />
                
                {domain !== 'custom' && (
                  <select
                    className="inline-flex items-center rounded-r-md border border-l-0 border-gray-300 bg-gray-50 px-3 text-gray-500 sm:text-sm focus:outline-none focus:ring-nus-blue focus:border-nus-blue cursor-pointer"
                    value={domain}
                    onChange={(e) => {
                      if (e.target.value === 'custom') {
                        setEmailPrefix(emailPrefix ? `${emailPrefix}${domain}` : '');
                      }
                      setDomain(e.target.value);
                    }}
                  >
                    <option value="@u.nus.edu">@u.nus.edu</option>
                    <option value="@comp.nus.edu.sg">@comp.nus.edu.sg</option>
                    <option value="custom">Other...</option>
                  </select>
                )}
              </div>
              
              {domain === 'custom' && (
                <button
                  type="button"
                  onClick={() => {
                    setDomain('@u.nus.edu');
                    setEmailPrefix(emailPrefix.split('@')[0]);
                  }}
                  className="mt-2 text-xs text-nus-blue hover:text-nus-blue-hover font-medium transition-colors"
                >
                  Switch back to NUS Net ID
                </button>
              )}
              
              {!isLogin && (
                <p className="mt-1.5 text-xs text-gray-500">
                  <span className="font-semibold">Note:</span> We recommend using your official NUS email to join the exclusive campus network without requiring manual verification.
                </p>
              )}
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
                  className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 pr-10 text-gray-900 placeholder-gray-400 focus:z-10 focus:border-nus-blue focus:outline-none focus:ring-nus-blue sm:text-sm"
                  placeholder={isLogin ? 'Enter your password' : 'Create a strong password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute z-20 inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-500 focus:outline-none"
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
                  <Info className="h-4 w-4 text-nus-blue" />
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
              className="group relative flex w-full items-center justify-center gap-2 rounded-md border border-transparent bg-nus-orange px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-nus-orange-hover focus:outline-none focus:ring-2 focus:ring-nus-orange focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              <span>{loading ? 'Processing...' : isLogin ? 'Sign in securely' : 'Create account'}</span>
              {!loading && (
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              )}
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
              className="mt-4 font-semibold text-nus-blue hover:text-nus-blue-hover transition-colors"
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
