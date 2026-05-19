import {db, eq} from "@repo/database";
import {usersTable} from "@repo/database/models/user"
import { randomBytes, createHmac } from "node:crypto";
import { createUserWithEmailAndPasswordInput, type CreateUserWithEmailAndPasswordType} from "./model";

class UserService {

    private async getUserByEmail(email: string){
        const user = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);
        if(!user || user.length === 0) return null;
        return user[0];
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
        const hash = createHmac("sha256", salt).update(password).digest("hex");

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

        return {
            id: userInsertResult[0].id,
        };
    }
}

export default UserService;