import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';
import { ContentTypes, FieldSettings } from 'sn-client-js';
import { Percentage } from '../../src/fieldcontrols';
import { FieldControlBaseTest } from './fieldcontrol-base.tests';

@suite('Percentage component')
export class PercentageTests extends FieldControlBaseTest<Percentage> {
    constructor() {
        super(Percentage, 'percentage');
        
    }
    
    @test
    public async 'Can be constructed'() {
        const viewModel = await this.createFieldViewModel();
        expect(viewModel).to.be.instanceof(Percentage);
    }

    @test
    public async 'Can not be modified if is read only'() {
        const viewModel = await this.createFieldViewModel();       
        viewModel.settings = {
            ReadOnly: true
        } as FieldSettings.NumberFieldSetting;
        viewModel.content = this.mockRepo.HandleLoadedContent({Id: 12487, Path: 'root/path', Name: 'C1'}); ;
        const contentViewElement = document.querySelector('percentage .mdc-slider') as HTMLInputElement;
        expect(contentViewElement.getAttribute('aria-disabled')).to.be.eq('true');
    }

    @test
    public async 'Value will be bound back on change'() {
        const viewModel = await this.createFieldViewModel();       
        
        const content = this.mockRepo.HandleLoadedContent<ContentTypes.Task>({
            Id: 12976,
            Path: 'root/path',
            Name: 'TestTask',
            TaskCompletion: 5
        }) as any;
        

        const settings = {
            ReadOnly: true,
            Name: 'TaskCompletion'
        } as FieldSettings.NumberFieldSetting;
        viewModel.activate({content, settings, controller: null as any, actionName: 'edit' });

        viewModel.mdcSlider.stepUp(6);
        viewModel.mdcSlider.emit('MDCSlider:change');
        expect(viewModel.value).to.be.eq(6);
    }

}