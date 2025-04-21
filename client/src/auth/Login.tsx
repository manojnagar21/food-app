/**
 * @author Mritunjay N Nagar
 * @module Login
 * @description
 * This is the login component which will be used to login the user.
 * @returns 
 * The login form.
 */

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoginInputState, userLoginSchema } from "@/schema/userSchema";
import { Separator } from "@/components/ui/separator";
import { Loader2, LockKeyhole, Mail } from "lucide-react";
import { ChangeEvent, FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUserStore } from "@/store/useUserStore";


// this has been provide by schema in zod library
// type LoginInputState = {
//     email: string;
//     password: string;
// };
const Login = () => {
    // const loading = false;
    const [input, setInput] = useState<LoginInputState>({
        email: "",
        password: "",
    });
    const [errors, setErrors] = useState<Partial<LoginInputState>>({
            
    });

    const { loading, login } = useUserStore();
    const navigate = useNavigate();
    const changeEventHandler = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setInput({...input, [name]: value});
    }
    const loginSubmitHandler = async (e: FormEvent) => {
        e.preventDefault();
        const result = userLoginSchema.safeParse(input)
        if(!result.success) {
            const fieldErrors = result.error.formErrors.fieldErrors;
            setErrors(fieldErrors as Partial<LoginInputState>);
            return;
        }
        // login api implementation
        console.log(input);
        try {
            await login(input);
            navigate("/");
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <div className="flex items-center justify-center min-h-screen w-screen">
            <form onSubmit={loginSubmitHandler} className="md:p-8 w-full max-w-md rounded-lg md:border border-gray-200 mx-4">
                <div className="mb-4 text-center">
                    <h1 className="font-bold text-2xl">Nagar Eats</h1>
                </div>
                <div className="mb-4">
                    <div className="relative">
                        <Input
                            type="email"
                            placeholder="Email"
                            name="email"
                            value={input.email}
                            onChange={changeEventHandler}
                            className="pl-10 focus-visible: ring-1" 
                        />
                        <Mail className="absolute inset-y-2 left-2 text-gray-500 pointer-events-none" />
                        {
                            errors && <span className="text-sm text-red-500">{errors.email}</span>
                        }
                    </div>
                </div>
                <div className="mb-4">
                    <div className="relative">
                        <Input
                            type="password"
                            placeholder="Password"
                            name="password"
                            value={input.password}
                            onChange={changeEventHandler}
                            className="pl-10 focus-visible: ring-1" 
                        />
                        <LockKeyhole className="absolute inset-y-2 left-2 text-gray-500 pointer-events-none" />
                        {
                            errors && <span className="text-sm text-red-500">{errors.password}</span>
                        }
                    </div>
                </div>
                <div className="mb-10">
                    {
                        loading ? (<Button disabled className="w-full bg-orange hover:bg-hoverOrange"><Loader2 className="mr-2 h-4 w-4 animate-spin" />Please wait</Button>) :
                            (<Button type="submit" className="w-full bg-orange hover:bg-hoverOrange">Login</Button>)
                    }
                    <div className="mt-4 text-center">
                        <Link to="/forgot-password" className="hover:text-blue-500 hover:underline">Forgot Password</Link>
                    </div>
                </div>
                <Separator />
                <p className="mt-2 text-center">
                    Don't have an account? {" "}
                    <Link className="text-blue-500" to="/signup">Register</Link>
                </p>
            </form>
        </div>
    );
}
export default Login;