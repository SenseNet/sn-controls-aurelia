import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';
import { bootstrap } from 'aurelia-bootstrapper';
import { ComponentTestBase } from '../component-test.base';
import { ContentView } from '../../src/viewcontrols';
import { ContentTypes, ActionName, FieldSettings, Retrier } from 'sn-client-js';
import { Icon } from '../../src/fieldcontrols';
import { ValidationController, ValidateBindingBehavior } from 'aurelia-validation';
import { FieldControlBaseTest } from './fieldcontrol-base.tests';

@suite('DumpField component')
export class IconTests extends FieldControlBaseTest<Icon> {

    constructor() {
        super(Icon, 'icon');

    }

    @test
    public async 'Can be constructed'() {
        const viewModel = await this.createFieldViewModel();
        expect(viewModel).to.be.instanceof(Icon);
    }

}