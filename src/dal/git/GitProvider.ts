import {Logger} from "../../bll/utils/logger";
import {CvsSupportProvider} from "../cvsprovider";
import {CvsResource} from "../../bll/entities/cvsresources/cvsresource";
import {CheckInInfo} from "../../bll/entities/checkininfo";
import {ReadableSet} from "../../bll/utils/readableset";
import {UriProxy} from "../../bll/moduleproxies/uri-proxy";
import {Uri} from "vscode";
import {GitStatusCommand} from "./GitStatusCommand";
import {GitCommandsFactory} from "./GitCommandsFactory";

export class GitProvider implements CvsSupportProvider {

    private readonly workspaceRootPath: string;

    public constructor(private readonly workspaceRootPathAsUri: UriProxy | Uri,
                       private readonly gitPath: string,
                       private readonly commandFactory: GitCommandsFactory) {
        this.workspaceRootPath = workspaceRootPathAsUri.fsPath;
    }

    public async getRequiredCheckInInfo(): Promise<CheckInInfo> {
        Logger.logDebug(`GitSupportProvider#getRequiredCheckinInfo: start getting local cvs resources`);
        const cvsLocalResources: CvsResource[] = await this.getChanges();
        Logger.logDebug(`GitSupportProvider#getRequiredCheckinInfo: found ${cvsLocalResources ? "not " : ""}empty`);

        return new CheckInInfo(cvsLocalResources, this, this.workspaceRootPath);
    }

    private async getChanges(): Promise<CvsResource[]> {
        const statusCommand: GitStatusCommand = await this.commandFactory.getStatusCommand();
        return statusCommand.execute();
    }

    public async getStagedFileContentStream(cvsResource: CvsResource): Promise<ReadableSet> {
        return this.commandFactory.getStagedFileContentStreamCommand(cvsResource).execute();
    }

    public async commit(checkInInfo: CheckInInfo): Promise<void> {
        Logger.logWarning("GitProvider#commit: the operation is not supported.");
        return Promise.resolve();
    }

    public getRootPath(): string {
        return this.workspaceRootPathAsUri.path;
    }

    public async getRepoBranchName(): Promise<string> {
        return this.commandFactory.getRepoBranchNameCommand().execute();
    }
}
