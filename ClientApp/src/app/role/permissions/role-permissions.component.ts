import { Component, OnInit} from '@angular/core';
import { Select, Store } from '@ngxs/store';

import { Observable, combineLatest } from '../../../../node_modules/rxjs';
import { SelectionModel } from '@angular/cdk/collections';
import { BaseComponent } from '../../core/base.component';
import { Role, Permission } from '../../core/models';
import { PermissionService } from '../../core/services';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MessageService } from '../../shared/message/message.service';
import { AddPermissionsToRole, DeletePermissionToRole, GetRolePermissions } from './role-permissions.state';

@Component({
  selector: 'app-role-permissions',
  templateUrl: './role-permissions.component.html',
  styleUrls: ['./role-permissions.component.scss']
})
export class RolePermissionsComponent extends BaseComponent implements OnInit {

  @Select(state => state.rolePermissions.permissions) rolePermissions$: Observable<Role[]>;
  @Select(state => state.role.role) role$: Observable<Role>;

  role: Role;

  displayedColumns: string[] = ['name', 'actions'];
  displayedColumns2: string[] = ['select', 'name'];

  columnsToDisplay: string[] = this.displayedColumns.slice();
  rolePermissions: Permission[];
  unselectedPermissions: Permission[];

  selection = new SelectionModel<Permission>(true, []);


  constructor(
    private permissionService: PermissionService,
    private messageService: MessageService,
    public dialog: MatDialog,
    private store: Store,
    public snackBar: MatSnackBar) {
      super();
  }

  ngOnInit() {
    this.role$.subscribe(role => {
        this.role = role;
        this.store.dispatch(new GetRolePermissions(role.id));
    })
    
    combineLatest(this.rolePermissions$, this.permissionService.searchPermissions('')).subscribe(([rolePermissions, permissions]) => {
      this.rolePermissions = rolePermissions.map(s => Object.assign(new Permission(), s));
      this.unselectedPermissions = permissions.filter(p => !this.rolePermissions.some(rp => rp.name == p.name))
    });
  }


  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.unselectedPermissions.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.unselectedPermissions.forEach(row => this.selection.select(row));
  }

  addSelectedPermissions() {
    this.selection.selected.forEach(select => select.roleId = this.role.id);
    this.store.dispatch(new AddPermissionsToRole(this.selection.selected)).subscribe(() => {
      this.messageService.openSuccessMessage('saved');
    });
    this.selection.clear();
  }

  deletePermission(permission) {
    permission.roleId = this.role.id;
    this.store.dispatch(new DeletePermissionToRole(permission)).subscribe(() => {
      this.messageService.openSuccessMessage('deleted');
    });
  }
}

