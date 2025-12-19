import { useState } from "react"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, ArrowRight } from "lucide-react"

export default function AuthPage() {
    const { login, signup, continueAsGuest } = useAuth()
    const [isLoading, setIsLoading] = useState(false)

    const [loginData, setLoginData] = useState({ email: "", password: "" })
    const [signupData, setSignupData] = useState({ name: "", email: "", password: "" })

    const handleLogin = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            await login(loginData.email, loginData.password)
        } finally {
            setIsLoading(false)
        }
    }

    const handleSignup = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            await signup(signupData.name, signupData.email, signupData.password)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex w-full">
            {/* Left Side - Hero / Visuals */}
            <div className="hidden lg:flex w-1/2 bg-zinc-900 relative items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop')] bg-cover bg-center opacity-20"></div>
                <div className="relative z-10 p-12 text-white max-w-lg">
                    <h1 className="text-4xl font-bold mb-4 tracking-tight">Predict. Plan. Deliver.</h1>
                    <p className="text-zinc-400 text-lg leading-relaxed mb-8">
                        Experience the future of project management. Schedra uses advanced AI to forecast costs, risks, and timelines before they happen.
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-white/10">
                            <div className="text-2xl font-bold mb-1">98%</div>
                            <div className="text-xs text-zinc-400">Forecast Accuracy</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-white/10">
                            <div className="text-2xl font-bold mb-1">24/7</div>
                            <div className="text-xs text-zinc-400">Real-time Analysis</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Forms */}
            <div className="flex-1 flex items-center justify-center p-4 bg-background">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center lg:text-left">
                        <h2 className="text-2xl font-bold tracking-tight">Welcome to Schedra</h2>
                        <p className="text-muted-foreground mt-2">Sign in to your account or get started for free.</p>
                    </div>

                    <Tabs defaultValue="login" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 mb-4">
                            <TabsTrigger value="login">Login</TabsTrigger>
                            <TabsTrigger value="signup">Sign Up</TabsTrigger>
                        </TabsList>

                        <TabsContent value="login">
                            <Card className="border-0 shadow-none sm:border sm:shadow-sm">
                                <CardHeader className="px-0 sm:px-6">
                                    <CardTitle>Login</CardTitle>
                                    <CardDescription>Enter your credentials to access your dashboard.</CardDescription>
                                </CardHeader>
                                <form onSubmit={handleLogin}>
                                    <CardContent className="space-y-4 px-0 sm:px-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                placeholder="m@example.com"
                                                required
                                                value={loginData.email}
                                                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="password">Password</Label>
                                            <Input
                                                id="password"
                                                type="password"
                                                required
                                                value={loginData.password}
                                                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                                            />
                                        </div>
                                    </CardContent>
                                    <CardFooter className="flex flex-col gap-4 px-0 sm:px-6">
                                        <Button className="w-full" type="submit" disabled={isLoading}>
                                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                            Sign In
                                        </Button>
                                    </CardFooter>
                                </form>
                            </Card>
                        </TabsContent>

                        <TabsContent value="signup">
                            <Card className="border-0 shadow-none sm:border sm:shadow-sm">
                                <CardHeader className="px-0 sm:px-6">
                                    <CardTitle>Create Account</CardTitle>
                                    <CardDescription>Enter your details to create a new account.</CardDescription>
                                </CardHeader>
                                <form onSubmit={handleSignup}>
                                    <CardContent className="space-y-4 px-0 sm:px-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="name">Full Name</Label>
                                            <Input
                                                id="name"
                                                placeholder="John Doe"
                                                required
                                                value={signupData.name}
                                                onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="signup-email">Email</Label>
                                            <Input
                                                id="signup-email"
                                                type="email"
                                                placeholder="m@example.com"
                                                required
                                                value={signupData.email}
                                                onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="signup-password">Password</Label>
                                            <Input
                                                id="signup-password"
                                                type="password"
                                                required
                                                value={signupData.password}
                                                onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                                            />
                                        </div>
                                    </CardContent>
                                    <CardFooter className="flex flex-col gap-4 px-0 sm:px-6">
                                        <Button className="w-full" type="submit" disabled={isLoading}>
                                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                            Create Account
                                        </Button>
                                    </CardFooter>
                                </form>
                            </Card>
                        </TabsContent>
                    </Tabs>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                        </div>
                    </div>

                    <Button variant="outline" className="w-full" onClick={continueAsGuest}>
                        Continue as Guest <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    )
}
