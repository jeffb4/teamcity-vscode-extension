import {Container} from "inversify";
import {TYPES} from "./bll/utils/constants";
import {Settings} from "./bll/entities/settings";
import {SettingsImpl} from "./bll/entities/settingsimpl";
import {CredentialsStore} from "./bll/credentialsstore/credentialsstore";
import {InMemoryCredentialsStore} from "./bll/credentialsstore/inmemorycredentialsstore";
import {ExtensionManager} from "./extensionmanager";
import {CommandHolder} from "./commandholder";
import {NotificationWatcherImpl} from "./bll/notifications/notificationwatcherimpl";
import {NotificationWatcher} from "./bll/notifications/notificationwatcher";
import {RemoteLogin} from "./dal/remotelogin";
import {RemoteBuildServer} from "./dal/remotebuildserver";
import {WebLinks} from "./dal/weblinks";
import {CustomPatchSender} from "./bll/remoterun/patchsender";
import {SummaryDao} from "./dal/summarydao";
import {BuildDao} from "./dal/builddao";
import {TeamCityOutput} from "./view/teamcityoutput";
import {Output} from "./view/output";
import {PatchManager} from "./bll/utils/patchmanager";
import {XmlParser} from "./bll/utils/xmlparser";
import {CvsProviderProxy} from "./dal/cvsproviderproxy";
import {SignIn} from "./bll/commands/signin";
import {SelectFilesForRemoteRun} from "./bll/commands/selectfilesforremoterun";
import {GetSuitableConfigs} from "./bll/commands/getsuitableconfigs";
import {RemoteRun} from "./bll/commands/remoterun";
import {PersistentStorageManager} from "./bll/credentialsstore/persistentstoragemanager";
import {WinPersistentCredentialsStore} from "./bll/credentialsstore/win32/win-credstore";
import {WindowsCredentialStoreApi} from "./bll/credentialsstore/win32/win-credstore-api";
import {LinuxFileApi} from "./bll/credentialsstore/linux/linux-file-api";
import {OsProxy} from "./bll/moduleproxies/os-proxy";
import {ProviderManager} from "./view/providermanager";
import {SignOut} from "./bll/commands/signout";
import {ResourceProvider} from "./view/dataproviders/resourceprovider";
import {BuildProvider} from "./view/dataproviders/buildprovider";
import {OsxKeychainApi} from "./bll/credentialsstore/osx/osx-keychain-api";
import {OsxKeychain} from "./bll/credentialsstore/osx/osx-keychain-access";
import {FileTokenStorage} from "./bll/credentialsstore/linux/file-token-storage";
import {WinCredStoreParsingStreamWrapper} from "./bll/credentialsstore/win32/win-credstore-parser";
import {OsxSecurityParsingStreamWrapper} from "./bll/credentialsstore/osx/osx-keychain-parser";
import {FsProxy} from "./bll/moduleproxies/fs-proxy";
import {PathProxy} from "./bll/moduleproxies/path-proxy";
import {CpProxy} from "./bll/moduleproxies/cp-proxy";
import {IVsCodeUtils} from "./bll/utils/ivscodeutils";
import {VsCodeUtils} from "./bll/utils/vscodeutils";
import {TeamCityStatusBarItem} from "./view/teamcitystatusbaritem";
import {WorkspaceProxy} from "./bll/moduleproxies/workspace-proxy";
import {ShowMyChanges} from "./bll/commands/showmychanges";
import {IResourceProvider} from "./view/dataproviders/interfaces/iresourceprovider";
import {IBuildProvider} from "./view/dataproviders/interfaces/ibuildprovider";
import {IProviderManager} from "./view/iprovidermanager";
import {IChangesProvider} from "./view/dataproviders/interfaces/ichangesprovider";
import {ChangesProvider} from "./view/dataproviders/changesprovider";
import {WindowProxy} from "./bll/moduleproxies/window-proxy";
import {RequestProxy} from "./bll/moduleproxies/request-proxy";
import {MessageManager} from "./view/messagemanager";
import {WebLinkListener} from "./dal/weblinklistener";
import {HttpHostRequest} from "./bll/weblinklistener/httphostrequest";
import {UriProxy} from "./bll/moduleproxies/uri-proxy";
import {GitProviderActivator} from "./dal/git/GitProviderActivator";
import {GitIsActiveValidator} from "./bll/cvsutils/gitisactivevalidator";
import {ProcessProxy} from "./bll/moduleproxies/process-proxy";
import {GitPathFinder} from "./bll/cvsutils/gitpathfinder";
import {GitStatusRowsParser} from "./dal/git/GitStatusRowsParser";
import {GitCommandArgumentsParser} from "./dal/git/GitCommandArgumentsParser";
import {GitCommandsFactory} from "./dal/git/GitCommandsFactory";
import {Context} from "./view/Context";
import {ContextImpl} from "./view/ContextImpl";
import {IBuildSettingsProvider} from "./view/dataproviders/interfaces/IBuildSettingsProvider";
import {BuildSettingsProvider} from "./view/dataproviders/BuildSettingsProvider";
import {CustomizeBuild} from "./bll/commands/CustomizeBuild";
import {AddBuildParameter} from "./bll/commands/AddBuildParameter";
import {RemoveBuildParameter} from "./bll/commands/RemoveBuildParameter";

export const myContainer = new Container();
myContainer.bind<Settings>(TYPES.Settings).to(SettingsImpl).inSingletonScope();
myContainer.bind<Output>(TYPES.Output).to(TeamCityOutput).inSingletonScope();
myContainer.bind<CredentialsStore>(TYPES.CredentialsStore).to(InMemoryCredentialsStore).inSingletonScope();
myContainer.bind<ExtensionManager>(TYPES.ExtensionManager).to(ExtensionManager).inSingletonScope();
myContainer.bind<CommandHolder>(TYPES.CommandHolder).to(CommandHolder).inSingletonScope();
myContainer.bind<NotificationWatcher>(TYPES.NotificationWatcher).to(NotificationWatcherImpl).inSingletonScope();
myContainer.bind<RemoteLogin>(TYPES.RemoteLogin).to(RemoteLogin).inSingletonScope();
myContainer.bind<RemoteBuildServer>(TYPES.RemoteBuildServer).to(RemoteBuildServer).inSingletonScope();
myContainer.bind<WebLinks>(TYPES.WebLinks).to(WebLinks).inSingletonScope();
myContainer.bind<CustomPatchSender>(TYPES.PatchSender).to(CustomPatchSender).inSingletonScope();
myContainer.bind<SummaryDao>(TYPES.SummaryDao).to(SummaryDao).inSingletonScope();
myContainer.bind<BuildDao>(TYPES.BuildDao).to(BuildDao).inSingletonScope();
myContainer.bind<PatchManager>(TYPES.PatchManager).to(PatchManager).inSingletonScope();
myContainer.bind<XmlParser>(TYPES.XmlParser).to(XmlParser).inSingletonScope();
myContainer.bind<CvsProviderProxy>(TYPES.CvsProviderProxy).to(CvsProviderProxy).inSingletonScope();
myContainer.bind<SignIn>(TYPES.SignIn).to(SignIn).inSingletonScope();
myContainer.bind<SignOut>(TYPES.SignOut).to(SignOut).inSingletonScope();
myContainer.bind<SelectFilesForRemoteRun>(TYPES.SelectFilesForRemoteRun).to(SelectFilesForRemoteRun).inSingletonScope();
myContainer.bind<GetSuitableConfigs>(TYPES.GetSuitableConfigs).to(GetSuitableConfigs).inSingletonScope();
myContainer.bind<RemoteRun>(TYPES.RemoteRun).to(RemoteRun).inSingletonScope();
myContainer.bind<PersistentStorageManager>(TYPES.PersistentStorageManager).to(PersistentStorageManager).inSingletonScope();
myContainer.bind<WindowsCredentialStoreApi>(TYPES.WindowsCredentialStoreApi).to(WindowsCredentialStoreApi).inSingletonScope();
myContainer.bind<LinuxFileApi>(TYPES.LinuxFileApi).to(LinuxFileApi).inSingletonScope();
myContainer.bind<WinPersistentCredentialsStore>(TYPES.WinPersistentCredentialsStore).to(WinPersistentCredentialsStore).inSingletonScope();
myContainer.bind<OsProxy>(TYPES.OsProxy).to(OsProxy).inSingletonScope();
myContainer.bind<FsProxy>(TYPES.FsProxy).to(FsProxy).inSingletonScope();
myContainer.bind<PathProxy>(TYPES.PathProxy).to(PathProxy).inSingletonScope();
myContainer.bind<CpProxy>(TYPES.CpProxy).to(CpProxy).inSingletonScope();
myContainer.bind<ProcessProxy>(TYPES.ProcessProxy).to(ProcessProxy).inSingletonScope();
myContainer.bind<IProviderManager>(TYPES.ProviderManager).to(ProviderManager).inSingletonScope();
myContainer.bind<IResourceProvider>(TYPES.ResourceProvider).to(ResourceProvider).inSingletonScope();
myContainer.bind<IBuildProvider>(TYPES.BuildProvider).to(BuildProvider).inSingletonScope();
myContainer.bind<OsxKeychainApi>(TYPES.OsxKeychainApi).to(OsxKeychainApi).inSingletonScope();
myContainer.bind<OsxKeychain>(TYPES.OsxKeychain).to(OsxKeychain).inSingletonScope();
myContainer.bind<FileTokenStorage>(TYPES.FileTokenStorage).to(FileTokenStorage).inSingletonScope();
myContainer.bind<WinCredStoreParsingStreamWrapper>(TYPES.WinCredStoreParsingStreamWrapper).to(WinCredStoreParsingStreamWrapper).inSingletonScope();
myContainer.bind<OsxSecurityParsingStreamWrapper>(TYPES.OsxSecurityParsingStreamWrapper).to(OsxSecurityParsingStreamWrapper).inSingletonScope();
myContainer.bind<IVsCodeUtils>(TYPES.VsCodeUtils).to(VsCodeUtils).inSingletonScope();
myContainer.bind<TeamCityStatusBarItem>(TYPES.TeamCityStatusBarItem).to(TeamCityStatusBarItem).inSingletonScope();
myContainer.bind<WorkspaceProxy>(TYPES.WorkspaceProxy).to(WorkspaceProxy).inSingletonScope();
myContainer.bind<Command>(TYPES.ShowMyChangesCommand).to(ShowMyChanges).inSingletonScope();
myContainer.bind<IChangesProvider>(TYPES.ChangesProvider).to(ChangesProvider).inSingletonScope();
myContainer.bind<WindowProxy>(TYPES.WindowProxy).to(WindowProxy).inSingletonScope();
myContainer.bind<RequestProxy>(TYPES.RequestProxy).to(RequestProxy).inSingletonScope();
myContainer.bind<MessageManager>(TYPES.MessageManager).to(MessageManager).inSingletonScope();
myContainer.bind<WebLinkListener>(TYPES.WebLinkListener).to(WebLinkListener).inSingletonScope();
myContainer.bind<HttpHostRequest>(TYPES.HttpHostRequest).to(HttpHostRequest).inSingletonScope();
myContainer.bind<UriProxy>(TYPES.UriProxy).to(UriProxy).inSingletonScope();
myContainer.bind<GitProviderActivator>(TYPES.GitProviderActivator).to(GitProviderActivator).inSingletonScope();
myContainer.bind<GitIsActiveValidator>(TYPES.GitIsActiveValidator).to(GitIsActiveValidator).inSingletonScope();
myContainer.bind<GitPathFinder>(TYPES.GitPathFinder).to(GitPathFinder).inSingletonScope();
myContainer.bind<GitStatusRowsParser>(TYPES.GitStatusRowsParser).to(GitStatusRowsParser).inSingletonScope();
myContainer.bind<GitCommandArgumentsParser>(TYPES.GitCommandArgumentsParser).to(GitCommandArgumentsParser).inSingletonScope();
myContainer.bind<GitCommandsFactory>(TYPES.GitCommandsFactory).to(GitCommandsFactory).inSingletonScope();
myContainer.bind<Context>(TYPES.Context).to(ContextImpl).inSingletonScope();
myContainer.bind<IBuildSettingsProvider>(TYPES.BuildSettingsProvider).to(BuildSettingsProvider).inSingletonScope();
myContainer.bind<CustomizeBuild>(TYPES.CustomizeBuild).to(CustomizeBuild).inSingletonScope();
myContainer.bind<AddBuildParameter>(TYPES.AddBuildParameter).to(AddBuildParameter).inSingletonScope();
myContainer.bind<RemoveBuildParameter>(TYPES.RemoveBuildParameter).to(RemoveBuildParameter).inSingletonScope();
