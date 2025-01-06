import List from "sap/m/List";
import Select from "sap/m/Select";
import ViewSettingsDialog from "sap/m/ViewSettingsDialog";
import Event from "sap/ui/base/Event";
import Fragment from "sap/ui/core/Fragment";
import Controller from "sap/ui/core/mvc/Controller";
import Filter from "sap/ui/model/Filter";
import FilterOperator from "sap/ui/model/FilterOperator";
import JSONModel from "sap/ui/model/json/JSONModel";
import ListBinding from "sap/ui/model/ListBinding";
import Sorter from "sap/ui/model/Sorter";

/**
 * @namespace at.clouddna.jsonmodelexample.controller
 */
export default class Main extends Controller {

    private oSkillSelectModel : JSONModel;
    private viewSettingsDialog : ViewSettingsDialog;

    /*eslint-disable @typescript-eslint/no-empty-function*/
    public onInit(): void {
        this.oSkillSelectModel = new JSONModel({
            selectedSkillLevel: "",
            skillLevels: [{"key": 1},{"key": 2},{"key": 3}]
        });
        this.getView()?.setModel(this.oSkillSelectModel, "filter");
        //this.getView()?.byId("filterbar")?.setModel(this.oSkillSelectModel);
    }

    private onSearch() {
        let oList = this.getView()?.byId("detail_list") as List,
            oListBinding = oList?.getBinding("items") as ListBinding,
            aFilter : Array<Filter> = [],
            sSelectedKey = this.oSkillSelectModel.getProperty("/selectedSkillLevel");

        if(sSelectedKey){
            aFilter.push(new Filter("skillLevel", FilterOperator.EQ, sSelectedKey));
        }

        oListBinding.filter(aFilter);
    }

    private onClear() {
        let oList = this.getView()?.byId("detail_list") as List,
            oListBinding = oList?.getBinding("items") as ListBinding;
        
        this.oSkillSelectModel.setProperty("/selectedSkillLevel", "");

        oListBinding.filter([]);
    }

    private openViewSettingsDialog() {
        if(!this.viewSettingsDialog){
            Fragment.load({
                id: this.getView()?.getId(),
                name: "at.clouddna.jsonmodelexample.view.fragment.ViewSettingsDialog",
                controller: this
            }).then((oDialog: any) => {
                this.getView()?.addDependent(oDialog);
                this.viewSettingsDialog = oDialog;
                this.viewSettingsDialog.open();
            });
        }else{
            this.viewSettingsDialog.open();
        }
    }

    private onConfirm(oEvent: Event) {
        let oList = this.getView()?.byId("detail_list") as List,
            oListBinding = oList?.getBinding("items") as ListBinding;
        
        let bSortDescending = oEvent.getParameters().sortDescending,
            sSortKey = oEvent.getParameters().sortItem.getKey();
        
        let oSorter = new Sorter(sSortKey, bSortDescending);

        oListBinding.sort(oSorter);
    }

    /* V1
    private onSearch() {
        let oList = this.getView()?.byId("detail_list") as List,
            oListBinding = oList?.getBinding("items") as ListBinding,
            aFilter : Array<Filter> = [];
        
        let oSelectSkillLevel = this.getView()?.byId("selectSkillLevel") as Select,
            sSelectedKey = oSelectSkillLevel.getSelectedKey();

        if(sSelectedKey){
            aFilter.push(new Filter("skillLevel", FilterOperator.EQ, sSelectedKey));
        }

        oListBinding.filter(aFilter);
    }

    private onClear() {
        let oList = this.getView()?.byId("detail_list") as List,
            oListBinding = oList?.getBinding("items") as ListBinding;

        let oSelectSkillLevel = this.getView()?.byId("selectSkillLevel") as Select;

        oSelectSkillLevel.setSelectedKey("");
        oListBinding.filter([]);
    }
    */
}