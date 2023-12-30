/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as firebase from 'firebase-admin';
import * as credentials from './credentials.json';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ICreateUserDto } from 'src/users/models/dto/createUser.dto';
import { IUser } from 'src/users/models/users.schema';
import { BusinessOwnersService } from 'src/businessOwners/businessOwners.service';
import { v4 } from 'uuid';
import { OrganizationService } from 'src/organizations/organization.service';

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
    private readonly businessOwners: BusinessOwnersService,
    private readonly organizations: OrganizationService,
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
        const user = await this.users.createNew({
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
          //@ts-ignore
          user: user._doc,
        };
      }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.UNAUTHORIZED, {
        cause: error.message,
      });
    }
  }

  async createUser(data) {
    try {
      const response = await this.users.createNew({
        id: v4(),
        email: data.email,
        displayName: data.name,
        authProvider: 'local',
        avatar: data.photoURL,
        emailVerified: false,
        phone: data.phoneNumber,
        login: data.email,
        password: bcrypt.hashSync(data.password, 10),
      });
      //@ts-ignore
      const token = await this.createToken(response._doc);
      console.log(response);
      console.log(token);
      return {
        user: response,
        token,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.CONFLICT, {
        cause: error.message,
      });
    }
  }

  async createBusinessUser(data) {
    try {
      const hash = await bcrypt.hash(data.password, 10);
      const user = await this.businessOwners.create({
        id: v4(),
        email: data.email,
        displayName: data.name,
        authProvider: 'local',
        emailVerified: false,
        login: data.email,
        phoneNumber: data.phoneNumber,
        password: hash,
      });
      const { password, ...userData } = user;
      return {
        //@ts-ignore
        token: await this.createToken(userData._doc),
        //@ts-ignore
        user: userData._doc,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.CONFLICT, {
        cause: error.message,
      });
    }
  }

  async firstLoginCompleteData(data, user) {
    const { organization, businessOwner } = data;
    try {
      const createdOrganization = await this.organizations.create(
        organization,
        user,
      );
      const createdBusinessOwner = await this.businessOwners.completeFirstLogin(
        businessOwner,
        user,
        createdOrganization,
      );
      return createdBusinessOwner;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_MODIFIED, {
        cause: error.message,
      });
    }
  }

  async login({ login, password }) {
    try {
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
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.UNAUTHORIZED, {
        cause: error.message,
      });
    }
  }

  async businessLogin({ login, password }) {
    try {
      const candidate = await this.businessOwners.getBusinessOwnerById(login);
      if (!candidate) throw new Error('Такого пользователя не существует!');
      else {
        const correct = await bcrypt.compare(password, candidate.password);
        if (!correct) throw new Error('Не верно указан пароль!');
        else {
          const { password, ...user } = candidate;
          return {
            user,
            token: await this.createToken(user),
          };
        }
      }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.UNAUTHORIZED, {
        cause: error.message,
      });
    }
  }

  async verifyBusinessToken(token: string): Promise<any> {
    try {
      const correct = await this.jwt.verify(token);
      if (correct) {
        const decoded = this.jwt.decode(token);
        if (typeof decoded === 'object') {
          const user: IUser = decoded as IUser;
          const exist = await this.businessOwners.getBusinessOwnerById(user.id);
          if (!exist) throw new Error('token validation failed');
          const { password, ...userData } = exist;
          return userData;
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

  async verifyToken(token: string): Promise<any> {
    try {
      const correct = await this.jwt.verify(token);
      if (correct) {
        const decoded = this.jwt.decode(token);
        if (typeof decoded === 'object') {
          const user: IUser = decoded as IUser;
          console.log('userId:' + user.id);
          console.log(user);
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
