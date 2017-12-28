"use strict";

import {inject, injectable} from "inversify";
import {Logger} from "../utils/logger";
import {Credentials} from "./credentials";
import {CredentialsStore} from "./credentialsstore";
import {MessageConstants} from "../utils/messageconstants";
import {TYPES} from "../utils/constants";
import {SignIn} from "../commands/signin";
import {RemoteLogin} from "../../dal/remotelogin";
import {Settings} from "../entities/settings";
import {Output} from "../../view/output";
import {PersistentStorageManager} from "./persistentstoragemanager";

@injectable()
export class InMemoryCredentialsStore implements CredentialsStore {

    private remoteLogin: RemoteLogin;
    private output: Output;
    private settings: Settings;
    private persistentStorageManager: PersistentStorageManager;

    constructor(@inject(TYPES.RemoteLogin) remoteLogin: RemoteLogin,
                @inject(TYPES.Output) output: Output,
                @inject(TYPES.Settings) settings: Settings,
                @inject(TYPES.PersistentStorageManager) persistentStorageManager: PersistentStorageManager) {
        this.remoteLogin = remoteLogin;
        this.output = output;
        this.settings = settings;
        this.persistentStorageManager = persistentStorageManager;
    }

    private credentials: Credentials;

    public async setCredentials(credentials: Credentials): Promise<void> {
        this.credentials = credentials;
    }

    public async getCredentials(): Promise<Credentials> {
        let credentials: Credentials = this.getCredentialsSilently();
        if (!credentials) {
            Logger.logInfo("InMemoryCredentialsStore#getCredentials: credentials is undefined. An attempt to get them");
            await this.signIn();
            credentials = this.getCredentialsSilently();
            if (!credentials) {
                Logger.logWarning("InMemoryCredentialsStore#getCredentials: An attempt to get credentials failed");
                return Promise.reject(MessageConstants.NO_CREDENTIALS_RUN_SIGNIN);
            }
        }
        return Promise.resolve<Credentials>(credentials);
    }

    private async signIn(): Promise<void> {
        const signInCommand = new SignIn(this.remoteLogin, this, this.output, this.settings, this.persistentStorageManager);
        return signInCommand.exec();
    }

    public getCredentialsSilently(): Credentials {
        return this.credentials;
    }

    public async removeCredentials(): Promise<void> {
        if (this.credentials) {
            Logger.logInfo(`The credentials for ${this.credentials.user} will be deleted from the CredentialsStore`);
            this.credentials = undefined;
        }
    }

}