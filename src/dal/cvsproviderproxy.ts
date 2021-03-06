import {CvsSupportProvider} from "./cvsprovider";
import {TYPES} from "../bll/utils/constants";
import {CheckInInfo} from "../bll/entities/checkininfo";
import {Uri, window, workspace} from "vscode";
import {inject, injectable} from "inversify";
import {Logger} from "../bll/utils/logger";
import {MessageConstants} from "../bll/utils/messageconstants";
import {Utils} from "../bll/utils/utils";
import {GitProviderActivator} from "./git/GitProviderActivator";
import {Settings} from "../bll/entities/settings";
import {Context} from "../view/Context";
import {GitProvider} from "./git/GitProvider";
import {TfvcProviderActivator} from "./tfs/TfvcProviderActivator";

@injectable()
export class CvsProviderProxy {
    private actualProviders: CvsSupportProvider[] = [];
    private readonly isGitSupported: boolean;

    constructor(@inject(TYPES.GitProviderActivator) private readonly gitProviderActivator: GitProviderActivator,
                @inject(TYPES.TfvcProviderActivator) private readonly tfvcProviderActivator: TfvcProviderActivator,
                @inject(TYPES.Settings) private readonly mySettings: Settings,
                @inject(TYPES.Context) context: Context) {
        const rootPaths: Uri[] = this.collectAllRootPaths();
        this.isGitSupported = mySettings.isGitSupported();
        if (this.isGitSupported) {
            Logger.logWarning("Experimental git support is enabled.");
        } else {
            Logger.logInfo("Experimental git support is disabled.");
        }
        this.detectCvsProviders(rootPaths).then((detectedCvsProviders: CvsSupportProvider[]) => {
            this.actualProviders = detectedCvsProviders;
            if (this.actualProviders.length > 0) {
                context.setShowRemoteRunButton(true);
            }
        });
    }

    private collectAllRootPaths(): Uri[] {
        const rootPaths: Uri[] = [];
        const workspaceFolders = workspace.workspaceFolders;
        if (workspaceFolders && workspaceFolders.length !== 0) {
            workspaceFolders.forEach((workspaceFolder) => {
                rootPaths.push(workspaceFolder.uri);
            });
        }
        return rootPaths;
    }

    private async detectCvsProviders(rootPaths: Uri[]): Promise<CvsSupportProvider[]> {
        const providers: CvsSupportProvider[] = [];
        for (let i = 0; i < rootPaths.length; i++) {
            providers.push.apply(providers, await this.detectProvidersInDirectory(rootPaths[i]));
        }
        return providers;
    }

    private async detectProvidersInDirectory(rootPath: Uri): Promise<CvsSupportProvider[]> {
        const providers: CvsSupportProvider[] = [];
        const tfvcProvider: CvsSupportProvider = await this.tfvcProviderActivator.tryActivateInPath(rootPath);
        if (tfvcProvider) {
            providers.push(tfvcProvider);
            Logger.logInfo(`Tfvc provider was activated for ${rootPath.fsPath}`);
        } else {
            Logger.logWarning(`Could not activate tfvc provider for ${rootPath.fsPath}`);
        }
        if (!this.isGitSupported) {
            return providers;
        }

        const gitProvider: CvsSupportProvider = await this.gitProviderActivator.tryActivateInPath(rootPath);
        if (gitProvider) {
            providers.push(gitProvider);
            Logger.logInfo(`Git provider was activated for ${rootPath.fsPath}`);
        } else {
            Logger.logWarning(`Could not activate git provider for ${rootPath.fsPath}`);
        }
        return providers;
    }

    public async getFormattedFileNames(checkInArray: CheckInInfo[]): Promise<string[]> {
        const formattedFileNames: string[] = [];
        if (!checkInArray) {
            return [];
        }
        checkInArray.forEach((checkInInfo: CheckInInfo) => {
            checkInInfo.getFormattedFileNames().forEach((fileName: string) => {
                formattedFileNames.push(fileName);
            });
        });
        return formattedFileNames;
    }

    public async getRequiredCheckInInfo(): Promise<CheckInInfo[]> {
        const result: CheckInInfo[] = [];
        this.ensureProvidersExist();

        for (let i = 0; i < this.actualProviders.length; i++) {
            const provider: CvsSupportProvider = this.actualProviders[i];
            try {
                const checkInInfo: CheckInInfo = await provider.getRequiredCheckInInfo();
                if (checkInInfo.cvsLocalResources.length > 0) {
                    result.push(checkInInfo);
                }
            } catch (err) {
                Logger.logError(Utils.formatErrorMessage(err));
            }
        }
        return result;
    }

    public async requestForPostCommit(checkInArray: CheckInInfo[]): Promise<void> {
        const commitMessage: string = await CvsProviderProxy.getUpdatedCommitMessages(checkInArray);
        this.setUpdatedCommitMessages(checkInArray, commitMessage);
        checkInArray.forEach((checkInInfo: CheckInInfo) => {
            checkInInfo.getCvsProvider().commit(checkInInfo);
        });
    }

    public hasGitProvider(): boolean {
        for (const provider of this.actualProviders) {
            if (provider instanceof GitProvider) {
                return true;
            }
        }

        return false;
    }

    public async getGitBranch(): Promise<string> {
        const results: string[] = [];
        for (const provider of this.actualProviders) {
            if (provider instanceof GitProvider) {
                results.push(await provider.getRepoBranchName());
            }
        }
        if (results.length === 0) {
            throw new Error("No branch name was collected!");
        } else if (results.length === 1 || this.isAllElementsTheSame(results)) {
            return results[0];
        } else {
            throw new Error("There are more then one git branch, this case is currently unsupported.");
        }
    }

    private isAllElementsTheSame(anyArray: any[]): boolean {
        return !!anyArray.reduce((a, b) => {
            return (a === b) ? a : NaN;
        });
    }

    private static async getUpdatedCommitMessages(checkInArray: CheckInInfo[]): Promise<string> {
        let commitMessage: string;
        if (checkInArray.length > 0) {
            const previousMessage: string = checkInArray[0].message;
            commitMessage = await window.showInputBox({
                prompt: MessageConstants.PROVIDE_MESSAGE_FOR_COMMIT,
                value: previousMessage
            });
        }
        return commitMessage || "";
    }

    private setUpdatedCommitMessages(checkInArray: CheckInInfo[], commitMessage: string) {
        checkInArray.forEach((checkInInfo) => {
            checkInInfo.message = commitMessage;
        });
    }

    private ensureProvidersExist() {
        if (this.actualProviders.length === 0) {
            throw new Error("No cvs provider found");
        }
    }
}
