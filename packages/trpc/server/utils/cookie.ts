import { CookieOptions, Response, Request} from "express";
import { TRPCContext } from "../context";
const ONE_MINUTE = 60 * 1000; //MILLISECOND
const ONE_HOURS = 60 * ONE_MINUTE;
const ONE_DAY = 24 * ONE_HOURS;
const ONE_WEEK = 7 * ONE_DAY;


const defaultCookieOptions: CookieOptions = {
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: ONE_WEEK, // 7 days
}

export function createCookieFactory(res: Response){
    return function createCookie( name: string, value: string, opt: CookieOptions = defaultCookieOptions){
        res.cookie(name, value, opt);
    }
}

export function getCookieFactory(req: Request){
    return function getCookie(name: string){
        return req.cookies?.[name];
    }
}

export function clearCookieFactory(res: Response){
    return function clearCookie(name: string){
        res.clearCookie(name);
    }
}

//Authentication related cookies can be created using the following options:
const AUTHENTICATION_COOKIE_NAME = "authentication-token";
export function setAuthenticationCookie(ctx: TRPCContext, accessToken: string){
    ctx.createCookie(AUTHENTICATION_COOKIE_NAME, accessToken)
}

export function getAuthenticationCookie(ctx: TRPCContext){
    return ctx.getCookie(AUTHENTICATION_COOKIE_NAME);
}

export function clearAuthenticationCookie(ctx: TRPCContext){
    ctx.clearCookie(AUTHENTICATION_COOKIE_NAME);
}