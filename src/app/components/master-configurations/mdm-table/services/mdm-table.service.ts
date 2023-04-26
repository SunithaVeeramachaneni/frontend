import { Injectable } from '@angular/core';
import { AppService } from 'src/app/shared/services/app.services';
import { environment } from 'src/environments/environment';
import { DeleteMDMTable } from 'src/app/interfaces/master-data-management/mdmTable';

@Injectable({
  providedIn: 'root'
})
export class MdmTableService {
  constructor(private _appService: AppService) {}

  fetchAllTables$ = () =>
    this._appService._getResp(
      environment.masterConfigApiUrl,
      'masterconfigapi/masterdata/list'
    );

  createTable$ = (data) =>
    this._appService._postData(
      environment.masterConfigApiUrl,
      'masterconfigapi/masterdata/create',
      {
        data
      }
    );

  getTableDefinition$ = (tableID) =>
    this._appService._getResp(
      environment.masterConfigApiUrl,
      `masterconfigapi/masterdata/${tableID}/get`
    );

  fetchTablesList$ = (tableID) =>
    this._appService._getResp(
      environment.masterConfigApiUrl,
      `mdmtable/${tableID}/list`
    );

  getTableItem$ = (tableID, id) =>
    this._appService._getResp(
      environment.masterConfigApiUrl,
      `mdmtable/${tableID}/${id}/get`
    );

  createTableItem$ = (tableID, data) =>
    this._appService._postData(
      environment.masterConfigApiUrl,
      `mdmtable/${tableID}/create`,
      {
        data
      }
    );

  updateTableItem$ = (tableID, id, data) =>
    this._appService.patchData(
      environment.masterConfigApiUrl,
      `mdmtable/${tableID}/${id}/update`,
      {
        data
      }
    );

  deleteTableItem$ = (tableID, values: DeleteMDMTable) =>
    this._appService._removeData(
      environment.masterConfigApiUrl,
      `mdmtable/${tableID}/${JSON.stringify(values)}/delete`
    );
}
