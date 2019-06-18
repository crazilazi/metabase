import { PermissionsApi, UserApi } from "metabase/services";
import _ from "underscore";

const analyser = 'Analyser';
const allUsers = 'All Users';

class GetCurrentUserPermission {

  // Is user allowed to save or ask question.
  static allowed = null;

  static getUserPermission = async () => {

    const currentUser = await UserApi.current();

    // if current user is super user, that is mean he is 'super man'
    if (currentUser.is_superuser || currentUser.group_ids.length > 3) {
      console.log('super user', currentUser);

      return GetCurrentUserPermission.createPermissionForCurrentUser('Admin', []);
    }

    const groups = await PermissionsApi.groups();
    const graph = await PermissionsApi.graph();
    // One user will have max 3 group
    // one group which he really belongs
    // 'All users' is default for all user
    // 'Analyser' is when he is admin of that group, that is mean
    // he can ask question and save data changes
    const userMainGroup = groups.find(x => !_.contains([analyser, allUsers], x.name) && _.contains(currentUser.group_ids, x.id));
    const userIsAnalyser = groups.find(x => x.name === analyser && _.contains(currentUser.group_ids, x.id));
    if (userIsAnalyser !== undefined && userMainGroup !== undefined) {
      // user is analyser
      console.log('Analyser user', currentUser);
      const currentUserDataAccess = graph.groups[userMainGroup.id][1];
      if (currentUserDataAccess.native === 'none' && typeof (currentUserDataAccess.schemas) === 'object'
        && Object.values(currentUserDataAccess.schemas.PUBLIC).find(x => x === 'all') === undefined) {

        return GetCurrentUserPermission.createPermissionForCurrentUser('Normal', []);
      }
      return GetCurrentUserPermission.createPermissionForCurrentUser('Analyser', ['AskQuestion', 'SaveReport', 'QueryFilter']);

    } else if (userIsAnalyser === undefined && userMainGroup !== undefined) {
      // user is normal user
      console.log('Normal user', currentUser);
      return GetCurrentUserPermission.createPermissionForCurrentUser('Normal', []);
    }
  }
  static setUserPermission = async () => {
    if (GetCurrentUserPermission.allowed === null) {
      GetCurrentUserPermission.allowed = await GetCurrentUserPermission.getUserPermission();
    }
    return GetCurrentUserPermission.allowed;
  }

  static createPermissionForCurrentUser = (userType, userPermissions) => {
    const permission = {
      AskQuestion: false, SaveReport: false, Reference: false, DuplicateDashboard: false,
      NewDashboard: false, Pulse: false, Activity: false, DataSection: false, QueryFilter: false,
      AddToDashBoard: false, LearnAboutData: false, Alerts: false, QueryModeToggle: false
    };

    switch (userType) {
      case 'Admin':
        Object.keys(permission).forEach(x => {
          permission[x] = true;
        });
        break;
      case 'Normal':
        Object.keys(permission).forEach(x => {
          permission[x] = false;
        });
        break;
      case 'Analyser':
        userPermissions.forEach(x => {
          permission[x] = true;
        });
        break;
      default:
        break;
    }
    return permission;
  }
}
export const CurrentUserPermission = GetCurrentUserPermission;