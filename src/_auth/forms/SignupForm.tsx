import { SignupValidation } from "@/lib/validation"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import Loader from "@/components/shared/Loader"
import { Link, useNavigate } from "react-router-dom"
import { useToast } from "@/components/ui/use-toast"
import { useCreateUserAccount, useSignInAccount } from "@/lib/react-query/queriesAndMutations"
import { useUserContext } from "@/context/AuthContext"

const SignupForm = () => {

    const { toast } = useToast()

    const navigate = useNavigate()

    const {checkAuthUser, isLoading:isUserLoading} = useUserContext()

    const{ mutateAsync:createUserAccount, isPending: isCreatingAccount } = useCreateUserAccount()

    const {mutateAsync:signInAccount, isPending:isSigningIn} = useSignInAccount()

    // 1. Define your form.
    const form = useForm<z.infer<typeof SignupValidation>>({
        resolver: zodResolver(SignupValidation),
        defaultValues: {
            name: "",
            username: "",
            email: "",
            password: ""
        },
    })

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof SignupValidation>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log(values)
        try {
            const newUser = await createUserAccount(values)
            console.log(newUser)
            if (!newUser) {
                form.reset()
                return toast({
                    title: "Signed Up Failed. Please Try again",
                })
            }
            const session = await signInAccount({
                email:values.email,
                password:values.password
            })

            if(!session){
                return toast({title: "Signed Up Failed. Please Try again"})
            }

            const isLoggedIn = await checkAuthUser()

            if(isLoggedIn){
                form.reset()
                navigate('/')
            } else {
                return toast({title: "Signed Up Failed. Please Try again"})
            }

        } catch (error) {
            form.reset()
            console.log(error)
        }

    }

    return (
        <Form {...form}>

            <div className=" sm:w-420 flex-center flex-col">
                <img src="/assets/images/logo.svg" alt="logo" />
                <h2 className=" h3-bold md:h2-bold pt-5 sm:pt-12">Create a new Account</h2>
                <p className=" text-light-3 small-medium md:base-regular mt-2">To use Snapgram, Please enter your account details.</p>

                <form onSubmit={form.handleSubmit(onSubmit)} className=" flex flex-col gap-5 w-full mt-4">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input type="text" placeholder="Name" className="shad-input" {...field} />
                                </FormControl>
                                <FormDescription>
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>User Name</FormLabel>
                                <FormControl>
                                    <Input type="text" placeholder="User Name" className="shad-input" {...field} />
                                </FormControl>
                                <FormDescription>
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input type="email" placeholder="Email" className="shad-input" {...field} />
                                </FormControl>
                                <FormDescription>
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input type="password" placeholder="Password" className="shad-input" {...field} />
                                </FormControl>
                                <FormDescription>
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button type="submit" className=" shad-button_primary">
                        {isCreatingAccount ? (
                            <div className=" flex-center gap-2"><Loader />Loading...</div>
                        ) : "Sign Up"}
                    </Button>
                    <p className=" text-sm-regular text-light-2 text-center mt-2">Alredy have an account<Link to="/sign-in" className=" text-primary-500 text-small-semibold ml-1">Login</Link></p>
                </form>

            </div>
        </Form>
    )
}

export default SignupForm
