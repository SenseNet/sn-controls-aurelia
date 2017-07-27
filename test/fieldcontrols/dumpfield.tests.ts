import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';
import { DumpField } from '../../src/fieldcontrols';
import { FieldControlBaseTest } from './fieldcontrol-base.tests';

@suite('DumpField component')
export class DumpFieldTests extends FieldControlBaseTest<DumpField> {

    constructor() {
        super(DumpField, 'dump-field');
        
    }

    @test
    public async 'Can be constructed'() {
        const viewModel = await this.createFieldViewModel();
        expect(viewModel).to.be.instanceof(DumpField);
    }
}