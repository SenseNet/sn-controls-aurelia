import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';
import { bootstrap } from 'aurelia-bootstrapper';
import { ComponentTestBase } from '../component-test.base';
import { ContentView } from '../../src/viewcontrols';
import { ContentTypes, ActionName, FieldSettings, Retrier } from 'sn-client-js';
import { DumpField } from '../../src/fieldcontrols';
import { ValidationController, ValidateBindingBehavior } from 'aurelia-validation';
import { FieldControlBaseTest } from './fieldcontrol-base.tests';

@suite('DumpField component')
export class DumpFieldTests extends FieldControlBaseTest<DumpField> {
    /**
     *
     */
    constructor() {
        super(DumpField, 'dump-field');
        
    }

    @test
    public async 'Can be constructed'() {
        const viewModel = await this.createFieldViewModel();
        expect(viewModel).to.be.instanceof(DumpField);
    }
}