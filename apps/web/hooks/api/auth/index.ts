import {trpc} from "~/trpc/client"

export const useSignUp = () => {
    const {
        mutateAsync: createUserWithEmailAndPasswordAsync,
        mutate: createUserWithEmailAndPassword,
        error, 
        failureCount, 
        isError, 
        isIdle, 
        isSuccess,
        status,
    } = trpc.auth.createUserWithEmailAndPassword.useMutation();

    return {
        createUserWithEmailAndPasswordAsync,
        createUserWithEmailAndPassword,
        error, 
        failureCount, 
        isError, 
        isIdle, 
        isSuccess,
        status,
    }
}

export const useSignIn = () => {
    const utils = trpc.useUtils();
    const {
        mutateAsync: signInUserWithEmailAndPasswordAsync,
        mutate: signInUserWithEmailAndPassword,
        error, 
        failureCount, 
        isError, 
        isIdle, 
        isSuccess,
        status,
    } = trpc.auth.signInUserWithEmailAndPassword.useMutation({
        onSuccess: async() => {
            await utils.auth.getUserInfo.invalidate()
        }
    });

    return {
        signInUserWithEmailAndPasswordAsync,
        signInUserWithEmailAndPassword,
        error, 
        failureCount, 
        isError, 
        isIdle, 
        isSuccess,
        status,
    }
}

export const useUserInfo = () => {
    const { data: user, error, isFetching, isFetched, isLoading, status} = trpc.auth.getUserInfo.useQuery(undefined, {
        retry: false,
    });

    return {
        user, error, isFetching, isFetched, isLoading, status
    }
}
