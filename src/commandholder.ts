"use strict";

import {inject, injectable} from "inversify";
import {TYPES} from "./bll/utils/constants";
import {Output} from "./view/output";
import {ProviderManager} from "./view/providermanager";
import {GetSuitableConfigs} from "./bll/commands/getsuitableconfigs";
import {SelectFilesForRemoteRun} from "./bll/commands/selectfilesforremoterun";
import {SignIn} from "./bll/commands/signin";
import {RemoteRun} from "./bll/commands/remoterun";
import {SignOut} from "./bll/commands/signout";
import {CredentialsStore} from "./bll/credentialsstore/credentialsstore";

@injectable()
export class CommandHolder {

    private output: Output;
    private _signIn: SignIn;
    private _signOut: SignOut;
    private _selectFilesForRemoteRun: SelectFilesForRemoteRun;
    private _getSuitableConfigs: GetSuitableConfigs;
    private _remoteRun: RemoteRun;
    private providerManager: ProviderManager;
    private credentialsStore: CredentialsStore;

    constructor(@inject(TYPES.Output) output: Output,
                @inject(TYPES.SignIn) signInCommand: SignIn,
                @inject(TYPES.SignOut) signOutCommand: SignOut,
                @inject(TYPES.SelectFilesForRemoteRun) selectFilesForRemoteRun: SelectFilesForRemoteRun,
                @inject(TYPES.GetSuitableConfigs) getSuitableConfigs: GetSuitableConfigs,
                @inject(TYPES.RemoteRun) remoteRun: RemoteRun,
                @inject(TYPES.ProviderManager) providerManager: ProviderManager,
                @inject(TYPES.CredentialsStore) credentialsStore?: CredentialsStore) {
        this.output = output;
        this._signIn = signInCommand;
        this._signOut = signOutCommand;
        this._selectFilesForRemoteRun = selectFilesForRemoteRun;
        this._getSuitableConfigs = getSuitableConfigs;
        this._remoteRun = remoteRun;
        this.providerManager = providerManager;
        this.credentialsStore = credentialsStore;
    }

    public async signIn(): Promise<void> {
        await this._signIn.exec();
        if (this.credentialsStore.getCredentialsSilently()) {
            this.providerManager.showEmptyDataProvider();
        }
    }

    public async signOut(): Promise<void> {
        await this._signOut.exec();
        this.providerManager.hideProviders();
    }

    public async selectFilesForRemoteRun(): Promise<void> {
        await this._selectFilesForRemoteRun.exec();
        this.providerManager.refreshAll();
        this.providerManager.showResourceProvider();
    }

    public async getSuitableConfigs(): Promise<void> {
        await this._getSuitableConfigs.exec();
        this.providerManager.refreshAll();
        this.providerManager.showBuildProvider();
    }

    public async remoteRunWithChosenConfigs(): Promise<void> {
        await this._remoteRun.exec();
    }

    public showOutput(): void {
        this.output.show();
    }
}
