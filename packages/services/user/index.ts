import {db, eq} from "@repo/database";
import {usersTable} from "@repo/database/models/user"
import { randomBytes, createHmac } from "node:crypto";
import { createUserWithEmailAndPasswordInput, type CreateUserWithEmailAndPasswordType, generateUserTokenPayload, type GenerateUserTokenPayloadType, type SignInUserWithEmailAndPasswordType, signInUserWithEmailAndPasswordInput } from "./model";
import * as JWT from "jsonwebtoken";
import { env } from "../env";

class UserService {

    private async getUserByEmail(email: string){
        const user = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);
        if(!user || user.length === 0) return null;
        return user[0];
    }

    private async generateUserToken(payload: GenerateUserTokenPayloadType){
        const { id } = await generateUserTokenPayload.parseAsync(payload);
        const token = JWT.sign({ id }, env.JWT_SECRET);
        return { token };
    }

    private async createHash(password: string, salt: string){
        return createHmac("sha256", salt).update(password).digest("hex");
    }

    public async createUserWithEmailAndPassword(payload: CreateUserWithEmailAndPasswordType) {
        const { fullName, email, password } = await createUserWithEmailAndPasswordInput.parseAsync(payload);

        //check the email is not already in use
        const existingUserWithEmail = await this.getUserByEmail(email);
        if(existingUserWithEmail) {
            throw new Error(`A user with this email ${email} already exists`);
        }

        //create the user
        const salt = randomBytes(16).toString("hex");
        const hash = await this.createHash(password, salt);
        //store the user in the database
        const userInsertResult = await db.insert(usersTable).values({
            fullName,
            email,
            salt,
            password: hash,
        }).returning({
            id: usersTable.id
        });

        if(!userInsertResult || userInsertResult.length === 0 || !userInsertResult[0]?.id) {
            throw new Error("Failed to create user");
        }

        const userId = userInsertResult[0].id;

        const { token } = await this.generateUserToken( { id: userId } );

        return {
            id: userId,
            token,
        };
    }

    public async signInUserWithEmailAndPassword(payload: SignInUserWithEmailAndPasswordType) {
        const { email, password } = await signInUserWithEmailAndPasswordInput.parseAsync(payload);

        //check the user have a account or not
        const existingUserWithEmail = await this.getUserByEmail(email);
        if(!existingUserWithEmail){
            throw new Error(`No user found with this email ${email}`);
        }

        //check for the password
        if(!existingUserWithEmail.password || !existingUserWithEmail.salt){
            throw new Error("Invalid authentication credentials");
        }

        //verify the password
        const salt = existingUserWithEmail.salt;
        if(salt){
            const hash = await this.createHash(password, salt);
            if(hash !== existingUserWithEmail.password){
                throw new Error("Invalid email or password");
            }
        }
        const {token} = await this.generateUserToken({ id: existingUserWithEmail.id })
        return {
            id: existingUserWithEmail.id,
            token,
        };  
    }
}

export default UserService;