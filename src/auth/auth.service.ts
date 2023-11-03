/* eslint-disable @typescript-eslint/no-unused-vars */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as firebase from 'firebase-admin';
import * as credentials from './credentials.json';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ICreateUserDto } from 'src/users/models/dto/createUser.dto';
import { IUser } from 'src/users/models/users.schema';

const account: firebase.ServiceAccount = {
  clientEmail: credentials.client_email,
  privateKey: credentials.private_key,
  projectId: credentials.project_id,
};

@Injectable()
export class AuthService {
  private readonly app: firebase.app.App;
  constructor(
    private readonly users: UsersService,
    private readonly jwt: JwtService,
  ) {
    this.app = firebase.initializeApp({
      credential: firebase.credential.cert(account),
    });
  }

  async firebaseGoogleLogin(token: string) {
    try {
      const valid = await this.app.auth().verifyIdToken(token);
      const gUser = await this.app.auth().getUser(valid.uid);
      if (valid && gUser) {
        const existing = await this.users.findUserById(gUser.uid);
        if (existing) {
          return {
            token: await this.createToken(existing),
            user: existing,
          };
        }
        const user: IUser = await this.users.createNew({
          id: gUser.uid,
          email: gUser.email,
          displayName: gUser.displayName,
          authProvider: 'google',
          avatar: gUser.photoURL,
          emailVerified: gUser.emailVerified,
          login: valid.email,
        });
        return {
          token: await this.createToken(user),
          user,
        };
      }
    } catch (error) {
      console.log(error);
      throw new HttpException(error.message, HttpStatus.UNAUTHORIZED, {
        cause: error.message,
      });
    }
  }

  async login({ login, password }) {
    const candidate = await this.users.findUserById(login);
    if (!candidate)
      throw new HttpException(
        'Такого пользователя не существует!',
        HttpStatus.BAD_REQUEST,
      );
    else {
      const correct = await bcrypt.compare(password, candidate.password);
      if (!correct)
        throw new HttpException(
          'Не верно указан пароль!',
          HttpStatus.UNAUTHORIZED,
        );
      else {
        const { password, ...user } = candidate;
        return this.createToken(user);
      }
    }
  }

  async verifyToken(token: string): Promise<any> {
    try {
      const correct = await this.jwt.verify(token);
      if (correct) {
        const decoded = this.jwt.decode(token);
        if (typeof decoded === 'object') {
          const user: IUser = decoded as IUser;
          const exist = await this.users.findUserById(user.id);
          if (!exist) throw new Error('token validation failed');
          return exist;
        }
      } else
        throw new HttpException(
          'Ошибка валидации токена',
          HttpStatus.UNAUTHORIZED,
        );
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST, {
        cause: error.message,
      });
    }
  }

  async createToken(payload) {
    const { _id, password, ...data } = payload;
    return this.jwt.sign(data);
  }
}
