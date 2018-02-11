import {commands, Disposable, window} from "vscode";
import {EmptyDataProvider} from "./dataproviders/emptydataprovider";
import {DataProvider} from "./dataproviders/dataprovider";
import {inject, injectable} from "inversify";
import {ResourceProvider} from "./dataproviders/resourceprovider";
import {BuildProvider} from "./dataproviders/buildprovider";
import {DataProviderEnum, TYPES} from "../bll/utils/constants";
import {IProviderManager} from "./iprovidermanager";

@injectable()
export class ProviderManager implements IProviderManager {

    private shownDataProvider: DataProvider;
    private readonly emptyDataProvider: EmptyDataProvider;
    private readonly resourcesProvider: ResourceProvider;
    private readonly buildsProvider: BuildProvider;
    private readonly toDispose: Disposable[] = [];

    constructor(@inject(TYPES.ResourceProvider) resourceProvider: ResourceProvider,
                @inject(TYPES.BuildProvider) buildProvider: BuildProvider) {
        this.emptyDataProvider = new EmptyDataProvider();
        this.resourcesProvider = resourceProvider;
        this.buildsProvider = buildProvider;
        this.hideProviders();
        if (resourceProvider && buildProvider) {
            this.toDispose.push(window.registerTreeDataProvider("teamcityResourceExplorer", resourceProvider));
            this.toDispose.push(window.registerTreeDataProvider("teamcityBuildsExplorer", buildProvider));
        }
    }

    public hideProviders(): void {
        commands.executeCommand("setContext", "teamcity-explorer", "");
        this.shownDataProvider = undefined;
    }

    public showEmptyDataProvider(): void {
        this.emptyDataProvider.show();
        this.shownDataProvider = this.emptyDataProvider;
    }

    public showResourceProvider(): void {
        this.resourcesProvider.show();
        this.shownDataProvider = this.resourcesProvider;
    }

    public showBuildProvider(): void {
        this.buildsProvider.show();
        this.shownDataProvider = this.buildsProvider;
    }

    public getShownDataProvider(): DataProviderEnum {
        return this.shownDataProvider ? this.shownDataProvider.getType() : undefined;
    }

    public refreshAll() {
        if (this.resourcesProvider) {
            this.resourcesProvider.refreshTreePresentation();
            this.buildsProvider.refreshTreePresentation();
        }
    }

    public dispose() {
        this.toDispose.forEach((toDispose) => {
            toDispose.dispose();
        });
    }
}
