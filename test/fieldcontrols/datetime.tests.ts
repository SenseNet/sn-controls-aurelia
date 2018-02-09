import { IDisposable } from "@sensenet/client-utils";
import { DateTimeFieldSetting } from "@sensenet/default-content-types";
import { expect } from "chai";
import { DateTime } from "../../src/fieldcontrols";
import { ComponentTestHelper } from "../component-test-helper";

export const dateTimeTests = describe("DateTime Field component", () => {
    const createFieldViewModel = () => ComponentTestHelper.createAndGetViewModel<DateTime>("<date-time></date-time>", "date-time");

    let viewModel: DateTime & IDisposable;

    beforeEach(async () => {
        viewModel = await createFieldViewModel();
    });

    afterEach(() => {
        viewModel.dispose();
    });

    it("Can be constructed", () => {
        expect(viewModel).to.be.instanceof(DateTime);
    });

    it("Can not be modified if is read only", () => {
        viewModel.settings = {
            ReadOnly: true,
        } as DateTimeFieldSetting;
        viewModel.content = {Id: 1285, Path: "root/path", Name: "", Type: "User"};

        const contentViewElement = document.querySelector("date-time input") as HTMLInputElement;
        expect(contentViewElement.disabled).to.be.eq(true);
    });

    it("Required rule is added if complusory", () => {
        viewModel.settings = {
            Compulsory: true,
        } as DateTimeFieldSetting;
        viewModel.content = {Id: 1285, Path: "root/path", Name: "", Type: "User"};

        const rules = viewModel.rules;
        expect(rules[0][0].messageKey).to.be.eq("required");
    });

});

    // @test
    // public async 'Date value and Time value is concatenated as an UTC value'(){

    //     const viewModel = await this.createFieldViewModel(); //contentViewElement.au.controller.viewModel as DateTime;
    //     viewModel.settings = new FieldSettings.DateTimeFieldSetting({
    //         compulsory: true
    //     });
    //     viewModel.content = new ContentTypes.Task({} as any, this.mockRepo);

    //     viewModel.localeService.Timezone = 'Europe/Budapest';
    //     viewModel.valueDate = '2017-01-01';
    //     viewModel.valueDateChanged();

    //     viewModel.valueTime = '10:00';
    //     viewModel.valueTimeChanged();

    //     expect(viewModel.value).to.be.eq('2017-01-01T09:00:00.000Z');

    // }

    // @test
    // public async 'Value should be splitted and converted to local date and time'(){

    //     const viewModel = await this.createFieldViewModel();
    //     viewModel.settings = new FieldSettings.DateTimeFieldSetting({
    //         compulsory: true
    //     });
    //     viewModel.content = new ContentTypes.Task({} as any, this.mockRepo);

    //     viewModel.value = '2017-01-01T09:00:00.000Z';
    //     viewModel.localeService.Timezone = 'Europe/Budapest';
    //     viewModel.valueChanged();

    //     expect(viewModel.valueTime).to.be.eq('10:00:00');
    //     expect(viewModel.valueDate).to.be.eq('2017-01 01');
    // }

    // @test
    // public async 'Activate should trigger fillDateTimeValues'(){
    //     const viewModel = await this.createFieldViewModel();
    //     viewModel.settings = new FieldSettings.DateTimeFieldSetting({
    //         compulsory: true,
    //         name: 'DueDate'
    //     });
    //     viewModel.content = this.mockRepo.CreateContent({
    //         DueDate: '2017-01-01T09:00:00.000Z'
    //     } , ContentTypes.Task);
    //     viewModel.value = '2017-01-01T09:00:00.000Z';
    //     viewModel.localeService.Timezone = 'Europe/Budapest';

    //     viewModel.activate({
    //         settings: viewModel.settings,
    //         content: viewModel.content,
    //         controller: viewModel.controller,
    //         actionName: viewModel.actionName,
    //     });

    //     expect(viewModel.valueDate).to.be.eq('2017-01 01');
    //     expect(viewModel.valueTime).to.be.eq('10:00:00');
    // }

    //     @test
    // public async 'fillDateTimeValues shouldn\'t fill Date and Time with current DateTime if no value provided'(){
    //     const viewModel = await this.createFieldViewModel();
    //     viewModel.settings = new FieldSettings.DateTimeFieldSetting({
    //         compulsory: true,
    //     });
    //     viewModel.content = new ContentTypes.Task({}, this.mockRepo);
    //     viewModel.fillDateTimeValues();

    //     expect(viewModel.valueDate).to.be.eq(undefined);
    //     expect(viewModel.valueTime).to.be.eq(undefined);
    // }
// }
