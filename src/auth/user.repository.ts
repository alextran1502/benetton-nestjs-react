import { Repository, EntityRepository } from "typeorm"
import * as bcrypt from 'bcrypt'
import { User } from "./user.entity";
import { AuthCredentialDto } from "./dto/auth-credential-dto";
import { ConflictException, InternalServerErrorException } from "@nestjs/common";

@EntityRepository(User)
export class UserRepository extends Repository<User> {

    public async signIn(authCredentialDto: AuthCredentialDto): Promise<User> {
        const { username, password } = authCredentialDto;

        const query = await this.createQueryBuilder('user');
        query.andWhere('user.username = :username', { username })

        const user: User = await query.getOne()

        bcrypt.compare(password, user.password).then(result => {
            console.log(result)
        })

        return user;
    }

    public async signUp(authCredentialDto: AuthCredentialDto): Promise<void> {
        const { username, password } = authCredentialDto;

        const user = new User();
        user.username = username;
        user.salt = await bcrypt.genSalt();
        user.password = await this.hashPassword(password, user.salt);

        try {
            await user.save();
        } catch (error) {
            if (error.code === '23505') {
                throw new ConflictException('Username alrady exist');
            } else {
                throw new InternalServerErrorException();
            }
        }
    }

    async validateUserPassword(authCredentialDto: AuthCredentialDto): Promise<string> {
        const { username, password } = authCredentialDto;
        const user: User = await this.findOne({ username });

        if (user && await user.validatePassword(password)) {
            return user.username;
        } else {
            return null;
        }
    }

    private async hashPassword(password: string, salt: string): Promise<string> {
        return bcrypt.hash(password, salt);
    }

}