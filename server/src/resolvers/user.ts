import { Resolver, Query, Mutation, Arg, ObjectType, Field, Ctx, UseMiddleware, Int } from "type-graphql";
import { hash, compare } from "bcryptjs";
import { User } from "../entity/User";
import { MyContext } from "../services/context";
import { createAccessToken, createRefreshToken, isAuthenticated } from "../services/auth";
import { getConnection } from "typeorm";

@ObjectType()
class LoginResponse {
  @Field()
  accessToken: string;
}

@Resolver()
export class UserResolver {
  @Query(() => User, { nullable: true })
  @UseMiddleware(isAuthenticated)
  async me(
    @Ctx() { payload }: MyContext
  ) {
    try {
      return await User.findOne(payload.userId)
    } catch (err) {
      console.log(err)
      return err
    }
  }

  @Query(() => String)
  hello() {
    return "hello world";
  }
// 57:59
  @Query(() => String)
  @UseMiddleware(isAuthenticated)
  bye(
    @Ctx() { payload }: MyContext
  ) {
    return `your user id is: ${payload.userId}`
  }

  @Query(() => [User])
  async users() {
    return await User.find();
  }

  @Mutation(() => Boolean)
  async revokeRefreshToken(
    @Arg('userId', () => Int) userId: number
  ) {
    await getConnection().getRepository(User).increment({ id: userId }, 'tokenVersion', 1)
    return true;
  }

  @Mutation(() => User)
  async register(@Arg("email") email: string, @Arg("password") password: string) {
    const hashedPassword = await hash(password, 12);
    try {
      const user = await User.findOne({ email });
      if (user) {
        throw new Error("This email is already in use");
      }

      const newUser = await User.create({
        email,
        password: hashedPassword
      }).save();

      return newUser;
    } catch (err) {
      console.log(err);
      return err;
    }
  }

  @Mutation(() => LoginResponse)
  async login(
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Ctx() { res }: MyContext
  ): Promise<LoginResponse> {
    try {
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error("This user doesn't exist");
      }

      const valid = await compare(password, user.password);
      if (!valid) {
        throw new Error("Incorrect password");
      }

      // sign refresh token
      res.cookie(
        "qid",
        createRefreshToken(user),
        {
          httpOnly: true,
        }
      );

      // sign access token
      return {
        accessToken: createAccessToken(user)
      };
    } catch (err) {
      console.log(err);
      return err;
    }
  }
}
